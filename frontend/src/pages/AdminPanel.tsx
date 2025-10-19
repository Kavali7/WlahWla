import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from '../components/Table'
import { api } from '../lib/api'

type User = {
  id: string
  username: string
  email: string
}

type FormState = {
  username: string
  email: string
}

const initialForm: FormState = { username: '', email: '' }

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => api.get('/users/').then((response) => setUsers(response.data)), [])

  useEffect(() => {
    load()
  }, [load])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.username || !form.email) return

    setSaving(true)
    try {
      await api.post('/users/', form)
      setForm(initialForm)
      await load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card
        title="Membres de l'organisation"
        description="Invitez de nouveaux collaborateurs et suivez leurs acces."
        contentClassName="gap-6"
      >
        <form
          className="grid gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm sm:grid-cols-[1fr_1fr_auto]"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Email professionnel"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Button type="submit" size="md" disabled={saving}>
            {saving ? 'Invitation en cours...' : 'Inviter'}
          </Button>
        </form>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-500">
            Aucun utilisateur pour le moment. Invitez votre premier collaborateur ci-dessus.
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Utilisateur</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-900">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  )
}
