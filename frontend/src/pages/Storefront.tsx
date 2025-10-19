import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

const asArray = (payload: any): any[] =>
  Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([])
  const [org, setOrg] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' })
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const [productsResponse, organizationsResponse] = await Promise.all([
        api.get('/products/', { params: { is_active: true } }),
        api.get('/organizations/'),
      ])
      setProducts(asArray(productsResponse.data))
      const organizations = asArray(organizationsResponse.data)
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

  const add = (product: any) => {
    setCart((prev) => {
      const next = [...prev]
      const index = next.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        next[index] = { ...next[index], qty: next[index].qty + 1 }
      } else {
        next.push({ ...product, qty: 1 })
      }
      return next
    })
  }

  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.unit_price) * Number(item.qty), 0)
  }, [cart])

  const whatsappLink = () => {
    const phone = (org?.whatsapp_number ?? '').replace('+', '')
    const lines = cart.map((c) => `- ${c.name} x${c.qty}`).join('\n')
    const text = `Commande boutique:\n${lines}\nTotal: ${totalAmount.toFixed(2)} ${org?.currency ?? 'XOF'}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }

  const orderOnSite = async () => {
    if (cart.length === 0) return
    const items = cart.map((c) => ({
      product: c.id,
      quantity: c.qty,
      unit_price: c.unit_price,
    }))
    setIsSubmitting(true)
    setMessage('')
    try {
      await api.post('/orders/', {
        customer_name: customer.name || 'Client',
        customer_phone: customer.phone,
        customer_email: customer.email,
        items,
      })
      setMessage('Commande envoyee !')
      setCart([])
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Hors ligne : la commande sera synchronisee a la prochaine connexion.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCustomerChange =
    (field: 'name' | 'phone' | 'email') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setCustomer((prev) => ({ ...prev, [field]: value }))
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

      <Card title="Boutique">
        {status === 'loading' ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {products.map((product: any) => (
              <div key={product.id} className="card flex flex-col gap-2 p-3">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-slate-600">
                  {product.unit_price} {product.currency}
                </div>
                <Button onClick={() => add(product)}>Ajouter</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Panier">
        {cart.length === 0 ? (
          <div>Votre panier est vide.</div>
        ) : (
          <div className="grid gap-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.qty}</span>
                <span>{(Number(item.unit_price) * Number(item.qty)).toFixed(2)} {item.currency}</span>
              </div>
            ))}
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <input
                className="border rounded px-2 py-1"
                placeholder="Nom"
                value={customer.name}
                onChange={handleCustomerChange('name')}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Telephone"
                value={customer.phone}
                onChange={handleCustomerChange('phone')}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="E-mail"
                value={customer.email}
                onChange={handleCustomerChange('email')}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="btn" href={whatsappLink()} target="_blank" rel="noreferrer">
                Commander via WhatsApp
              </a>
              <Button onClick={orderOnSite} disabled={isSubmitting}>
                {isSubmitting ? 'Envoi...' : 'Commander sur le site'}
              </Button>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-semibold text-slate-700">
              <span>Total</span>
              <span>
                {totalAmount.toFixed(2)} {org?.currency ?? 'XOF'}
              </span>
            </div>
            {message && <div className="text-sm text-slate-600">{message}</div>}
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
