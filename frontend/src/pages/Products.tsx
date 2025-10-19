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
import { formatCurrency } from '../utils/format'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type RelatedValue = number | null | { id: number; name?: string; label?: string; code?: string; rate?: string }

type Product = {
  id: number
  name: string
  sku: string
  description?: string
  unit_price: string | number
  currency: string
  tax: RelatedValue
  uom: RelatedValue
  is_active: boolean
  priority?: number
}

type ReferenceRecord = {
  id: number
  code?: string
  label?: string
  name?: string
  rate?: string | number
}

type ProductFormState = {
  id?: number
  name: string
  sku: string
  description: string
  unit_price: string
  currency: string
  tax: string
  uom: string
  is_active: boolean
  priority: string
}

const defaultFormState: ProductFormState = {
  name: '',
  sku: '',
  description: '',
  unit_price: '',
  currency: 'XOF',
  tax: '',
  uom: '',
  is_active: true,
  priority: '3',
}

const pageSize = 10

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const extractCount = (payload: any, fallback: number) => {
  if (payload && typeof payload === 'object' && typeof payload.count === 'number') {
    return payload.count
  }
  return fallback
}

const toLabel = (record: ReferenceRecord) => {
  if (record.code && record.label) {
    return `${record.code} - ${record.label}`
  }
  if (record.name && record.rate !== undefined && record.rate !== null) {
    return `${record.name} (${record.rate}%)`
  }
  return record.name ?? record.label ?? String(record.id)
}

