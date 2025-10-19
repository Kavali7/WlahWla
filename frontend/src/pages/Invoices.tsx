import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
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

type QuoteLine = {
  id: number
  product: number | null
  description: string
  quantity: string | number
  unit_price: string | number
  tax: number | null
}

type Quote = {
  id: number
  number: string
  status: string
  issue_date: string
  customer: number
  currency: string
  lines?: QuoteLine[]
}

type InvoiceLine = {
  id: number
  product: number | null
  description: string
  quantity: string | number
  unit_price: string | number
  tax: number | null
}

type Invoice = {
  id: number
  number: string
  customer: number
  issue_date: string
  due_date?: string | null
  currency: string
  status: string
  quote?: number | null
  lines?: InvoiceLine[]
}

type InvoiceFormState = {
  id?: number
  number: string
  customer: string
  issue_date: string
  due_date: string
  currency: string
  status: string
  quote: string
}

type LineForm = {
  internalId: string
  backendId?: number
  product: string
  description: string
  quantity: string
  unit_price: string
  tax: string
}

type InvoiceSummary = {
  id: number
  number: string
  customerName: string
  issueDate: string
  dueDate?: string | null
  status: string
  currency: string
  subtotal: number
  taxTotal: number
  grandTotal: number
}

const invoiceStatuses = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'SENT', label: 'Envoyee' },
  { value: 'PARTIALLY_PAID', label: 'Partiellement payee' },
  { value: 'PAID', label: 'Payee' },
  { value: 'CANCELLED', label: 'Annulee' },
]

const todayISO = () => new Date().toISOString().slice(0, 10)

const addDays = (date: Date, offset: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + offset)
  return copy
}

const defaultFormState: InvoiceFormState = {
  number: '',
  customer: '',
  issue_date: todayISO(),
  due_date: addDays(new Date(), 30).toISOString().slice(0, 10),
  currency: 'XOF',
  status: 'DRAFT',
  quote: '',
}

