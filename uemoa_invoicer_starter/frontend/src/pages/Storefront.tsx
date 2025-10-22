import React, { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'

export default function Storefront() {
  const [products, setProducts] = useState<any[]>([])
  const [org, setOrg] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    api.get('/products/?is_active=true').then(r => setProducts(r.data.results ?? r.data))
    api.get('/organizations/').then(r => setOrg(r.data[0]))
  }, [])

  const add = (p:any) => {
    const existing = cart.find((i:any)=>i.id===p.id)
    if (existing) existing.qty += 1; else cart.push({...p, qty:1})
    setCart([...cart])
  }

  const whatsappLink = () => {
    const phone = org?.whatsapp_number || ''
    const lines = cart.map(c => `- ${c.name} x${c.qty}`).join('\n')
    const text = `Commande boutique:\n${lines}`
    const cleaned = phone.replace('+','')
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="p-4 grid gap-4">
      <Card title="Boutique">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {products.map((p:any) => (
            <div key={p.id} className="card p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm">{p.unit_price} {p.currency}</div>
              <Button onClick={()=>add(p)}>Ajouter</Button>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Panier">
        {cart.length === 0 ? <div>Votre panier est vide.</div> :
          <div className="grid gap-2">
            {cart.map((c:any)=>(<div key={c.id} className="flex justify-between"><span>{c.name} x{c.qty}</span><span>{c.unit_price * c.qty} {c.currency}</span></div>))}
            <div className="mt-2">
              <a className="btn" href={whatsappLink()} target="_blank">Commander via WhatsApp</a>
            </div>
          </div>}
      </Card>
    </div>
  )
}
