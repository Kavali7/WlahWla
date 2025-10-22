import React, { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { api, syncAll } from '../lib/api'
import SyncStatus from '../components/SyncStatus'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from 'recharts'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>({})
  const [sales, setSales] = useState<any[]>([])
  const [top, setTop] = useState<any[]>([])
  const [split, setSplit] = useState<any[]>([])

  useEffect(() => {
    api.get('/reports/overview').then(r => setMetrics(r.data))
    api.get('/reports/sales_by_month').then(r => setSales(r.data))
    api.get('/reports/top_products').then(r => setTop(r.data))
    api.get('/reports/invoice_status_split').then(r => setSplit(r.data))
    navigator.serviceWorker?.register('/public/service-worker.js')
  }, [])

  return (
    <div className="p-4 grid gap-4">
      <SyncStatus onSync={syncAll} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="CA (mois)"><div className="text-2xl font-semibold">{metrics.mtd_revenue ?? '-'}</div></Card>
        <Card title="Impayés"><div className="text-2xl font-semibold">{metrics.unpaid_total ?? '-'}</div></Card>
        <Card title="Produits actifs"><div className="text-2xl font-semibold">{metrics.active_products ?? '-'}</div></Card>
        <Card title="Ruptures"><div className="text-2xl font-semibold">{metrics.low_stock_count ?? '-'}</div></Card>
      </div>

      <Card title="Ventes 12 derniers mois">
        <div style={{height:260}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Top produits">
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Répartition statuts">
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="status" outerRadius={80} label />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
