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
import { formatNumber } from '../utils/format'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type StockMovement = {
  id: number
  product: number
  mov_type: 'IN' | 'OUT' | 'ADJUST'
  quantity: string | number
  ref?: string
  occurred_at: string
}

type Product = {
  id: number
  name: string
  sku?: string
  unit_price?: string | number
  currency?: string
}

type MovementFormState = {
  product: string
  mov_type: 'IN' | 'OUT' | 'ADJUST'
  quantity: string
  ref: string
}

const defaultFormState: MovementFormState = {
  product: '',
  mov_type: 'IN',
  quantity: '',
  ref: '',
}

const periodOptions = [
  { value: 'all', label: 'Tous' },
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
]

const movTypeOptions: Array<{ value: MovementFormState['mov_type'] | 'all'; label: string }> = [
  { value: 'all', label: 'Tous types' },
  { value: 'IN', label: 'Entree' },
  { value: 'OUT', label: 'Sortie' },
  { value: 'ADJUST', label: 'Ajustement' },
]

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const parseDate = (value: string) => new Date(value)

const withinPeriod = (date: Date, period: string) => {
  if (period === 'all') return true
  const now = Date.now()
  const diff = now - date.getTime()
  const day = 24 * 60 * 60 * 1000
  if (period === '7d') return diff <= 7 * day
  if (period === '30d') return diff <= 30 * day
  if (period === '90d') return diff <= 90 * day
  return true
}

