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

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

type Supplier = {
  id: number
  name: string
  contact_email?: string
  phone?: string
}

type SupplierFormState = {
  id?: number
  name: string
  contact_email: string
  phone: string
}

const defaultFormState: SupplierFormState = {
  name: '',
  contact_email: '',
  phone: '',
}

const asArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (Array.isArray(payload?.results)) return payload.results as T[]
  return []
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  const [form, setForm] = useState<SupplierFormState>(defaultFormState)
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadSuppliers = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const response = await api.get('/suppliers/')
      setSuppliers(asArray<Supplier>(response.data))
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de charger les fournisseurs. Verifiez votre connexion.'
      setStatus('error')
      setError(message)
    }
  }, [])

  useEffect(() => {
    loadSuppliers()
  }, [loadSuppliers])

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers
    const term = normalize(search.trim())
    return suppliers.filter((supplier) => {
      const haystack = [
        supplier.name,
        supplier.contact_email ?? '',
        supplier.phone ?? '',
      ]
        .map((value) => normalize(value))
        .join(' ')
      return haystack.includes(term)
    })
  }, [search, suppliers])

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

  const openEdit = (supplier: Supplier) => {
    setForm({
      id: supplier.id,
      name: supplier.name ?? '',
      contact_email: supplier.contact_email ?? '',
      phone: supplier.phone ?? '',
    })
    setEditorMode('edit')
    setIsEditorOpen(true)
    setFormError(null)
  }

  const handleInputChange =
    (field: keyof SupplierFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const saveSupplier = async () => {
    if (!form.name.trim()) {
      setFormError('Le nom du fournisseur est obligatoire.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    setFeedback(null)
    const payload = {
      name: form.name.trim(),
      contact_email: form.contact_email.trim(),
      phone: form.phone.trim(),
    }
    try {
      if (editorMode === 'edit' && form.id) {
        await api.patch(`/suppliers/${form.id}/`, payload)
        setFeedback('Fournisseur mis a jour.')
      } else {
        await api.post('/suppliers/', payload)
        setFeedback('Fournisseur cree.')
      }
      resetEditor()
      await loadSuppliers()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Echec de l'enregistrement du fournisseur."
      setFormError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteSupplier = async (supplier: Supplier) => {
    const confirmation = window.confirm(
      `Confirmez-vous la suppression du fournisseur "${supplier.name}" ?`,
    )
    if (!confirmation) {
      return
    }
    setFeedback(null)
    setError(null)
    try {
      await api.delete(`/suppliers/${supplier.id}/`)
      setFeedback('Fournisseur supprime.')
      await loadSuppliers()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de supprimer ce fournisseur.'
      setError(message)
    }
  }

  return (
    <div className="grid gap-6">
      <Card
        title="Fournisseurs"
        description="Centralisez vos contacts d'approvisionnement pour suivre les commandes et reapprovisionnements."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={loadSuppliers} disabled={status === 'loading'}>
              Rafraichir
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              Nouveau fournisseur
            </Button>
          </div>
        }
        contentClassName="gap-4"
      >
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 text-sm focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Rechercher un fournisseur (nom, email, telephone)"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span className="text-xs text-slate-500">
              {filteredSuppliers.length}/{suppliers.length} resultats
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
          {status === 'success' && filteredSuppliers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-surface-muted px-5 py-6 text-sm text-slate-600">
              Aucun fournisseur ne correspond a votre recherche.
            </div>
          )}
          {status === 'success' && filteredSuppliers.length > 0 && (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeadCell>Nom</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Telephone</TableHeadCell>
                    <TableHeadCell className="text-right">Actions</TableHeadCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium text-slate-900">{supplier.name}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {supplier.contact_email || <span className="text-slate-400">Non renseigne</span>}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {supplier.phone || <span className="text-slate-400">Non renseigne</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(supplier)}>
                            Editer
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteSupplier(supplier)}>
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
        title={editorMode === 'edit' ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
        description="Renseignez les informations utiles pour suivre vos partenaires d'approvisionnement."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={resetEditor} disabled={isSaving}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={saveSupplier} disabled={isSaving}>
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
          <span className="font-medium text-slate-700">Nom</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.name}
            onChange={handleInputChange('name')}
            placeholder="Nom du fournisseur"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Email</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.contact_email}
            onChange={handleInputChange('contact_email')}
            placeholder="contact@exemple.com"
            type="email"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700">Telephone</span>
          <input
            className="h-10 rounded-xl border border-slate-200 px-3 focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.phone}
            onChange={handleInputChange('phone')}
            placeholder="+221 00 00 00 00"
          />
        </label>
      </Modal>
    </div>
  )
}

