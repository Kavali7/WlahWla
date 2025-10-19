import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeadCell,
  TableHeader,
  TableRow,
} from '../components/Table'
import { api } from '../lib/api'
import { formatCurrency, formatDate } from '../utils/format'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type Customer = {
  id: number
  name: string
  email?: string
  phone?: string
  tax_id?: string
}

type Product = {
  id: number
  name: string
  unit_price: string | number
  currency: string
  tax?: number | { id: number }
}

type Tax = {
  id: number
  name: string
  rate: string | number
}

type LineForm = {
  id: string
  product: string
  description: string
  quantity: string
  unit_price: string
  tax: string
}

type QuotePayload = {
  status: string
  sendEmail: boolean
  sendWhatsapp: boolean
}

const stepLabels = ['Client', 'Lignes', 'Conditions', 'Resume']

const statusOptions = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'SENT', label: 'Envoye' },
  { value: 'ACCEPTED', label: 'Accepte' },
  { value: 'REJECTED', label: 'Refuse' },
]

const createEmptyLine = (): LineForm => ({
  id: crypto.randomUUID(),
  product: '',
  description: '',
  quantity: '1',
  unit_price: '',
  tax: '',
})

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDays = (date: Date, offset: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + offset)
  return copy
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

export default function QuoteBuilder() {
  const [step, setStep] = useState(0)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [referencesStatus, setReferencesStatus] = useState<FetchStatus>('idle')
  const [referencesError, setReferencesError] = useState<string | null>(null)

  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  const [lines, setLines] = useState<LineForm[]>([createEmptyLine()])
  const [currency, setCurrency] = useState('XOF')
  const [issueDate, setIssueDate] = useState(todayISO())
  const [validUntil, setValidUntil] = useState(addDays(new Date(), 30).toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [sendEmail, setSendEmail] = useState(false)
  const [sendWhatsapp, setSendWhatsapp] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [customPhone, setCustomPhone] = useState('')
  const [sendMessage, setSendMessage] = useState('Bonjour, voici votre devis. Nhesitez pas a revenir vers nous.')

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)
  const [lastQuoteId, setLastQuoteId] = useState<number | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)

  const loadReferences = useCallback(async () => {
    setReferencesStatus('loading')
    setReferencesError(null)
    try {
      const [customersResponse, productsResponse, taxesResponse] = await Promise.all([
        api.get('/customers/', { params: { ordering: 'name' } }),
        api.get('/products/', { params: { page_size: 200 } }),
        api.get('/taxes/', { params: { page_size: 200 } }),
      ])
      setCustomers(asArray<Customer>(customersResponse.data))
      setProducts(asArray<Product>(productsResponse.data))
      setTaxes(asArray<Tax>(taxesResponse.data))
      setReferencesStatus('success')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Impossible de recuperer les donnees necessaires.'
      setReferencesError(message)
      setReferencesStatus('error')
    }
  }, [])

  useEffect(() => {
    loadReferences()
  }, [loadReferences])

  const taxMap = useMemo(() => {
    const map = new Map<string, number>()
    taxes.forEach((tax) => {
      const rate = typeof tax.rate === 'number' ? tax.rate : Number(tax.rate)
      map.set(String(tax.id), Number.isNaN(rate) ? 0 : rate)
    })
    return map
  }, [taxes])

  const customerMap = useMemo(() => {
    const map = new Map<number, Customer>()
    customers.forEach((customer) => map.set(customer.id, customer))
    return map
  }, [customers])

  useEffect(() => {
    if (!selectedCustomerId) {
      setSendEmail(false)
      setSendWhatsapp(false)
      return
    }
    const customer = customerMap.get(selectedCustomerId)
    if (!customer) return
    if (customer.email) {
      setCustomEmail(customer.email)
    }
    if (customer.phone) {
      setCustomPhone(customer.phone)
    }
  }, [customerMap, selectedCustomerId])

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers
    const term = normalize(customerSearch)
    return customers.filter((customer) => {
      const haystack = [customer.name, customer.email ?? '', customer.tax_id ?? '']
        .map((value) => normalize(value))
        .join(' ')
      return haystack.includes(term)
    })
  }, [customerSearch, customers])

  const updateLine = (id: string, field: keyof LineForm, value: string) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line
        const next = { ...line, [field]: value }
        if (field === 'product') {
          const product = products.find((item) => String(item.id) === value)
          if (product) {
            next.unit_price =
              typeof product.unit_price === 'string'
                ? product.unit_price
                : String(product.unit_price)
            if (!line.description || line.description.trim().length === 0) {
              next.description = product.name
            }
            if (product.tax && typeof product.tax === 'object' && product.tax !== null) {
              next.tax = String(product.tax.id)
            } else if (typeof product.tax === 'number') {
              next.tax = String(product.tax)
            }
            if (product.currency) {
              setCurrency(product.currency)
            }
          }
        }
        return next
      }),
    )
  }

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine()])
  }

  const duplicateLine = (id: string) => {
    setLines((prev) => {
      const index = prev.findIndex((line) => line.id === id)
      if (index === -1) return prev
      const copy = { ...prev[index], id: crypto.randomUUID() }
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
    })
  }

  const removeLine = (id: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((line) => line.id !== id)))
  }

  const computeTotals = useMemo(() => {
    let subtotal = 0
    let taxTotal = 0
    const detailed = lines.map((line) => {
      const quantity = Number(line.quantity || '0')
      const unitPrice = Number(line.unit_price || '0')
      const base = quantity * unitPrice
      const rate = taxMap.get(line.tax) ?? 0
      const taxAmount = (base * rate) / 100
      subtotal += base
      taxTotal += taxAmount
      return {
        id: line.id,
        quantity,
        unitPrice,
        base,
        taxAmount,
        total: base + taxAmount,
        rate,
      }
    })
    return {
      subtotal,
      taxTotal,
      grandTotal: subtotal + taxTotal,
      detailed,
    }
  }, [lines, taxMap])

  const validateQuote = () => {
    if (!selectedCustomerId) {
      return 'Veuillez selectionner un client.'
    }
    if (lines.length === 0) {
      return 'Ajoutez au moins une ligne au devis.'
    }
    for (const line of lines) {
      if (!line.description.trim()) {
        return 'Chaque ligne doit contenir une description.'
      }
      const quantity = Number(line.quantity || '0')
      const unitPrice = Number(line.unit_price || '0')
      if (Number.isNaN(quantity) || quantity <= 0) {
        return 'La quantite doit etre un nombre positif.'
      }
      if (Number.isNaN(unitPrice) || unitPrice < 0) {
        return 'Le prix unitaire doit etre positif.'
      }
    }
    return null
  }

  const handleSave = async ({ status: nextStatus, sendEmail, sendWhatsapp }: QuotePayload) => {
    const validationError = validateQuote()
    if (validationError) {
      setSaveError(validationError)
      setStep((prev) => Math.min(prev, 3))
      return
    }
    setSaving(true)
    setSaveError(null)
    setSaveFeedback(null)
    setLastQuoteId(null)
    const payload: Record<string, any> = {
      customer: selectedCustomerId,
      issue_date: issueDate,
      valid_until: validUntil || null,
      currency: currency || 'XOF',
      status: nextStatus,
      notes,
      lines: lines.map((line) => ({
        product: line.product ? Number(line.product) : null,
        description: line.description.trim(),
        quantity: Number(line.quantity || '0'),
        unit_price: Number(line.unit_price || '0'),
        tax: line.tax ? Number(line.tax) : null,
      })),
    }
    try {
      const response = await api.post('/quotes/', payload)
      const quoteId =
        response && response.data && typeof response.data.id === 'number' ? response.data.id : null
      setLastQuoteId(quoteId)
      setSaveFeedback(nextStatus === 'DRAFT' ? 'Brouillon enregistre.' : 'Devis enregistre.')
      if (sendEmail || sendWhatsapp) {
        setShowSendModal(true)
      }
      if (nextStatus === 'DRAFT') {
        setStatus('DRAFT')
      } else {
        setStatus(nextStatus)
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le devis. Verifiez vos informations."
      setSaveError(message)
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, stepLabels.length - 1))
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const quoteLink = useMemo(() => {
    if (!lastQuoteId) return ''
    return `/admin/quotes/${lastQuoteId}`
  }, [lastQuoteId])

  const summaryCustomer = selectedCustomerId ? customerMap.get(selectedCustomerId) : null

  const whatsappUrl = useMemo(() => {
    if (!sendWhatsapp) return ''
    const phone = (customPhone || '').replace(/[^0-9]/g, '')
    if (!phone) return ''
    const body = [
      sendMessage.trim(),
      '',
      `Montant: ${formatCurrency(computeTotals.grandTotal, currency)}`,
      quoteLink ? `Lien: ${quoteLink}` : '',
    ]
      .filter(Boolean)
      .join('\\n')
    return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`
  }, [customPhone, sendMessage, computeTotals.grandTotal, currency, quoteLink, sendWhatsapp])

  const mailtoLink = useMemo(() => {
    if (!sendEmail) return ''
    const to = (customEmail || '').trim()
    if (!to) return ''
    const subject = encodeURIComponent('Votre devis')
    const body = [
      sendMessage.trim(),
      '',
      `Montant: ${formatCurrency(computeTotals.grandTotal, currency)}`,
      quoteLink ? `Lien: ${quoteLink}` : '',
    ]
      .filter(Boolean)
      .join('\\n')
    return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`
  }, [customEmail, sendMessage, computeTotals.grandTotal, currency, quoteLink, sendEmail])
  return (
    <div className="grid gap-6">
      <Card
        title="Createur de devis"
        description="Accompagnez vos equipes pour structurer leurs devis et calculez automatiquement montants et statuts."
        contentClassName="gap-4"
      >
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={[
                'flex items-center gap-2 rounded-full px-3 py-1 transition-colors',
                index === step
                  ? 'bg-brand-500 text-white shadow-soft'
                  : index < step
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600',
              ].join(' ')}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-500">
                {index + 1}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {referencesStatus === 'error' && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {referencesError}
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={loadReferences}>
                Reessayer
              </Button>
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <input
                className="h-10 flex-1 min-w-[240px] rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Rechercher un client"
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
              />
              <span className="text-xs text-slate-500">
                {filteredCustomers.length}/{customers.length} clients
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
              {filteredCustomers.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">
                  Aucun client ne correspond a votre recherche.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeadCell />
                      <TableHeadCell>Nom</TableHeadCell>
                      <TableHeadCell>Contact</TableHeadCell>
                      <TableHeadCell>NIF</TableHeadCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <input
                            type="radio"
                            name="customer"
                            className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                            checked={selectedCustomerId === customer.id}
                            onChange={() => setSelectedCustomerId(customer.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">{customer.name}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          <div className="grid gap-1 text-xs">
                            {customer.email ? customer.email : <span className="text-slate-400">Email non renseigne</span>}
                            {customer.phone ? customer.phone : <span className="text-slate-400">Telephone non renseigne</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {customer.tax_id || <span className="text-slate-400">-</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-sm">
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Produit</TableHeadCell>
                    <TableHeadCell>Description</TableHeadCell>
                    <TableHeadCell>Quantite</TableHeadCell>
                    <TableHeadCell>Prix unitaire</TableHeadCell>
                    <TableHeadCell>Taxe</TableHeadCell>
                    <TableHeadCell>Total</TableHeadCell>
                    <TableHeadCell className="text-right">Actions</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, index) => {
                    const detail = computeTotals.detailed[index]
                    return (
                      <TableRow key={line.id}>
                        <TableCell className="min-w-[180px]">
                          <select
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={line.product}
                            onChange={(event) => updateLine(line.id, 'product', event.target.value)}
                          >
                            <option value="">Libre</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>
                          <textarea
                            className="min-h-[64px] w-full rounded-xl border border-slate-200 px-2 py-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={line.description}
                            onChange={(event) => updateLine(line.id, 'description', event.target.value)}
                            placeholder="Description de la ligne"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={line.quantity}
                            onChange={(event) => updateLine(line.id, 'quantity', event.target.value)}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={line.unit_price}
                            onChange={(event) => updateLine(line.id, 'unit_price', event.target.value)}
                            type="number"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            value={line.tax}
                            onChange={(event) => updateLine(line.id, 'tax', event.target.value)}
                          >
                            <option value="">Sans taxe</option>
                            {taxes.map((tax) => (
                              <option key={tax.id} value={tax.id}>
                                {tax.name} ({tax.rate}%)
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-slate-900">
                          {formatCurrency(detail?.total ?? 0, currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => duplicateLine(line.id)}>
                              Dupliquer
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => removeLine(line.id)}>
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex justify-between text-sm text-slate-600">
              <Button variant="secondary" size="sm" onClick={addLine}>
                Ajouter une ligne
              </Button>
              <div className="grid gap-1 text-right">
                <span>Sous-total : {formatCurrency(computeTotals.subtotal, currency)}</span>
                <span>Taxes : {formatCurrency(computeTotals.taxTotal, currency)}</span>
                <span className="text-base font-semibold text-slate-900">
                  Total : {formatCurrency(computeTotals.grandTotal, currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Devise</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 uppercase focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                  maxLength={3}
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Date d emission</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  type="date"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Validite jusqu au</span>
                <input
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={validUntil}
                  onChange={(event) => setValidUntil(event.target.value)}
                  type="date"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Statut</span>
                <select
                  className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Conditions / notes</span>
              <textarea
                className="min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Conditions de paiement, delais, mentions legales..."
              />
            </label>
            <div className="grid gap-3 rounded-xl border border-slate-200 px-4 py-4">
              <span className="text-sm font-semibold text-slate-700">Options d envoi</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  checked={sendEmail}
                  onChange={(event) => setSendEmail(event.target.checked)}
                />
                Envoyer par email
                <input
                  className="ml-auto h-9 w-72 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Email destinataire"
                  value={customEmail}
                  onChange={(event) => setCustomEmail(event.target.value)}
                  disabled={!sendEmail}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  checked={sendWhatsapp}
                  onChange={(event) => setSendWhatsapp(event.target.checked)}
                />
                Partager via WhatsApp
                <input
                  className="ml-auto h-9 w-64 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Numero (ex: 221770000000)"
                  value={customPhone}
                  onChange={(event) => setCustomPhone(event.target.value)}
                  disabled={!sendWhatsapp}
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Message personnalise</span>
                <textarea
                  className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  value={sendMessage}
                  onChange={(event) => setSendMessage(event.target.value)}
                  placeholder="Message a joindre a l envoi"
                />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-surface px-5 py-5 shadow-sm">
            <div className="grid gap-2 rounded-xl border border-slate-200 px-4 py-4">
              <span className="text-sm font-semibold text-slate-700">Client</span>
              {summaryCustomer ? (
                <div className="text-sm text-slate-600">
                  <div className="font-medium text-slate-900">{summaryCustomer.name}</div>
                  {summaryCustomer.email && <div>Email : {summaryCustomer.email}</div>}
                  {summaryCustomer.phone && <div>Telephone : {summaryCustomer.phone}</div>}
                  {summaryCustomer.tax_id && <div>NIF : {summaryCustomer.tax_id}</div>}
                </div>
              ) : (
                <div className="text-sm text-slate-500">Aucun client selectionne.</div>
              )}
            </div>

            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Description</TableHeadCell>
                    <TableHeadCell>Quantite</TableHeadCell>
                    <TableHeadCell>Prix unitaire</TableHeadCell>
                    <TableHeadCell>Taxe</TableHeadCell>
                    <TableHeadCell>Total</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, index) => {
                    const detail = computeTotals.detailed[index]
                    return (
                      <TableRow key={line.id}>
                        <TableCell className="max-w-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{line.description}</span>
                            {line.product && (
                              <span className="text-xs text-slate-500">Produit #{line.product}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{detail?.quantity ?? '-'}</TableCell>
                        <TableCell>{formatCurrency(detail?.unitPrice ?? 0, currency)}</TableCell>
                        <TableCell>{detail ? `${detail.rate}%` : '-'}</TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          {formatCurrency(detail?.total ?? 0, currency)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="grid gap-2 rounded-xl border border-slate-200 px-4 py-4 text-sm text-slate-600">
              <div>Emission : {formatDate(issueDate)}</div>
              <div>Validite : {validUntil ? formatDate(validUntil) : 'Non definie'}</div>
              <div>Statut : {statusOptions.find((option) => option.value === status)?.label ?? status}</div>
              {notes && (
                <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold">Conditions :</span> {notes}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid gap-1 text-sm text-slate-600">
                <span>Sous-total : {formatCurrency(computeTotals.subtotal, currency)}</span>
                <span>Taxes : {formatCurrency(computeTotals.taxTotal, currency)}</span>
                <span className="text-base font-semibold text-slate-900">
                  Total : {formatCurrency(computeTotals.grandTotal, currency)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleSave({ status: 'DRAFT', sendEmail: false, sendWhatsapp: false })
                  }
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer en brouillon'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleSave({ status, sendEmail, sendWhatsapp })
                  }
                  disabled={saving}
                >
                  {saving ? 'Envoi...' : 'Enregistrer'}
                </Button>
              </div>
            </div>

            {saveError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {saveError}
              </div>
            )}
            {saveFeedback && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {saveFeedback}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={previousStep} disabled={step === 0}>
            Retour
          </Button>
          <Button variant="primary" size="sm" onClick={nextStep} disabled={step === stepLabels.length - 1}>
            Suivant
          </Button>
        </div>
      </Card>

      <Modal
        open={showSendModal && (sendEmail || sendWhatsapp)}
        onClose={() => setShowSendModal(false)}
        title="Partage du devis"
        description="Utilisez l une des options ci-dessous pour transmettre le devis au client."
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowSendModal(false)}>
            Fermer
          </Button>
        }
      >
        {sendEmail && mailtoLink ? (
          <a
            className="rounded-xl border border-brand-200 px-4 py-3 text-sm text-brand-700 hover:bg-brand-50"
            href={mailtoLink}
          >
            Ouvrir votre client mail ({customEmail})
          </a>
        ) : null}
        {sendWhatsapp && whatsappUrl ? (
          <a
            className="rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir WhatsApp vers {customPhone}
          </a>
        ) : null}
        {!mailtoLink && !whatsappUrl && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Aucun canal configure : assurez-vous d avoir renseigne email ou numero valide.
          </div>
        )}
        {quoteLink && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Lien interne du devis : <code>{quoteLink}</code>
          </div>
        )}
      </Modal>
    </div>
  )
}

