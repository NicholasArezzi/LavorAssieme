'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Candidato {
  id: string
  nome: string
  cognome: string
  telefono: string
  citta: string
  ruolo_cercato: string
  cv_url: string | null
}

export default function CandidatoDashboard() {
  const router = useRouter()

  const [candidato, setCandidato] = useState<Candidato | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [messaggio, setMessaggio] = useState('')
  const [errore, setErrore] = useState('')

  // Form fields
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [citta, setCitta] = useState('')
  const [ruoloCercato, setRuoloCercato] = useState('')

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUserId(user.id)

    const { data } = await supabase
      .from('candidati')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setCandidato(data)
      setNome(data.nome || '')
      setCognome(data.cognome || '')
      setTelefono(data.telefono || '')
      setCitta(data.citta || '')
      setRuoloCercato(data.ruolo_cercato || '')
    }
    setLoading(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessaggio('')
    setErrore('')
    const supabase = createClient()

    const { error } = await supabase
      .from('candidati')
      .update({ nome, cognome, telefono, citta, ruolo_cercato: ruoloCercato })
      .eq('user_id', userId!)

    if (error) {
      setErrore('Errore nel salvataggio. Riprova.')
    } else {
      setMessaggio('Profilo aggiornato con successo!')
      loadData()
    }
    setSaving(false)
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    if (file.type !== 'application/pdf') {
      setErrore('Carica un file PDF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrore('Il file è troppo grande. Max 5MB.')
      return
    }

    setUploading(true)
    setErrore('')
    setMessaggio('')
    const supabase = createClient()

    const filePath = `cv/${userId}/cv.pdf`

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setErrore('Errore nel caricamento del CV.')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(filePath)
    const cvUrl = urlData.publicUrl

    const { error: updateError } = await supabase
      .from('candidati')
      .update({ cv_url: cvUrl })
      .eq('user_id', userId)

    if (updateError) {
      setErrore('CV caricato ma errore nel salvataggio.')
    } else {
      setMessaggio('CV caricato con successo!')
      loadData()
    }
    setUploading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
          <div className="flex items-center gap-4">
            {candidato && (
              <Link
                href={`/candidato/${candidato.id}`}
                className="text-sm text-slate-600 hover:text-blue-600"
                target="_blank"
              >
                Vedi profilo pubblico →
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Il tuo profilo</h1>
          <p className="text-slate-500 text-sm mt-1">Mantieni aggiornate le tue informazioni per essere trovato dalle aziende</p>
        </div>

        {messaggio && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
            {messaggio}
          </div>
        )}
        {errore && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {errore}
          </div>
        )}

        <div className="grid gap-6">
          {/* Form dati personali */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Dati personali</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input
                    type="text" value={nome} onChange={e => setNome(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cognome</label>
                  <input
                    type="text" value={cognome} onChange={e => setCognome(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
                <input
                  type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Città</label>
                <input
                  type="text" value={citta} onChange={e => setCitta(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ruolo cercato</label>
                <input
                  type="text" value={ruoloCercato} onChange={e => setRuoloCercato(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="es. Sviluppatore Web"
                />
              </div>
              <button
                type="submit" disabled={saving}
                className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Salvataggio...' : 'Salva modifiche'}
              </button>
            </form>
          </div>

          {/* CV Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Curriculum Vitae</h2>
            <p className="text-sm text-slate-500 mb-4">Carica il tuo CV in formato PDF (max 5MB)</p>

            {candidato?.cv_url && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                <span className="text-blue-600">📄</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">CV caricato</p>
                </div>
                <a
                  href={candidato.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Visualizza
                </a>
              </div>
            )}

            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                <p className="text-2xl mb-2">📁</p>
                <p className="text-sm font-medium text-slate-700">
                  {uploading ? 'Caricamento in corso...' : 'Clicca per caricare il CV'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Solo PDF, max 5MB</p>
              </div>
              <input
                type="file" accept=".pdf" onChange={handleCvUpload}
                className="hidden" disabled={uploading}
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  )
}
