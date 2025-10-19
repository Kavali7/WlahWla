import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'

type Product = {
  id: string
  name: string
  unit_price: number
  currency: string
}

type CartItem = Product & {
  qty: number
}

type Organization = {
  whatsapp_number?: string
  currency?: string
  display_name?: string
}

const formatMoney = (value: number, currency = 'XOF') =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0)

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([])
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    api
      .get('/products/?is_active=true')
      .then((response) => setProducts((response.data.results ?? response.data) as Product[]))

    api.get('/organizations/').then((response) => setOrganization(response.data[0]))
  }, [])

  const addToCart = (product: Product) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id)
      if (existing) {
        return previous.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...previous, { ...product, qty: 1 }]
    })
  }

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.unit_price || 0) * item.qty, 0),
    [cart],
  )

  const whatsappLink = useMemo(() => {
    if (cart.length === 0) return '#'
    const phone = (organization?.whatsapp_number ?? '').replace(/\+/g, '')
    const lines = cart
      .map(
        (item) =>
          `- ${item.name} x${item.qty} (${formatMoney(
            Number(item.unit_price) * item.qty,
            item.currency,
          )})`,
      )
      .join('\n')
    const totalLine = `Total: ${formatMoney(
      total,
      cart[0]?.currency ?? organization?.currency ?? 'XOF',
    )}`
    const text = `Commande boutique ${organization?.display_name ?? ''}:\n${lines}\n${totalLine}`
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }, [cart, organization, total])

  return (
    <div className="grid gap-6">
      <Card
        title="Catalogue produits"
        description="Ajoutez des articles au panier avant de generer un lien de commande WhatsApp."
        contentClassName="gap-6"
      >
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
            Aucun produit actif pour le moment. Activez vos articles dans le module inventaire.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-slate-900">{product.name}</span>
                  <span className="text-sm text-slate-500">
                    {formatMoney(Number(product.unit_price), product.currency)}
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => addToCart(product)}>
                  Ajouter au panier
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title="Panier"
        description="Generez un recapitulatif et partagez-le instantanement a vos clients."
        contentClassName="gap-4"
      >
        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
            Votre panier est vide. Selectionnez des produits dans la liste ci-dessus pour demarrer une
            commande.
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-surface px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Quantite {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatMoney(Number(item.unit_price) * item.qty, item.currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3 text-sm font-semibold text-slate-700">
              <span>Total estime</span>
              <span>
                {formatMoney(total, cart[0]?.currency ?? organization?.currency ?? 'XOF')}
              </span>
            </div>
            <Button
              as="a"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              className="justify-center"
            >
              Commander via WhatsApp
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
