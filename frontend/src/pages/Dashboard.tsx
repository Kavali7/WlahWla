import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from 'recharts'
import { Card } from '../components/Card'
import SyncStatus from '../components/SyncStatus'
import { api, syncAll } from '../lib/api'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency, formatInteger, formatPercent, defaultCurrency } from '../utils/format'

type Metrics = Record<string, number | string>
type ChartPoint = Record<string, any>
type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 jours' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Annee courante' },
]

const channelOptions = [
  { value: 'all', label: 'Tous les canaux' },
  { value: 'pos', label: 'Point de vente' },
  { value: 'online', label: 'Boutique en ligne' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

const skeletonBlock = 'h-24 rounded-2xl bg-slate-200/60 animate-pulse'

const ensureArray = (value: unknown): ChartPoint[] => (Array.isArray(value) ? value : [])

export default function Dashboard() {
  const { organization, organizations, setOrganization } = useAuth()
  const [filters, setFilters] = useState({
    period: '30d',
    channel: 'all',
  })

  const [metrics, setMetrics] = useState<Metrics>({})
  const [metricsStatus, setMetricsStatus] = useState<FetchStatus>('idle')
  const [metricsError, setMetricsError] = useState<string | null>(null)

  const [sales, setSales] = useState<ChartPoint[]>([])
  const [salesStatus, setSalesStatus] = useState<FetchStatus>('idle')
  const [salesError, setSalesError] = useState<string | null>(null)

  const [topProducts, setTopProducts] = useState<ChartPoint[]>([])
  const [topStatus, setTopStatus] = useState<FetchStatus>('idle')
  const [topError, setTopError] = useState<string | null>(null)

  const [invoiceSplit, setInvoiceSplit] = useState<ChartPoint[]>([])
  const [splitStatus, setSplitStatus] = useState<FetchStatus>('idle')
  const [splitError, setSplitError] = useState<string | null>(null)

  const currency = organization?.['currency'] ?? defaultCurrency

  const params = useMemo(() => {
    const base: Record<string, string> = {
      period: filters.period,
    }
    if (filters.channel !== 'all') {
      base.channel = filters.channel
    }
    if (organization?.id) {
      base.organization_id = String(organization.id)
    }
    return base
  }, [filters.channel, filters.period, organization?.id])

  const loadMetrics = useCallback(async () => {
    setMetricsStatus('loading')
    setMetricsError(null)
    try {
      const response = await api.get('/reports/overview', { params })
      const payload = response.data
      setMetrics((payload && typeof payload === 'object' ? payload : {}) as Metrics)
      setMetricsStatus('success')
    } catch (error) {
      setMetrics({})
      setMetricsStatus('error')
      setMetricsError(error instanceof Error ? error.message : 'Impossible de charger les indicateurs.')
    }
  }, [params])

  const loadSales = useCallback(async () => {
    setSalesStatus('loading')
    setSalesError(null)
    try {
      const response = await api.get('/reports/sales_by_month', { params })
      setSales(ensureArray(response.data))
      setSalesStatus('success')
    } catch (error) {
      setSales([])
      setSalesStatus('error')
      setSalesError(error instanceof Error ? error.message : 'Impossible de charger les ventes.')
    }
  }, [params])

  const loadTopProducts = useCallback(async () => {
    setTopStatus('loading')
    setTopError(null)
    try {
      const response = await api.get('/reports/top_products', { params })
      setTopProducts(ensureArray(response.data))
      setTopStatus('success')
    } catch (error) {
      setTopProducts([])
      setTopStatus('error')
      setTopError(error instanceof Error ? error.message : 'Impossible de charger le top produits.')
    }
  }, [params])

  const loadInvoiceSplit = useCallback(async () => {
    setSplitStatus('loading')
    setSplitError(null)
    try {
      const response = await api.get('/reports/invoice_status_split', { params })
      setInvoiceSplit(ensureArray(response.data))
      setSplitStatus('success')
    } catch (error) {
      setInvoiceSplit([])
      setSplitStatus('error')
      setSplitError(
        error instanceof Error ? error.message : 'Impossible de charger la repartition des statuts de facture.',
      )
    }
  }, [params])

  const loadAll = useCallback(() => {
    loadMetrics()
    loadSales()
    loadTopProducts()
    loadInvoiceSplit()
  }, [loadInvoiceSplit, loadMetrics, loadSales, loadTopProducts])

  useEffect(() => {
    if (!organization?.id) return
    loadAll()
  }, [loadAll, organization?.id])

  const handleFilterChange =
    (field: 'period' | 'channel') => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value
      setFilters((prev) => ({ ...prev, [field]: value }))
    }

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setOrganization(value || null)
  }

  const handleExport = () => {
    const headers = ['Indicateur', 'Valeur']
    const rows: string[][] = [
      ['Periode', periodOptions.find((option) => option.value === filters.period)?.label ?? filters.period],
      ['Canal', channelOptions.find((option) => option.value === filters.channel)?.label ?? filters.channel],
    ]
    Object.entries(metrics).forEach(([key, value]) => {
      rows.push([key, typeof value === 'number' ? String(value) : String(value ?? '')])
    })
    const csvContent = [headers, ...rows].map((line) => line.map((cell) => `"${cell}"`).join(';')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `dashboard-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const metricsCards = [
    {
      key: 'mtd_revenue',
      label: 'CA (periode)',
      helper: 'Chiffre d’affaires encaisse',
      value: formatCurrency(metrics.mtd_revenue, currency),
    },
    {
      key: 'unpaid_total',
      label: 'Impayes',
      helper: 'Factures en retard',
      value: formatCurrency(metrics.unpaid_total, currency),
    },
    {
      key: 'active_products',
      label: 'Produits actifs',
      helper: 'Catalogue disponible',
      value: formatInteger(metrics.active_products),
    },
    {
      key: 'low_stock_count',
      label: 'Ruptures',
      helper: 'Articles a reapprovisionner',
      value: formatInteger(metrics.low_stock_count),
    },
    {
      key: 'conversion_rate',
      label: 'Taux de conversion',
      helper: 'Devis transformes en ventes',
      value: formatPercent(metrics.conversion_rate ?? metrics.conversionRate ?? null),
    },
    {
      key: 'avg_invoice_value',
      label: 'Panier moyen',
      helper: 'Montant moyen par facture',
      value: formatCurrency(metrics.avg_invoice_value ?? metrics.average_invoice ?? null, currency),
    },
  ]

  return (
    <div className="grid gap-6">
      <Card
        title="Synchronisation des donnees"
        description="Gardez vos ventes, stocks et contacts alignes sur tous vos appareils."
        contentClassName="gap-4"
      >
        <SyncStatus onSync={syncAll} />
      </Card>

      <Card title="Filtres" contentClassName="gap-4 md:flex md:items-end md:justify-between">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium text-slate-600">
            Periode
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              value={filters.period}
              onChange={handleFilterChange('period')}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-600">
            Canal de vente
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              value={filters.channel}
              onChange={handleFilterChange('channel')}
            >
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-600">
            Organisation
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              value={organization?.id ? String(organization.id) : ''}
              onChange={handleOrganizationChange}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name ?? `Organisation ${org.code ?? org.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={loadAll}>
            Rafraichir
          </Button>
        </div>
      </Card>

      <Card title="Indicateurs cles" contentClassName="gap-4 xs:grid-cols-2 lg:grid-cols-3">
        {metricsStatus === 'loading' && (
          <>
            <div className={skeletonBlock} />
            <div className={skeletonBlock} />
            <div className={skeletonBlock} />
          </>
        )}
        {metricsStatus === 'error' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {metricsError}
            <div className="mt-3">
              <Button size="sm" variant="ghost" onClick={loadMetrics}>
                Reessayer
              </Button>
            </div>
          </div>
        )}
        {metricsStatus === 'success' &&
          metricsCards.map((item) => (
            <div
              key={item.key}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-surface px-4 py-3 shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</span>
              <span className="text-2xl font-semibold text-slate-900">{item.value}</span>
              <span className="text-xs text-slate-500">{item.helper}</span>
            </div>
          ))}
      </Card>

      <Card
        title="Ventes des 12 derniers mois"
        description="Analysez votre progression mensuelle pour ajuster vos objectifs."
        contentClassName="gap-0"
      >
        {salesStatus === 'loading' && <div className={skeletonBlock} />}
        {salesStatus === 'error' && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {salesError}
            <div className="mt-3">
              <Button size="sm" variant="ghost" onClick={loadSales}>
                Reessayer
              </Button>
            </div>
          </div>
        )}
        {salesStatus === 'success' && sales.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
            Aucune donnee pour la periode selectionnee.
          </div>
        )}
        {salesStatus === 'success' && sales.length > 0 && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value as number, currency)} />
                <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                <Line type="monotone" dataKey="revenue" stroke="#3d6bff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Top produits"
          description="Identifiez les articles qui generent le plus de revenus."
          contentClassName="gap-0"
        >
          {topStatus === 'loading' && <div className={skeletonBlock} />}
          {topStatus === 'error' && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              {topError}
              <div className="mt-3">
                <Button size="sm" variant="ghost" onClick={loadTopProducts}>
                Reessayer
                </Button>
              </div>
            </div>
          )}
          {topStatus === 'success' && topProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
              Aucun produit a afficher pour cette periode.
            </div>
          )}
          {topStatus === 'success' && topProducts.length > 0 && (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value as number, currency)} />
                  <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                  <Bar dataKey="revenue" fill="#3d6bff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card
          title="Repartition des statuts de facture"
          description="Suivez la part de vos factures payees, en retard ou en attente."
          contentClassName="gap-0"
        >
          {splitStatus === 'loading' && <div className={skeletonBlock} />}
          {splitStatus === 'error' && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              {splitError}
              <div className="mt-3">
                <Button size="sm" variant="ghost" onClick={loadInvoiceSplit}>
                Reessayer
                </Button>
              </div>
            </div>
          )}
          {splitStatus === 'success' && invoiceSplit.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-4 py-4 text-sm text-slate-500">
              Aucune facture disponible pour cette periode.
            </div>
          )}
          {splitStatus === 'success' && invoiceSplit.length > 0 && (
            <div className="flex h-64 w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invoiceSplit} dataKey="value" nameKey="status" outerRadius={100} fill="#3d6bff" label />
                  <Tooltip formatter={(value: number) => formatPercent(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