const formatDateTime = (value: string) => {
  const date = parseDate(value)
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getQuantityNumber = (value: string | number | undefined) => {
  if (value === undefined) return 0
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export default function Inventory() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [productsStatus, setProductsStatus] = useState<FetchStatus>('idle')
  const [productsError, setProductsError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    period: '30d',
    product: 'all',
    mov_type: 'all' as 'all' | 'IN' | 'OUT' | 'ADJUST',
  })

  const [form, setForm] = useState<MovementFormState>(defaultFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadMovements = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const response = await api.get('/stock-movements/', { params: { ordering: '-occurred_at' } })
      setMovements(asArray<StockMovement>(response.data))
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger les mouvements de stock.'
      setStatus('error')
      setError(message)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    setProductsStatus('loading')
    setProductsError(null)
    try {
      const response = await api.get('/products/', { params: { page_size: 200 } })
      setProducts(asArray<Product>(response.data))
      setProductsStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger la liste des produits.'
      setProductsError(message)
      setProductsStatus('error')
    }
  }, [])

  useEffect(() => {
    loadMovements()
    loadProducts()
  }, [loadMovements, loadProducts])

  const productMap = useMemo(() => {
    const map = new Map<number, Product>()
    products.forEach((product) => {
      map.set(product.id, product)
    })
    return map
  }, [products])

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const date = parseDate(movement.occurred_at)
      if (!withinPeriod(date, filters.period)) return false
      if (filters.product !== 'all' && String(movement.product) !== filters.product) return false
      if (filters.mov_type !== 'all' && movement.mov_type !== filters.mov_type) return false
      return true
    })
  }, [filters.mov_type, filters.period, filters.product, movements])

  const summary = useMemo(() => {
    const totals = new Map<
      number,
      {
        product: Product | undefined
        inTotal: number
        outTotal: number
        adjustTotal: number
      }
    >()
    movements.forEach((movement) => {
      const base = totals.get(movement.product) ?? {
        productId: movement.product,
        product: productMap.get(movement.product),
        inTotal: 0,
        outTotal: 0,
        adjustTotal: 0,
      }
      const quantity = getQuantityNumber(movement.quantity)
      if (movement.mov_type === 'IN') {
        base.inTotal += quantity
      } else if (movement.mov_type === 'OUT') {
        base.outTotal += quantity
      } else if (movement.mov_type === 'ADJUST') {
        base.adjustTotal += quantity
      }
      totals.set(movement.product, base)
    })
    return Array.from(totals.values()).map((record) => {
      const net = record.inTotal + record.adjustTotal - record.outTotal
      return {
        productId: record.productId,
        product: record.product,
        inTotal: record.inTotal,
        outTotal: record.outTotal,
        adjustTotal: record.adjustTotal,
        net,
      }
    })
  }, [movements, productMap])

  const openModal = () => {
    setForm(defaultFormState)
    setFormError(null)
    setIsEditorOpen(true)
  }

  const closeModal = () => {
    setForm(defaultFormState)
    setFormError(null)
    setIsEditorOpen(false)
  }

  const handleFormChange =
    (field: keyof MovementFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const saveMovement = async () => {
    if (!form.product) {
      setFormError('Selectionnez un produit.')
      return
    }
    if (!form.quantity.trim()) {
      setFormError('Indiquez une quantite.')
      return
    }
    const quantityValue = Number(form.quantity)
    if (Number.isNaN(quantityValue)) {
      setFormError('La quantite doit etre un nombre.')
      return
    }
    if ((form.mov_type === 'IN' || form.mov_type === 'OUT') && quantityValue <= 0) {
      setFormError('Les entrees et sorties doivent avoir une quantite positive.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    setFeedback(null)
    const payload = {
      product: Number(form.product),
      mov_type: form.mov_type,
      quantity: form.mov_type === 'OUT' ? Math.abs(quantityValue) : quantityValue,
      ref: form.ref.trim(),
    }
    try {
      await api.post('/stock-movements/', payload)
      setFeedback('Mouvement enregistre.')
      closeModal()
      await loadMovements()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Echec de l enregistrement du mouvement."
      setFormError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card
        title="Synthese des stocks"
        description="Visualisez les niveaux approximatifs par produit. Les ajustements finaux auront lieu cote backend."
        actions={
          <Button variant="secondary" size="sm" onClick={loadMovements} disabled={status === 'loading'}>
            Rafraichir
          </Button>
        }
        contentClassName="gap-4"
      >
        {summary.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-600">
            Aucune donnee de stock encore disponible.
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Produit</TableHeadCell>
                  <TableHeadCell>Entrees</TableHeadCell>
                  <TableHeadCell>Sorties</TableHeadCell>
                  <TableHeadCell>Ajustements</TableHeadCell>
                  <TableHeadCell>Net theorique</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((row) => (
                  <TableRow key={row.productId}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {row.product?.name ?? 'Produit inconnu'}
                        </span>
                        {row.product?.sku && (
                          <span className="text-xs text-slate-500">{row.product.sku}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(row.inTotal)}</TableCell>
                    <TableCell>{formatNumber(row.outTotal)}</TableCell>
                    <TableCell>{formatNumber(row.adjustTotal)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          row.net <= 5
                            ? 'inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800'
                            : 'inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800'
                        }
                      >
                        {formatNumber(row.net)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {productsError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {productsError}
            <div className="mt-2">
              <Button size="sm" variant="ghost" onClick={loadProducts}>
                Reessayer
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Historique des mouvements"
        description="Filtrez les entrees, sorties et ajustements pour suivre les flux de stock."
        actions={
          <Button variant="primary" size="sm" onClick={openModal}>
            Nouveau mouvement
          </Button>
        }
        contentClassName="gap-4"
      >
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={filters.product}
              onChange={(event) => setFilters((prev) => ({ ...prev, product: event.target.value }))}
            >
              <option value="all">Tous les produits</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={filters.mov_type}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, mov_type: event.target.value as typeof prev.mov_type }))
              }
            >
              {movTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={filters.period}
              onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value }))}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-end">
              <Button variant="secondary" size="sm" onClick={loadMovements} disabled={status === 'loading'}>
                Actualiser
              </Button>
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
          {status === 'loading' && <div className="h-32 rounded-2xl bg-slate-200/50 animate-pulse" />}
          {status === 'success' && filteredMovements.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-600">
              Aucun mouvement ne correspond a votre filtre.
            </div>
          )}
          {status === 'success' && filteredMovements.length > 0 && (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Produit</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Quantite</TableHeadCell>
                    <TableHeadCell>Reference</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => {
                    const product = productMap.get(movement.product)
                    const quantity = getQuantityNumber(movement.quantity)
                    const signedQuantity =
                      movement.mov_type === 'OUT'
                        ? -Math.abs(quantity)
                        : movement.mov_type === 'ADJUST'
                          ? quantity
                          : Math.abs(quantity)

                    const badgeClasses =
                      movement.mov_type === 'IN'
                        ? 'bg-emerald-100 text-emerald-700'
                        : movement.mov_type === 'OUT'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-200 text-slate-700'

                    return (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm text-slate-600">
                          {formatDateTime(movement.occurred_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {product?.name ?? `#${movement.product}`}
                            </span>
                            {product?.sku && (
                              <span className="text-xs text-slate-500">{product.sku}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${badgeClasses}`}>
                            {movement.mov_type}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          {formatNumber(signedQuantity)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {movement.ref || <span className="text-slate-400">-</span>}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Card>

      <Modal
        open={isEditorOpen}
        onClose={closeModal}
        title="Nouveau mouvement de stock"
        description="Enregistrez une entree, une sortie ou un ajustement ponctuel pour garder un historique cohere."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal} disabled={isSaving}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={saveMovement} disabled={isSaving}>
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
          <span className="font-medium text-slate-700">Produit</span>
          <select
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.product}
            onChange={handleFormChange('product')}
          >
            <option value="">Choisissez un produit</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Type de mouvement</span>
          <select
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.mov_type}
            onChange={handleFormChange('mov_type')}
          >
            <option value="IN">Entree</option>
            <option value="OUT">Sortie</option>
            <option value="ADJUST">Ajustement</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Quantite</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.quantity}
            onChange={handleFormChange('quantity')}
            type="number"
            step="0.01"
            placeholder="0"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Reference (optional)</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.ref}
            onChange={handleFormChange('ref')}
            placeholder="Bon de commande, numero de lot..."
          />
        </label>
      </Modal>
    </div>
  )
}
