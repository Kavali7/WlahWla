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
  address?: string
  tax_id?: string
  phone?: string
}

type CustomerFormState = {
  id?: number
  name: string
  email: string
  address: string
  tax_id: string
  phone: string
}

type Quote = {
  id: number
  number: string
  issue_date: string
  status: string
  currency: string
  total?: number
  customer?: number
}

type Invoice = {
  id: number
  number: string
  issue_date: string
  due_date?: string
  status: string
  currency: string
  total?: number
  customer?: number
}

type DocumentSummary = {
  id: number
  number: string
  status: string
  issueDate: string
  dueDate?: string
  currency: string
  total?: number
}

const defaultFormState: CustomerFormState = {
  name: '',
  email: '',
  address: '',
  tax_id: '',
  phone: '',
}

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return debounced
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-\s().]{6,}$/
const taxIdRegex = /^[A-Za-z0-9\-\/]{4,64}$/

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const mapDocument = (doc: any, fallbackCurrency = 'XOF'): DocumentSummary => ({
  id: doc.id,
  number: doc.number,
  status: doc.status,
  issueDate: doc.issue_date,
  dueDate: doc.due_date ?? doc.valid_until,
  currency: doc.currency ?? fallbackCurrency,
  total: doc.total ?? doc.grand_total ?? undefined,
})

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const [form, setForm] = useState<CustomerFormState>(defaultFormState)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailQuotes, setDetailQuotes] = useState<DocumentSummary[]>([])
  const [detailInvoices, setDetailInvoices] = useState<DocumentSummary[]>([])
  const [detailStatus, setDetailStatus] = useState<FetchStatus>('idle')
  const [detailError, setDetailError] = useState<string | null>(null)

  const loadCustomers = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const params =
        debouncedSearch.trim().length > 0
          ? {
              search: debouncedSearch.trim(),
              ordering: 'name',
            }
          : { ordering: 'name' }
      const response = await api.get('/customers/', { params })
      setCustomers(asArray<Customer>(response.data))
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger les clients. Verifiez votre connexion.'
      setError(message)
      setStatus('error')
    }
  }, [debouncedSearch])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch.trim()) return customers
    const term = normalize(debouncedSearch)
    return customers.filter((customer) => {
      const stack = [customer.name, customer.email ?? '', customer.tax_id ?? '', customer.phone ?? '']
        .map((value) => normalize(value))
        .join(' ')
      return stack.includes(term)
    })
  }, [customers, debouncedSearch])

  const resetEditor = () => {
    setForm(defaultFormState)
    setEditorMode('create')
    setIsEditorOpen(false)
    setFormError(null)
  }

  const openCreate = () => {
    setForm(defaultFormState)
    setEditorMode('create')
    setIsEditorOpen(true)
    setFormError(null)
  }

  const openEdit = (customer: Customer) => {
    setForm({
      id: customer.id,
      name: customer.name ?? '',
      email: customer.email ?? '',
      address: customer.address ?? '',
      tax_id: customer.tax_id ?? '',
      phone: customer.phone ?? '',
    })
    setEditorMode('edit')
    setIsEditorOpen(true)
    setFormError(null)
  }

  const validateForm = (state: CustomerFormState) => {
    if (!state.name.trim()) {
      return 'Le nom du client est obligatoire.'
    }
    if (state.email.trim() && !emailRegex.test(state.email.trim())) {
      return "L'adresse e-mail semble invalide."
    }
    if (state.phone.trim() && !phoneRegex.test(state.phone.trim())) {
      return 'Le numero de telephone doit contenir au moins 6 caracteres numeriques.'
    }
    if (state.tax_id.trim() && !taxIdRegex.test(state.tax_id.trim())) {
      return 'Le NIF doit contenir 4 a 64 caracteres alphanumeriques.'
    }
    return null
  }

  const handleInputChange =
    (field: keyof CustomerFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const saveCustomer = async () => {
    const validation = validateForm(form)
    if (validation) {
      setFormError(validation)
      return
    }
    setIsSaving(true)
    setFormError(null)
    setFeedback(null)
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      tax_id: form.tax_id.trim(),
      address: form.address.trim(),
    }
    try {
      if (editorMode === 'edit' && form.id) {
        await api.patch(`/customers/${form.id}/`, payload)
        setFeedback('Client mis a jour.')
      } else {
        await api.post('/customers/', payload)
        setFeedback('Client cree.')
      }
      resetEditor()
      await loadCustomers()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Echec de l'enregistrement du client."
      setFormError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(`Supprimer le client "${customer.name}" ?`)
    if (!confirmed) return
    setFeedback(null)
    setError(null)
    try {
      await api.delete(`/customers/${customer.id}/`)
      setFeedback('Client supprime.')
      await loadCustomers()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de supprimer ce client.'
      setError(message)
    }
  }

  const openDetail = async (customer: Customer) => {
    setDetailCustomer(customer)
    setDetailStatus('loading')
    setDetailError(null)
    setDetailQuotes([])
    setDetailInvoices([])
    setIsDetailOpen(true)
    try {
      const [quotesResponse, invoicesResponse] = await Promise.all([
        api.get('/quotes/', { params: { customer: customer.id, ordering: '-issue_date' } }),
        api.get('/invoices/', { params: { customer: customer.id, ordering: '-issue_date' } }),
      ])
      const quotes = asArray<Quote>(quotesResponse.data).filter((item) => item.customer === undefined || item.customer === customer.id)
      const invoices = asArray<Invoice>(invoicesResponse.data).filter((item) => item.customer === undefined || item.customer === customer.id)
      setDetailQuotes(quotes.map((quote) => mapDocument(quote, quote.currency)))
      setDetailInvoices(invoices.map((invoice) => mapDocument(invoice, invoice.currency)))
      setDetailStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger les documents associes.'
      setDetailError(message)
      setDetailStatus('error')
    }
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setDetailCustomer(null)
    setDetailQuotes([])
    setDetailInvoices([])
    setDetailError(null)
  }

  const renderDocuments = (title: string, docs: DocumentSummary[]) => (
    <div className="grid gap-2">
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-surface-muted px-4 py-3 text-xs text-slate-500">
          Aucun document.
        </div>
      ) : (
        <div className="grid gap-2">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-slate-900">{doc.number}</span>
                <span className="text-xs uppercase tracking-wide text-slate-500">{doc.status}</span>
              </div>
              <div className="mt-2 grid gap-1 text-xs text-slate-500">
                <span>Emise le {formatDate(doc.issueDate)}</span>
                {doc.dueDate && <span>Echeance {formatDate(doc.dueDate)}</span>}
                {doc.total !== undefined && (
                  <span>Total {formatCurrency(doc.total, doc.currency)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="grid gap-6">
      <Card
        title="Annuaire clients"
        description="Centralisez les informations de vos clients, preparez vos documents commerciaux et gardez vos coordonnees a jour."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={loadCustomers} disabled={status === 'loading'}>
              Rafraichir
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              Nouveau client
            </Button>
          </div>
        }
        contentClassName="gap-4"
      >
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Rechercher par nom, email ou NIF"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <span className="text-xs text-slate-500">
              {filteredCustomers.length}/{customers.length} resultats
            </span>
          </div>

          {feedback && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          {status === 'loading' && <div className="h-32 rounded-2xl bg-slate-200/50 animate-pulse" />}
          {status === 'success' && filteredCustomers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-600">
              Aucun client ne correspond a votre recherche. Creez une fiche ou modifiez votre filtre.
            </div>
          )}
          {status === 'success' && filteredCustomers.length > 0 && (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Client</TableHeadCell>
                    <TableHeadCell>Contact</TableHeadCell>
                    <TableHeadCell>NIF</TableHeadCell>
                    <TableHeadCell>Adresse</TableHeadCell>
                    <TableHeadCell className="text-right">Actions</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <button
                          className="text-left font-medium text-brand-600 hover:underline"
                          type="button"
                          onClick={() => openDetail(customer)}
                        >
                          {customer.name}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        <div className="grid gap-1 text-xs">
                          {customer.email ? <span>{customer.email}</span> : <span className="text-slate-400">Email non renseigne</span>}
                          {customer.phone ? <span>{customer.phone}</span> : <span className="text-slate-400">Telephone non renseigne</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {customer.tax_id || <span className="text-slate-400">-</span>}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-xs">
                        <span className="line-clamp-2">
                          {customer.address || <span className="text-slate-400">Non renseigne</span>}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(customer)}>
                            Editer
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteCustomer(customer)}>
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Card>

      <Modal
        open={isEditorOpen}
        onClose={resetEditor}
        title={editorMode === 'edit' ? 'Modifier le client' : 'Nouveau client'}
        description="Collectez les informations essentielles pour vos devis et factures."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={resetEditor} disabled={isSaving}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={saveCustomer} disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </>
        }
      >
        {formError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Nom / Raison sociale</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.name}
            onChange={handleInputChange('name')}
            placeholder="Ex. Entreprise ABC"
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.email}
            onChange={handleInputChange('email')}
            placeholder="contact@client.com"
            type="email"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Telephone</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.phone}
            onChange={handleInputChange('phone')}
            placeholder="+221 77 000 00 00"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Numero fiscal (NIF)</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 uppercase focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.tax_id}
            onChange={handleInputChange('tax_id')}
            placeholder="123456789"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Adresse</span>
          <textarea
            className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.address}
            onChange={handleInputChange('address')}
            placeholder="Rue, code postal, ville"
          />
        </label>
      </Modal>

      <Modal
        open={isDetailOpen}
        onClose={closeDetail}
        title="Fiche client"
        description="Historique des documents commerciaux lies au client selectionne."
        footer={
          <Button variant="primary" size="sm" onClick={detailCustomer ? () => openEdit(detailCustomer) : undefined}>
            Modifier le client
          </Button>
        }
      >
        {detailCustomer && (
          <div className="grid gap-3 text-sm text-slate-600">
            <div className="grid gap-1">
              <span className="text-sm font-semibold text-slate-900">{detailCustomer.name}</span>
              {detailCustomer.email && <span>Email: {detailCustomer.email}</span>}
              {detailCustomer.phone && <span>Telephone: {detailCustomer.phone}</span>}
              {detailCustomer.tax_id && <span>NIF: {detailCustomer.tax_id}</span>}
              {detailCustomer.address && <span>Adresse: {detailCustomer.address}</span>}
            </div>
            {detailStatus === 'loading' && <div className="h-20 rounded-2xl bg-slate-200/50 animate-pulse" />}
            {detailStatus === 'error' && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {detailError}
              </div>
            )}
            {detailStatus === 'success' && (
              <div className="grid gap-4">
                {renderDocuments('Devis recents', detailQuotes.slice(0, 8))}
                {renderDocuments('Factures recentes', detailInvoices.slice(0, 8))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
