import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'
import { formatCurrency } from '../utils/format'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type RelatedRecord = {
  id: number
  label?: string
  name?: string
  rate?: number | string
}

type Product = {
  id: number
  name: string
  description?: string
  unit_price: number | string
  currency?: string
  tax?: number | RelatedRecord | null
  uom?: RelatedRecord | null
  category?: string | null
  priority?: number | null
  is_active?: boolean
}

type Organization = {
  id: number
  name?: string
  currency?: string
  whatsapp_number?: string
  tax_enabled?: boolean
  default_tax_rate?: number | string | null
}

type CartItem = Product & { qty: number }

type CustomerContact = {
  name: string
  phone: string
  email: string
}

const CART_STORAGE_KEY = 'storefront_cart_v1'

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const stringifyNumber = (value: number | string | undefined | null): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

const buildCategoryLabel = (product: Product): string => {
  if (product.category) return product.category
  if (product.uom?.label) return product.uom.label
  if (product.uom?.name) return product.uom.name
  return 'Autres'
}

const cleansePhone = (raw: string | undefined | null): string => {
  if (!raw) return ''
  return raw.replace(/\D/g, '')
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([])
  const [org, setOrg] = useState<Organization | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<CustomerContact>({ name: '', phone: '', email: '' })
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'archived'>(
    'available',
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const basePriceRangeRef = useRef<[number, number]>([0, 0])
  const didInitFromStorage = useRef(false)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const [productsResponse, organizationsResponse] = await Promise.all([
        api.get('/products/', { params: { page_size: 200, ordering: 'priority,name' } }),
        api.get('/organizations/'),
      ])
      const fetchedProducts = asArray<Product>(productsResponse.data)
      setProducts(fetchedProducts)
      const organizations = asArray<Organization>(organizationsResponse.data)
      setOrg(organizations[0] ?? null)
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger la boutique. Verifiez votre connexion."
      setError(message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (didInitFromStorage.current) return
    try {
      const serialized = localStorage.getItem(CART_STORAGE_KEY)
      if (serialized) {
        const parsed = JSON.parse(serialized)
        if (Array.isArray(parsed)) {
          const restored = parsed
            .filter((item) => item && typeof item.id === 'number' && typeof item.qty === 'number')
            .map((item) => ({
              ...item,
              qty: item.qty > 0 ? item.qty : 1,
            }))
          setCart(restored)
        }
      }
    } catch {
      // ignore corrupted storage
    } finally {
      didInitFromStorage.current = true
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore quota errors
    }
  }, [cart])

  useEffect(() => {
    if (products.length === 0) return
    const prices = products.map((product) => stringifyNumber(product.unit_price))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    basePriceRangeRef.current = [min, max]
    setPriceRange((prev) => {
      if (prev[0] === 0 && prev[1] === 0) {
        return [min, max]
      }
      return [
        Math.max(min, prev[0] ?? min),
        Math.min(max, prev[1] ?? max),
      ]
    })
  }, [products])

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((product) => set.add(buildCategoryLabel(product)))
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [products])

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = priceRange
    const normalizedSearch = normalize(searchTerm)
    return products
      .filter((product) => {
        if (availabilityFilter === 'available' && product.is_active === false) return false
        if (availabilityFilter === 'archived' && product.is_active !== false) return false

        if (selectedCategory !== 'all' && buildCategoryLabel(product) !== selectedCategory) {
          return false
        }

        const price = stringifyNumber(product.unit_price)
        if (price < minPrice || price > maxPrice) return false

        if (!normalizedSearch) return true
        const haystack = [
          product.name,
          product.description,
          buildCategoryLabel(product),
        ]
          .filter(Boolean)
          .map((value) => normalize(String(value)))
          .join(' ')
        return haystack.includes(normalizedSearch)
      })
      .sort((a, b) => {
        const priorityA = a.priority ?? 999
        const priorityB = b.priority ?? 999
        if (priorityA !== priorityB) return priorityA - priorityB
        return a.name.localeCompare(b.name)
      })
  }, [availabilityFilter, priceRange, products, searchTerm, selectedCategory])

  const currency = useMemo(() => org?.currency ?? cart[0]?.currency ?? 'XOF', [cart, org])

  const cartTotals = useMemo(() => {
    let subtotal = 0
    let taxTotal = 0
    let totalItems = 0
    const defaultTaxRate =
      org?.tax_enabled && org.default_tax_rate !== null && org.default_tax_rate !== undefined
        ? stringifyNumber(org.default_tax_rate)
        : 0
    cart.forEach((item) => {
      const qty = item.qty
      const unitPrice = stringifyNumber(item.unit_price)
      const lineSubtotal = qty * unitPrice
      subtotal += lineSubtotal
      totalItems += qty
      if (org?.tax_enabled) {
        let rate = 0
        if (item.tax && typeof item.tax === 'object') {
          rate = stringifyNumber(item.tax.rate ?? 0)
        } else if (typeof item.tax === 'number') {
          rate = item.tax
        } else {
          rate = defaultTaxRate
        }
        if (rate > 0) {
          taxTotal += (lineSubtotal * rate) / 100
        }
      }
    })
    return {
      subtotal,
      taxTotal,
      grandTotal: subtotal + taxTotal,
      totalItems,
    }
  }, [cart, org])

  const whatsappMessage = useMemo(() => {
    if (cart.length === 0) return ''
    const lines = cart.map((item, index) => {
      const lineTotal = stringifyNumber(item.unit_price) * item.qty
      return `${index + 1}. ${item.name} x${item.qty} = ${formatCurrency(lineTotal, currency)}`
    })

    const headerParts = ['Commande boutique']
    if (org?.name) headerParts.push(org.name)
    const header = headerParts.join(' - ')

    const customerLines: string[] = []
    if (customer.name) customerLines.push(`Client: ${customer.name}`)
    if (customer.phone) customerLines.push(`Telephone: ${customer.phone}`)
    if (customer.email) customerLines.push(`Email: ${customer.email}`)

    const totalsLines = [
      `Total HT: ${formatCurrency(cartTotals.subtotal, currency)}`,
    ]
    if (cartTotals.taxTotal > 0) {
      totalsLines.push(`TVA: ${formatCurrency(cartTotals.taxTotal, currency)}`)
    }
    totalsLines.push(`Total TTC: ${formatCurrency(cartTotals.grandTotal, currency)}`)

    return (
      `${header}\n\n` +
      `${lines.join('\n')}\n\n` +
      totalsLines.join('\n') +
      (customerLines.length ? `\n\n${customerLines.join('\n')}` : '')
    )
  }, [cart, cartTotals.grandTotal, cartTotals.subtotal, cartTotals.taxTotal, currency, customer, org])

  const whatsappUrl = useMemo(() => {
    if (cart.length === 0) return ''
    const phone = cleansePhone(org?.whatsapp_number)
    const baseUrl = phone ? `https://wa.me/${phone}` : 'https://wa.me/'
    return `${baseUrl}?text=${encodeURIComponent(whatsappMessage)}`
  }, [cart.length, org?.whatsapp_number, whatsappMessage])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.findIndex((item) => item.id === product.id)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], qty: next[existing].qty + 1 }
        return next
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setFeedback(null)
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((item) => (item.id === productId ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
      return next
    })
  }

  const removeItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const handleCustomerChange =
    (field: keyof CustomerContact) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setCustomer((prev) => ({ ...prev, [field]: value }))
    }

  const handleWhatsAppOrder = () => {
    if (!cart.length) return
    if (!whatsappUrl) {
      setFeedback("Numero WhatsApp indisponible sur l'organisation.")
      return
    }
    window.open(whatsappUrl, '_blank', 'noopener')
    clearCart()
    setFeedback('Lien WhatsApp ouvert dans un nouvel onglet.')
  }

  const orderOnSite = async () => {
    if (cart.length === 0) return
    const items = cart.map((item) => ({
      product: item.id,
      quantity: item.qty,
      unit_price: stringifyNumber(item.unit_price),
    }))
    setIsSubmitting(true)
    setFeedback(null)
    try {
      await api.post('/orders/', {
        customer_name: customer.name || 'Client',
        customer_phone: customer.phone,
        customer_email: customer.email,
        items,
      })
      setFeedback('Commande envoyee !')
      clearCart()
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : 'Hors ligne : la commande sera synchronisee a la prochaine connexion.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const [minPrice, maxPrice] = priceRange
  const basePriceRange = basePriceRangeRef.current

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(event.target.value)
    const parsed = Number.isFinite(raw) ? raw : basePriceRange[0]
    const clamped = Math.max(basePriceRange[0], Math.min(parsed, maxPrice))
    setPriceRange([clamped, maxPrice])
  }

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(event.target.value)
    const parsed = Number.isFinite(raw) ? raw : basePriceRange[1]
    const clamped = Math.min(basePriceRange[1], Math.max(parsed, minPrice))
    setPriceRange([minPrice, clamped])
  }

  return (
    <div className="grid gap-4 p-4">
      {status === 'error' && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700 shadow-sm">
          {error}
          <div className="mt-3">
            <Button size="sm" variant="ghost" onClick={load}>
              Reessayer
            </Button>
          </div>
        </div>
      )}

      <Card
        title="Boutique"
        description="Recherchez vos produits et preparez le panier avant partage."
        contentClassName="gap-4"
        actions={
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {filteredProducts.length} produits
          </span>
        }
      >
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Recherche (nom ou description)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">Toutes les categories</option>
            {categories
              .filter((category) => category !== 'all')
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          <select
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(event.target.value as 'all' | 'available' | 'archived')
            }
          >
            <option value="available">Disponibles</option>
            <option value="all">Tous</option>
            <option value="archived">Archives</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              min={basePriceRange[0]}
              max={basePriceRange[1]}
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <input
              type="number"
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              min={basePriceRange[0]}
              max={basePriceRange[1]}
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>

        {status === 'loading' ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Aucun produit ne correspond aux criteres. Ajustez vos filtres.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft"
              >
                <div className="grid gap-1">
                  <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                  {product.description ? (
                    <div className="line-clamp-3 text-xs text-slate-500">{product.description}</div>
                  ) : null}
                </div>
                <div className="text-sm font-semibold text-brand-600">
                  {formatCurrency(product.unit_price, product.currency ?? currency)}
                </div>
                <div className="text-xs text-slate-500">{buildCategoryLabel(product)}</div>
                <Button size="sm" onClick={() => addToCart(product)}>
                  Ajouter au panier
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Panier"
        description="Ajustez les quantites, renseignez le client puis partagez ou validez la commande."
        contentClassName="gap-4"
        actions={
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {cartTotals.totalItems} article{cartTotals.totalItems > 1 ? 's' : ''}
          </span>
        }
      >
        {cart.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Votre panier est vide. Ajoutez des produits pour commencer.
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="grid gap-3">
              {cart.map((item) => {
                const lineTotal = stringifyNumber(item.unit_price) * item.qty
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(item.unit_price, item.currency ?? currency)} / unite
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-xl border border-slate-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3"
                        >
                          -
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold text-slate-700">
                          {item.qty}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3"
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(lineTotal, item.currency ?? currency)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700"
                        onClick={() => removeItem(item.id)}
                      >
                        Retirer
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Nom du client"
                value={customer.name}
                onChange={handleCustomerChange('name')}
              />
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Telephone"
                value={customer.phone}
                onChange={handleCustomerChange('phone')}
              />
              <input
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="E-mail"
                value={customer.email}
                onChange={handleCustomerChange('email')}
                type="email"
              />
            </div>

            <div className="grid gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Total HT</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartTotals.subtotal, currency)}
                </span>
              </div>
              {cartTotals.taxTotal > 0 && (
                <div className="flex justify-between">
                  <span>TVA</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(cartTotals.taxTotal, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base">
                <span className="font-semibold text-slate-900">Total TTC</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cartTotals.grandTotal, currency)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleWhatsAppOrder}
                disabled={cart.length === 0}
              >
                Envoyer sur WhatsApp
              </Button>
              <Button onClick={orderOnSite} size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi...' : 'Commander sur le site'}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Vider le panier
              </Button>
            </div>

            <div className="grid gap-1 text-xs text-slate-500">
              <span>Message WhatsApp previsualise :</span>
              <textarea
                className="min-h-[160px] rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                readOnly
                value={whatsappMessage}
              />
            </div>

            {feedback && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {feedback}
              </div>
            )}
          </div>
        )}
      </Card>

      {status === 'success' && !org && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-900 shadow-soft">
          Aucune organisation n'est encore configuree. Les prix sont affiches sans contexte.
        </div>
      )}
    </div>
  )
}
