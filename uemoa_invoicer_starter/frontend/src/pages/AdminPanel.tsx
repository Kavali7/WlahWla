import React, { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../lib/api'

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({ username:'', email:'' })

  const load = () => api.get('/users/').then(r => setUsers(r.data))
  useEffect(() => { load() }, [])

  const createUser = async () => {
    await api.post('/users/', form)
    setForm({username:'', email:''})
    load()
  }

  return (
    <div className="p-4 grid gap-4">
      <Card title="Utilisateurs">
        <div className="flex gap-2 mb-3">
          <input className="border rounded px-2 py-1" placeholder="username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
          <input className="border rounded px-2 py-1" placeholder="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <Button onClick={createUser}>Créer</Button>
        </div>
        <table className="w-full text-sm">
          <thead><tr><th>Username</th><th>Email</th></tr></thead>
          <tbody>
            {users.map(u => <tr key={u.id}><td>{u.username}</td><td>{u.email}</td></tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