const getRelatedId = (value: RelatedValue): string =>
  value && typeof value === 'object' ? String(value.id) : value ? String(value) : ''

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return debounced
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  })
  const orderingParam = useMemo(
    () => (sort.direction === 'asc' ? sort.field : `-${sort.field}`),
    [sort.direction, sort.field],
  )

  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const [units, setUnits] = useState<ReferenceRecord[]>([])
  const [taxes, setTaxes] = useState<ReferenceRecord[]>([])
  const [referencesStatus, setReferencesStatus] = useState<FetchStatus>('idle')
  const [referencesError, setReferencesError] = useState<string | null>(null)

  const [form, setForm] = useState<ProductFormState>(defaultFormState)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [isSaving, setIsSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, orderingParam])

  const loadReferences = useCallback(async () => {
    setReferencesStatus('loading')
    setReferencesError(null)
    try {
      const [unitsResponse, taxesResponse] = await Promise.all([
        api.get('/units/'),
        api.get('/taxes/'),
      ])
      setUnits(asArray<ReferenceRecord>(unitsResponse.data))
      setTaxes(asArray<ReferenceRecord>(taxesResponse.data))
      setReferencesStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger les unites et taxes. Reessayez.'
      setReferencesError(message)
      setReferencesStatus('error')
    }
  }, [])

  useEffect(() => {
    loadReferences()
  }, [loadReferences])

  const loadProducts = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
        ordering: orderingParam,
      }
      if (debouncedSearch.trim().length > 0) {
        params.search = debouncedSearch.trim()
      }
      if (statusFilter === 'active') {
        params.is_active = true
      }
      if (statusFilter === 'archived') {
        params.is_active = false
      }
      const response = await api.get('/products/', { params })
      const items = asArray<Product>(response.data)
      const count = extractCount(response.data, items.length)
      setProducts(items)
      setTotal(count)
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les produits. Verifiez votre connexion."
      setError(message)
      setStatus('error')
      setProducts([])
      setTotal(0)
    }
  }, [debouncedSearch, orderingParam, page, statusFilter])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const unitLookup = useMemo(() => {
    const dictionary = new Map<string, string>()
    units.forEach((unit) => {
      dictionary.set(String(unit.id), toLabel(unit))
    })
    return dictionary
  }, [units])

  const taxLookup = useMemo(() => {
    const dictionary = new Map<string, string>()
    taxes.forEach((tax) => {
      dictionary.set(String(tax.id), toLabel(tax))
    })
    return dictionary
  }, [taxes])

  const closeEditor = () => {
    setIsEditorOpen(false)
    setForm(defaultFormState)
    setEditorMode('create')
    setActionError(null)
  }

  const openCreate = () => {
    setForm(defaultFormState)
    setEditorMode('create')
    setIsEditorOpen(true)
  }

  const productToForm = (product: Product): ProductFormState => ({
    id: product.id,
    name: product.name ?? '',
    sku: product.sku ?? '',
    description: product.description ?? '',
    unit_price: product.unit_price !== null && product.unit_price !== undefined ? String(product.unit_price) : '',
    currency: product.currency ?? 'XOF',
    tax: getRelatedId(product.tax),
    uom: getRelatedId(product.uom),
    is_active: Boolean(product.is_active),
    priority: product.priority !== null && product.priority !== undefined ? String(product.priority) : '3',
  })

  const openEdit = (product: Product) => {
    setForm(productToForm(product))
    setEditorMode('edit')
    setIsEditorOpen(true)
  }

  const openDuplicate = (product: Product) => {
    const base = productToForm(product)
    delete base.id
    base.name = `${base.name} (copie)`
    base.sku = `${base.sku}-copy`.slice(0, 64)
    setForm({
      ...base,
      priority: base.priority ?? '3',
    })
    setEditorMode('create')
    setIsEditorOpen(true)
  }

  const handleSort = (field: string) => {
    setSort((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { field, direction: 'asc' }
    })
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const canGoPrevious = page > 1
  const canGoNext = page < pageCount

  const handleInputChange =
    (field: keyof ProductFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target
      const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const saveProduct = async () => {
    if (!form.name.trim() || !form.sku.trim() || !form.unit_price.trim()) {
      setActionError('Nom, SKU et prix sont requis.')
      return
    }
    setIsSaving(true)
    setActionError(null)
    setFeedback(null)

    const payload: Record<string, any> = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),
      unit_price: form.unit_price.trim(),
      currency: form.currency.trim() || 'XOF',
      is_active: Boolean(form.is_active),
      priority: Number(form.priority || '3') || 3,
    }

    payload.tax = form.tax ? Number(form.tax) : null
    payload.uom = form.uom ? Number(form.uom) : null

    try {
      if (editorMode === 'edit' && form.id) {
        await api.patch(`/products/${form.id}/`, payload)
        setFeedback('Produit mis a jour.')
      } else {
        await api.post('/products/', payload)
        setFeedback('Produit cree.')
      }
      closeEditor()
      await loadProducts()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Echec de l'enregistrement du produit. Reessayez."
      setActionError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleProductStatus = async (product: Product) => {
    setFeedback(null)
    setError(null)
    try {
      await api.patch(`/products/${product.id}/`, { is_active: !product.is_active })
      setFeedback(product.is_active ? 'Produit archive.' : 'Produit re-active.')
      await loadProducts()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de mettre a jour le statut du produit."
      setError(message)
    }
  }

  const sortLabel = (field: string, label: string) =>
    sort.field === field ? `${label} (${sort.direction === 'asc' ? 'asc' : 'desc'})` : label

  return (
    <div className="grid gap-6">
      <Card
        title="Catalogue produits"
        description="Centralisez et mettez a jour les fiches pour la facturation, la boutique et les devis."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={loadProducts} disabled={status === 'loading'}>
              Rafraichir
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              Nouveau produit
            </Button>
          </div>
        }
        contentClassName="gap-4"
      >
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Rechercher par nom, SKU ou description"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="archived">Archives</option>
            </select>
            <div className="text-xs text-slate-500">
              {total} produit{total > 1 ? 's' : ''}
            </div>
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
          {status === 'loading' && (
            <div className="h-32 rounded-2xl bg-slate-200/50 animate-pulse" />
          )}
          {status === 'error' && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
              {error}
              <div className="mt-3">
                <Button size="sm" variant="ghost" onClick={loadProducts}>
                  Reessayer
                </Button>
              </div>
            </div>
          )}
          {status === 'success' && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-600">
              Aucun produit ne correspond a votre recherche. Creez-en un ou ajustez vos filtres.
            </div>
          )}
          {status === 'success' && products.length > 0 && (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>
                      <button
                        type="button"
                        className="text-left font-semibold text-xs uppercase tracking-wide text-slate-500"
                        onClick={() => handleSort('name')}
                      >
                        {sortLabel('name', 'Nom')}
                      </button>
                    </TableHeadCell>
                    <TableHeadCell>
                      <button
                        type="button"
                        className="text-left font-semibold text-xs uppercase tracking-wide text-slate-500"
                        onClick={() => handleSort('sku')}
                      >
                        {sortLabel('sku', 'SKU')}
                      </button>
                    </TableHeadCell>
                    <TableHeadCell className="text-right">
                      <button
                        type="button"
                        className="w-full text-right font-semibold text-xs uppercase tracking-wide text-slate-500"
                        onClick={() => handleSort('unit_price')}
                      >
                        {sortLabel('unit_price', 'Prix')}
                      </button>
                    </TableHeadCell>
                    <TableHeadCell>Taxe</TableHeadCell>
                    <TableHeadCell>Unite</TableHeadCell>
                    <TableHeadCell>Statut</TableHeadCell>
                    <TableHeadCell className="text-right">Actions</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const taxId = getRelatedId(product.tax)
                    const uomId = getRelatedId(product.uom)
                    const taxLabel =
                      typeof product.tax === 'object' && product.tax
                        ? toLabel(product.tax as ReferenceRecord)
                        : taxLookup.get(taxId) ?? 'Sans taxe'
                    const unitLabel =
                      typeof product.uom === 'object' && product.uom
                        ? toLabel(product.uom as ReferenceRecord)
                        : unitLookup.get(uomId) ?? 'Sans unite'

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="max-w-xs">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-900">{product.name}</span>
                            {product.description && (
                            <span className="text-xs text-slate-500">
                                {product.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {product.sku}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900">
                          {formatCurrency(product.unit_price, product.currency)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{taxLabel}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">{unitLabel}</span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              product.is_active
                                ? 'inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700'
                                : 'inline-flex items-center rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600'
                            }
                          >
                            {product.is_active ? 'Actif' : 'Archive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openEdit(product)}>
                              Editer
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => openDuplicate(product)}>
                              Dupliquer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductStatus(product)}
                            >
                              {product.is_active ? 'Archiver' : 'Activer'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {status === 'success' && products.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <div>
                Page {page} sur {pageCount}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setPage((prev) => prev - 1)} disabled={!canGoPrevious}>
                  Precedent
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setPage((prev) => prev + 1)} disabled={!canGoNext}>
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>

        {referencesStatus === 'error' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {referencesError}
            <div className="mt-2">
              <Button size="sm" variant="ghost" onClick={loadReferences}>
                Reessayer
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={isEditorOpen}
        onClose={closeEditor}
        title={editorMode === 'edit' ? 'Modifier le produit' : 'Nouveau produit'}
        description="Renseignez les informations de base pour rendre ce produit disponible dans la facturation et la boutique."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeEditor} disabled={isSaving}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={saveProduct} disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </>
        }
      >
        {actionError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {actionError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Nom</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.name}
              onChange={handleInputChange('name')}
              placeholder="Nom du produit"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">SKU</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.sku}
              onChange={handleInputChange('sku')}
              placeholder="Code interne (ex: PROD-001)"
            />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="font-medium text-slate-700">Description</span>
            <textarea
              className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.description}
              onChange={handleInputChange('description')}
              placeholder="Details visibles pour l'equipe (optionnel)"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Prix unitaire</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.unit_price}
              onChange={handleInputChange('unit_price')}
              type="number"
              min="0"
              step="0.01"
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
            <span className="font-medium text-slate-700">Taxe</span>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.tax}
              onChange={handleInputChange('tax')}
            >
              <option value="">Sans taxe</option>
              {taxes.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {toLabel(tax)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Unite de mesure</span>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.uom}
              onChange={handleInputChange('uom')}
            >
              <option value="">Sans unite</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {toLabel(unit)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Priorite</span>
            <input
              className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={form.priority}
              onChange={handleInputChange('priority')}
              type="number"
              min="1"
              max="5"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={handleInputChange('is_active')}
              className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
            />
            Produit actif (visible dans la boutique et les devis)
          </label>
        </div>
      </Modal>
    </div>
  )
}