const createEmptyLine = (): LineForm => ({
  internalId: crypto.randomUUID(),
  product: '',
  description: '',
  quantity: '1',
  unit_price: '',
  tax: '',
})

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const getErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (typeof data?.detail === 'string') return data.detail
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : String(val)}`)
        .join(' | ')
    }
  }
  if (error?.message) return error.message
  return "Une erreur inattendue s'est produite."
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoiceStatus, setInvoiceStatus] = useState<FetchStatus>('idle')
  const [invoiceError, setInvoiceError] = useState<string | null>(null)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [referencesStatus, setReferencesStatus] = useState<FetchStatus>('idle')
  const [referencesError, setReferencesError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')

  const [form, setForm] = useState<InvoiceFormState>(defaultFormState)
  const [lines, setLines] = useState<LineForm[]>([createEmptyLine()])
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [formError, setFormError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sendEmailLoading, setSendEmailLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)
  const [emailOverride, setEmailOverride] = useState('')
  const [quoteLoading, setQuoteLoading] = useState(false)

  const customerMap = useMemo(() => {
    const map: Record<number, Customer> = {}
    customers.forEach((customer) => {
      map[customer.id] = customer
    })
    return map
  }, [customers])

  const taxMap = useMemo(() => {
    const map: Record<number, number> = {}
    taxes.forEach((tax) => {
      const rate = typeof tax.rate === 'number' ? tax.rate : Number(tax.rate)
      if (!Number.isNaN(rate)) {
        map[tax.id] = rate
      }
    })
    return map
  }, [taxes])

  const acceptedQuotes = useMemo(
    () => quotes.filter((quote) => quote.status === 'ACCEPTED'),
    [quotes],
  )

  const filteredInvoices: InvoiceSummary[] = useMemo(() => {
    const term = normalize(searchInput)
    return invoices
      .map((invoice) => {
        const customerName = customerMap[invoice.customer]?.name ?? 'Client inconnu'
        let subtotal = 0
        let taxTotal = 0
        if (Array.isArray(invoice.lines)) {
          invoice.lines.forEach((line) => {
            const qty = typeof line.quantity === 'number' ? line.quantity : Number(line.quantity || '0')
            const unitPrice =
              typeof line.unit_price === 'number' ? line.unit_price : Number(line.unit_price || '0')
            if (Number.isNaN(qty) || Number.isNaN(unitPrice)) {
              return
            }
            const lineAmount = qty * unitPrice
            subtotal += lineAmount
            if (line.tax) {
              const rate = taxMap[line.tax]
              if (typeof rate === 'number') {
                taxTotal += (lineAmount * rate) / 100
              }
            }
          })
        }
        const summary: InvoiceSummary = {
          id: invoice.id,
          number: invoice.number,
          customerName,
          issueDate: invoice.issue_date,
          dueDate: invoice.due_date ?? null,
          status: invoice.status,
          currency: invoice.currency,
          subtotal,
          taxTotal,
          grandTotal: subtotal + taxTotal,
        }
        return summary
      })
      .filter((summary) => {
        if (!term) return true
        const haystack = normalize(
          [summary.number, summary.customerName, summary.status].filter(Boolean).join(' '),
        )
        return haystack.includes(term)
      })
      .sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1))
  }, [customerMap, invoices, searchInput, taxMap])

  const computeEditorTotals = useMemo(() => {
    let subtotal = 0
    let taxTotal = 0
    lines.forEach((line) => {
      const qty = Number(line.quantity || '0')
      const unitPrice = Number(line.unit_price || '0')
      if (Number.isNaN(qty) || Number.isNaN(unitPrice)) {
        return
      }
      const lineAmount = qty * unitPrice
      subtotal += lineAmount
      if (line.tax) {
        const rate = taxMap[Number(line.tax)]
        if (typeof rate === 'number') {
          taxTotal += (lineAmount * rate) / 100
        }
      }
    })
    return {
      subtotal,
      taxTotal,
      grandTotal: subtotal + taxTotal,
    }
  }, [lines, taxMap])

  const resetEditor = useCallback(() => {
    setForm(defaultFormState)
    setLines([createEmptyLine()])
    setEditorMode('create')
    setFormError(null)
    setFeedback(null)
    setActionError(null)
    setSaving(false)
    setSendEmailLoading(false)
    setPdfLoading(false)
    setSelectedInvoiceId(null)
    setEmailOverride('')
  }, [])

  const applyInvoiceToEditor = useCallback(
    (invoice: Invoice) => {
      setForm({
        id: invoice.id,
        number: invoice.number ?? '',
        customer: invoice.customer ? String(invoice.customer) : '',
        issue_date: invoice.issue_date ?? todayISO(),
        due_date: invoice.due_date ?? '',
        currency: invoice.currency ?? 'XOF',
        status: invoice.status ?? 'DRAFT',
        quote: invoice.quote ? String(invoice.quote) : '',
      })
      const mappedLines =
        Array.isArray(invoice.lines) && invoice.lines.length > 0
          ? invoice.lines.map((line) => ({
              internalId: crypto.randomUUID(),
              backendId: line.id,
              product: line.product ? String(line.product) : '',
              description: line.description ?? '',
              quantity:
                typeof line.quantity === 'number'
                  ? String(line.quantity)
                  : (line.quantity as string) ?? '1',
              unit_price:
                typeof line.unit_price === 'number'
                  ? String(line.unit_price)
                  : (line.unit_price as string) ?? '',
              tax: line.tax ? String(line.tax) : '',
            }))
          : [createEmptyLine()]
      setLines(mappedLines)
      setEditorMode('edit')
      setSelectedInvoiceId(invoice.id)
      const relatedCustomer = customerMap[invoice.customer]
      setEmailOverride(relatedCustomer?.email ?? '')
      setFormError(null)
      setFeedback(null)
      setActionError(null)
    },
    [customerMap],
  )

  const loadInvoices = useCallback(async () => {
    setInvoiceStatus('loading')
    setInvoiceError(null)
    try {
      const response = await api.get('/invoices/', {
        params: { ordering: '-issue_date', page_size: 200 },
      })
      const fetched = asArray<Invoice>(response.data)
      setInvoices(fetched)
      setInvoiceStatus('success')
    } catch (error) {
      setInvoiceError(getErrorMessage(error))
      setInvoiceStatus('error')
    }
  }, [])

  const loadInvoiceDetail = useCallback(
    async (invoiceId: number) => {
      try {
        const response = await api.get(`/invoices/${invoiceId}/`)
        const invoice = response.data as Invoice
        setInvoices((prev) => {
          const exists = prev.some((item) => item.id === invoice.id)
          if (exists) {
            return prev.map((item) => (item.id === invoice.id ? invoice : item))
          }
          return [...prev, invoice]
        })
        applyInvoiceToEditor(invoice)
      } catch (error) {
        setActionError(getErrorMessage(error))
      }
    },
    [applyInvoiceToEditor],
  )

  const loadReferences = useCallback(async () => {
    setReferencesStatus('loading')
    setReferencesError(null)
    try {
      const [customersResponse, productsResponse, taxesResponse, quotesResponse] = await Promise.all([
        api.get('/customers/', { params: { ordering: 'name', page_size: 200 } }),
        api.get('/products/', { params: { page_size: 200 } }),
        api.get('/taxes/', { params: { page_size: 200 } }),
        api.get('/quotes/', { params: { ordering: '-issue_date', page_size: 200 } }),
      ])
      setCustomers(asArray<Customer>(customersResponse.data))
      setProducts(asArray<Product>(productsResponse.data))
      setTaxes(asArray<Tax>(taxesResponse.data))
      setQuotes(asArray<Quote>(quotesResponse.data))
      setReferencesStatus('success')
    } catch (error) {
      setReferencesError(getErrorMessage(error))
      setReferencesStatus('error')
    }
  }, [])

  useEffect(() => {
    void loadInvoices()
    void loadReferences()
  }, [loadInvoices, loadReferences])

  useEffect(() => {
    if (editorMode === 'create' && form.customer) {
      const relatedCustomer = customerMap[Number(form.customer)]
      if (relatedCustomer?.email) {
        setEmailOverride(relatedCustomer.email)
      }
    }
  }, [customerMap, editorMode, form.customer])

  const handleInputChange =
    <Key extends keyof InvoiceFormState>(key: Key) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setForm((prev) => ({
        ...prev,
        [key]: key === 'currency' ? value.toUpperCase() : value,
      }))
    }

  const handleLineChange =
    (lineId: string, key: keyof Omit<LineForm, 'internalId' | 'backendId'>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setLines((prev) =>
        prev.map((line) =>
          line.internalId === lineId
            ? {
                ...line,
                [key]: value,
              }
            : line,
        ),
      )
    }

  const handleProductSelect = (lineId: string, productId: string) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.internalId !== lineId) return line
        const product = products.find((item) => String(item.id) === productId)
        if (!product) {
          return { ...line, product: '', tax: line.tax }
        }
        const defaultTax =
          typeof product.tax === 'object' && product.tax !== null
            ? product.tax.id
            : typeof product.tax === 'number'
            ? product.tax
            : null
        return {
          ...line,
          product: productId,
          description: line.description || product.name,
          unit_price:
            typeof product.unit_price === 'number'
              ? product.unit_price.toString()
              : (product.unit_price as string) ?? line.unit_price,
          tax: defaultTax ? String(defaultTax) : line.tax,
        }
      }),
    )
  }

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine()])
  }

  const removeLine = (lineId: string) => {
    setLines((prev) => {
      if (prev.length === 1) {
        return [createEmptyLine()]
      }
      return prev.filter((line) => line.internalId !== lineId)
    })
  }

  const validateForm = useCallback((): string | null => {
    if (!form.number.trim()) {
      return 'Le numero de facture est obligatoire.'
    }
    if (!form.customer) {
      return 'Selectionnez un client.'
    }
    if (!form.issue_date) {
      return "La date d'emission est obligatoire."
    }
    if (form.due_date) {
      const issue = new Date(form.issue_date)
      const due = new Date(form.due_date)
      if (due < issue) {
        return "La date d'echeance doit etre posterieure a la date d'emission."
      }
    }
    if (!form.currency || form.currency.length !== 3) {
      return 'La devise doit contenir 3 caracteres (ex: XOF).'
    }
    if (lines.length === 0) {
      return 'Ajoutez au moins une ligne de facture.'
    }
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      if (!line.description.trim()) {
        return `La description de la ligne ${index + 1} est obligatoire.`
      }
      const quantity = Number(line.quantity || '0')
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return `La quantite de la ligne ${index + 1} doit etre superieure a 0.`
      }
      const unitPrice = Number(line.unit_price || '0')
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return `Le prix unitaire de la ligne ${index + 1} est invalide.`
      }
    }
    return null
  }, [form.currency, form.customer, form.due_date, form.issue_date, form.number, lines])

  const persistInvoice = async () => {
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }
    setSaving(true)
    setFormError(null)
    setActionError(null)
    setFeedback(null)

    const payload: Record<string, any> = {
      number: form.number.trim(),
      customer: Number(form.customer),
      issue_date: form.issue_date,
      due_date: form.due_date || null,
      currency: form.currency.trim().toUpperCase(),
      status: form.status,
      quote: form.quote ? Number(form.quote) : null,
      lines: lines.map((line) => ({
        ...(line.backendId ? { id: line.backendId } : {}),
        product: line.product ? Number(line.product) : null,
        description: line.description.trim(),
        quantity: Number(line.quantity || '0'),
        unit_price: Number(line.unit_price || '0'),
        tax: line.tax ? Number(line.tax) : null,
      })),
    }

    try {
      if (editorMode === 'edit' && form.id) {
        const response = await api.put(`/invoices/${form.id}/`, payload)
        if (response?.data?.offlineQueued) {
          setFeedback('Facture mise a jour (en file hors ligne).')
        } else {
          setFeedback('Facture mise a jour.')
        }
        const updated = response?.data as Invoice | undefined
        if (updated) {
          applyInvoiceToEditor(updated)
          setInvoices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
        } else {
          void loadInvoices()
        }
      } else {
        const response = await api.post('/invoices/', payload)
        const created = response?.data as Invoice | undefined
        if (response?.data?.offlineQueued) {
          setFeedback('Facture enregistree (en file hors ligne).')
        } else {
          setFeedback('Facture enregistree.')
        }
        if (created?.id) {
          applyInvoiceToEditor(created)
          setInvoices((prev) => {
            const exists = prev.some((item) => item.id === created.id)
            if (exists) {
              return prev.map((item) => (item.id === created.id ? created : item))
            }
            return [created, ...prev]
          })
        } else {
          void loadInvoices()
        }
      }
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleStatusShortcut = async (nextStatus: string) => {
    setForm((prev) => ({ ...prev, status: nextStatus }))
    await persistInvoice()
  }

  const openInvoiceEditor = (invoiceId: number) => {
    setFeedback(null)
    setActionError(null)
    setFormError(null)
    void loadInvoiceDetail(invoiceId)
  }

  const handleQuoteSelection = async (value: string) => {
    setForm((prev) => ({ ...prev, quote: value }))
    if (!value) {
      return
    }
    const shouldReplace =
      lines.length === 1 &&
      !lines[0].description.trim() &&
      (!lines[0].unit_price || Number(lines[0].unit_price) === 0)
    if (!shouldReplace) {
      const confirmed = window.confirm(
        'Remplacer les lignes existantes par celles du devis selectionne ?',
      )
      if (!confirmed) {
        return
      }
    }
    const quoteId = Number(value)
    if (!Number.isFinite(quoteId)) {
      return
    }
    setQuoteLoading(true)
    setActionError(null)
    try {
      let quote = quotes.find((item) => item.id === quoteId)
      if (!quote || !Array.isArray(quote.lines)) {
        const response = await api.get(`/quotes/${quoteId}/`)
        quote = response.data as Quote
        setQuotes((prev) => {
          const exists = prev.some((item) => item.id === quoteId)
          if (exists) {
            return prev.map((item) => (item.id === quoteId ? quote! : item))
          }
          return [...prev, quote!]
        })
      }
      if (!quote) return
      setForm((prev) => ({
        ...prev,
        customer: quote ? String(quote.customer) : prev.customer,
        currency: quote?.currency ? quote.currency.toUpperCase() : prev.currency,
      }))
      setLines(
        Array.isArray(quote.lines) && quote.lines.length > 0
          ? quote.lines.map((line) => ({
              internalId: crypto.randomUUID(),
              product: line.product ? String(line.product) : '',
              description: line.description ?? '',
              quantity:
                typeof line.quantity === 'number'
                  ? String(line.quantity)
                  : (line.quantity as string) ?? '1',
              unit_price:
                typeof line.unit_price === 'number'
                  ? String(line.unit_price)
                  : (line.unit_price as string) ?? '',
              tax: line.tax ? String(line.tax) : '',
            }))
          : [createEmptyLine()],
      )
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setQuoteLoading(false)
    }
  }

  const sendInvoiceEmail = async () => {
    if (!form.id) {
      setActionError("Enregistrez la facture avant d'envoyer un email.")
      return
    }
    setSendEmailLoading(true)
    setActionError(null)
    setFeedback(null)
    try {
      const payload = emailOverride ? { to: emailOverride } : {}
      const response = await api.post(`/invoices/${form.id}/send_email`, payload)
      if (response?.data?.status === 'sent') {
        setFeedback('E-mail envoye au client.')
      } else if (response?.data?.offlineQueued) {
        setFeedback('Envoi programme (mode hors ligne).')
      } else {
        setFeedback('Demande envoyee au serveur.')
      }
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setSendEmailLoading(false)
    }
  }

  const generatePdf = async () => {
    if (!form.id) {
      setActionError('Enregistrez la facture avant de generer un PDF.')
      return
    }
    setPdfLoading(true)
    setActionError(null)
    setFeedback(null)
    try {
      const response = await api.get(`/invoices/${form.id}/`, {
        params: { format: 'pdf' },
        responseType: 'blob',
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${form.number || 'facture'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setFeedback('PDF genere.')
    } catch (error) {
      setActionError(getErrorMessage(error))
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
      <Card
        title="Factures"
        description="Consultez et ouvrez vos factures. Utilisez la recherche pour retrouver un numero ou un client."
        actions={
          <Button variant="primary" size="sm" onClick={resetEditor}>
            Nouvelle facture
          </Button>
        }
        contentClassName="gap-4"
      >
        <input
          className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
          placeholder="Rechercher un numero ou un client..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        {invoiceStatus === 'loading' && (
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200/60" aria-hidden />
        )}
        {invoiceStatus === 'error' && invoiceError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {invoiceError}
          </div>
        )}
        {invoiceStatus === 'success' && filteredInvoices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
            Aucune facture pour le moment. Creez-en une pour commencer la facturation.
          </div>
        )}
        {invoiceStatus === 'success' && filteredInvoices.length > 0 && (
          <TableContainer className="border-0 shadow-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Numero</TableHeadCell>
                  <TableHeadCell>Client</TableHeadCell>
                  <TableHeadCell>Emission</TableHeadCell>
                  <TableHeadCell>Due</TableHeadCell>
                  <TableHeadCell>Total</TableHeadCell>
                  <TableHeadCell>Statut</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className={
                      selectedInvoiceId === invoice.id ? 'bg-brand-50/60 hover:bg-brand-50/60' : undefined
                    }
                    onClick={() => openInvoiceEditor(invoice.id)}
                  >
                    <TableCell className="font-semibold text-slate-900">{invoice.number}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</TableCell>
                    <TableCell className="font-semibold text-right">
                      {formatCurrency(invoice.grandTotal, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {invoiceStatuses.find((item) => item.value === invoice.status)?.label ?? invoice.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Card
        title="Edition facture"
        description="Renseignez les informations obligatoires puis enregistrez. Les totaux se recalculent automatiquement."
        contentClassName="gap-4"
      >
        {referencesStatus === 'loading' && (
          <div className="h-16 animate-pulse rounded-2xl bg-slate-200/60" aria-hidden />
        )}
        {referencesStatus === 'error' && referencesError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {referencesError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Numero</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.number}
              onChange={handleInputChange('number')}
              placeholder="FAC-2025-0001"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Client</span>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.customer}
              onChange={handleInputChange('customer')}
            >
              <option value="">Selectionnez un client</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Date d emission</span>
            <input
              type="date"
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.issue_date}
              onChange={handleInputChange('issue_date')}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Date d echeance</span>
            <input
              type="date"
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.due_date}
              onChange={handleInputChange('due_date')}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Devise</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 uppercase focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.currency}
              onChange={handleInputChange('currency')}
              maxLength={3}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Statut</span>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.status}
              onChange={handleInputChange('status')}
            >
              {invoiceStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm lg:col-span-2">
            <span className="font-medium text-slate-700">Associer un devis accepte</span>
            <div className="flex gap-3">
              <select
                className="h-10 w-full rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={form.quote}
                onChange={(event) => void handleQuoteSelection(event.target.value)}
              >
                <option value="">Aucun</option>
                {acceptedQuotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.number} — {formatDate(quote.issue_date)}
                  </option>
                ))}
              </select>
              {quoteLoading && (
                <span className="self-center text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Import...
                </span>
              )}
            </div>
          </label>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Lignes de facture</span>
            <Button variant="ghost" size="sm" onClick={addLine}>
              Ajouter une ligne
            </Button>
          </div>
          <TableContainer className="border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Produit</TableHeadCell>
                  <TableHeadCell>Description</TableHeadCell>
                  <TableHeadCell>Quantite</TableHeadCell>
                  <TableHeadCell>Prix unitaire</TableHeadCell>
                  <TableHeadCell>Taxe</TableHeadCell>
                  <TableHeadCell>Total</TableHeadCell>
                  <TableHeadCell />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => {
                  const quantity = Number(line.quantity || '0')
                  const unitPrice = Number(line.unit_price || '0')
                  const lineAmount =
                    Number.isFinite(quantity) && Number.isFinite(unitPrice) ? quantity * unitPrice : 0
                  const lineTaxRate = line.tax ? taxMap[Number(line.tax)] ?? 0 : 0
                  const lineTotal = lineAmount + (lineTaxRate ? (lineAmount * lineTaxRate) / 100 : 0)
                  return (
                    <TableRow key={line.internalId}>
                      <TableCell>
                        <select
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          value={line.product}
                          onChange={(event) => handleProductSelect(line.internalId, event.target.value)}
                        >
                          <option value="">Manuel</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          value={line.description}
                          onChange={handleLineChange(line.internalId, 'description')}
                          placeholder="Designation"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          value={line.quantity}
                          onChange={handleLineChange(line.internalId, 'quantity')}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9 w-28 rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          value={line.unit_price}
                          onChange={handleLineChange(line.internalId, 'unit_price')}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          className="h-9 rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                          value={line.tax}
                          onChange={handleLineChange(line.internalId, 'tax')}
                        >
                          <option value="">Sans</option>
                          {taxes.map((tax) => (
                            <option key={tax.id} value={tax.id}>
                              {tax.name} ({tax.rate}%)
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-right">
                        {formatCurrency(lineTotal, form.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(line.internalId)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex flex-wrap justify-end gap-4 border-t border-slate-200 pt-4 text-sm">
            <div className="grid gap-1 text-right">
              <span className="text-slate-500">
                Sous-total : {formatCurrency(computeEditorTotals.subtotal, form.currency)}
              </span>
              <span className="text-slate-500">
                Taxes : {formatCurrency(computeEditorTotals.taxTotal, form.currency)}
              </span>
              <span className="text-base font-semibold text-slate-900">
                Total TTC : {formatCurrency(computeEditorTotals.grandTotal, form.currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
          <span className="text-sm font-semibold text-slate-700">Actions statut</span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleStatusShortcut('SENT')}
              disabled={saving}
            >
              Marquer envoye
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleStatusShortcut('PARTIALLY_PAID')}
              disabled={saving}
            >
              Paiement partiel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleStatusShortcut('PAID')}
              disabled={saving}
            >
              Marquer payee
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleStatusShortcut('CANCELLED')}
              disabled={saving}
            >
              Annuler
            </Button>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 p-4">
          <span className="text-sm font-semibold text-slate-700">Echanges client</span>
          <div className="grid gap-2 text-sm text-slate-600">
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-slate-700">Email destinataire</span>
              <input
                type="email"
                className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
                value={emailOverride}
                onChange={(event) => setEmailOverride(event.target.value)}
                placeholder="client@example.com"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={generatePdf} disabled={pdfLoading}>
                {pdfLoading ? 'Generation...' : 'Generer PDF'}
              </Button>
              <Button variant="outline" size="sm" onClick={sendInvoiceEmail} disabled={sendEmailLoading}>
                {sendEmailLoading ? 'Envoi...' : 'Envoyer par email'}
              </Button>
            </div>
          </div>
        </div>

        {formError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}
        {actionError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {actionError}
          </div>
        )}
        {feedback && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={resetEditor} disabled={saving}>
            Annuler
          </Button>
          <Button variant="primary" size="sm" onClick={persistInvoice} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer la facture'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
