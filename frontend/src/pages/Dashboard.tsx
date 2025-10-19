import React, { useEffect, useState } from 'react'
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

type Metrics = Record<string, number | string>
type ChartPoint = Record<string, any>

const formatNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)
  }
  return value
}

const StatCard = ({
  label,
  value,
  helper,
}: {
  label: string
  value: number | string | null | undefined
  helper?: string
}) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-surface px-4 py-3 shadow-sm">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    <span className="text-2xl font-semibold text-slate-900">{formatNumber(value)}</span>
    {helper && <span className="text-xs text-slate-500">{helper}</span>}
  </div>
)

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({})
  const [sales, setSales] = useState<ChartPoint[]>([])
  const [top, setTop] = useState<ChartPoint[]>([])
  const [split, setSplit] = useState<ChartPoint[]>([])

  useEffect(() => {
    let canceled = false

    const ensureArray = (value: unknown): ChartPoint[] => (Array.isArray(value) ? value : [])

    const fetchData = async () => {
      try {
        const response = await api.get('/reports/overview')
        if (!canceled) {
          const payload = response.data
          setMetrics((payload && typeof payload === 'object' ? payload : {}) as Metrics)
        }
      } catch {
        if (!canceled) setMetrics({})
      }

      try {
        const response = await api.get('/reports/sales_by_month')
        if (!canceled) setSales(ensureArray(response.data))
      } catch {
        if (!canceled) setSales([])
      }

      try {
        const response = await api.get('/reports/top_products')
        if (!canceled) setTop(ensureArray(response.data))
      } catch {
        if (!canceled) setTop([])
      }

      try {
        const response = await api.get('/reports/invoice_status_split')
        if (!canceled) setSplit(ensureArray(response.data))
      } catch {
        if (!canceled) setSplit([])
      }
    }

    fetchData()
    navigator.serviceWorker?.register('/service-worker.js')

    return () => {
      canceled = true
    }
  }, [])

  return (
    <div className="grid gap-6">
      <Card
        title="Synchronisation des donnees"
        description="Gardez vos ventes, stocks et contacts alignes sur tous vos appareils."
        contentClassName="gap-4"
      >
        <SyncStatus onSync={syncAll} />
      </Card>

      <Card title="Indicateurs cles" contentClassName="gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CA (mois)" value={metrics.mtd_revenue} helper="Chiffre d'affaires encaisse" />
        <StatCard label="Impayes" value={metrics.unpaid_total} helper="Factures en retard" />
        <StatCard label="Produits actifs" value={metrics.active_products} helper="Catalogue disponible" />
        <StatCard label="Ruptures" value={metrics.low_stock_count} helper="Articles a reapprovisionner" />
      </Card>

      <Card
        title="Ventes des 12 derniers mois"
        description="Analysez votre progression mensuelle pour ajuster vos objectifs."
        contentClassName="gap-0"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3d6bff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Top produits"
          description="Identifiez les articles qui generent le plus de revenus."
          contentClassName="gap-0"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3d6bff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Repartition des statuts de facture"
          description="Suivez la part de vos factures payees, en retard ou en attente."
          contentClassName="gap-0"
        >
          <div className="flex h-64 w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="status" outerRadius={100} fill="#3d6bff" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
