'use client'

import { useState, useEffect } from 'react'
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
  avatar_url: string | null
  bio: string | null
  linkedin: string | null
  anni_esperienza: number | null
  telefono_visibile: boolean
}

export default function CandidatoDashboard() {
  const router = useRouter()

  const [candidato, setCandidato] = useState<Candidato | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCv, setUploadingCv] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [messaggio, setMessaggio] = useState('')
  const [errore, setErrore] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // Form fields
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [citta, setCitta] = useState('')
  const [ruoloCercato, setRuoloCercato] = useState('')
  const [bio, setBio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [anniEsperienza, setAnniEsperienza] = useState<string>('')
  const [telefonoVisibile, setTelefonoVisibile] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (cancelled) return
      setUserId(user.id)

      const { data } = await supabase
        .from('candidati')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (cancelled) return
      if (data) {
        setCandidato(data)
        setNome(data.nome || '')
        setCognome(data.cognome || '')
        setTelefono(data.telefono || '')
        setCitta(data.citta || '')
        setRuoloCercato(data.ruolo_cercato || '')
        setBio(data.bio || '')
        setLinkedin(data.linkedin || '')
        setAnniEsperienza(data.anni_esperienza != null ? String(data.anni_esperienza) : '')
        setTelefonoVisibile(data.telefono_visibile ?? false)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [router, refreshKey])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessaggio('')
    setErrore('')
    const supabase = createClient()

    const { error } = await supabase
      .from('candidati')
      .update({
        nome,
        cognome,
        telefono,
        citta,
        ruolo_cercato: ruoloCercato,
        bio: bio || null,
        linkedin: linkedin || null,
        anni_esperienza: anniEsperienza !== '' ? parseInt(anniEsperienza) : null,
        telefono_visibile: telefonoVisibile,
      })
      .eq('user_id', userId!)

    if (error) {
      setErrore('Errore nel salvataggio. Riprova.')
    } else {
      setMessaggio('Profilo aggiornato con successo!')
      setRefreshKey(k => k + 1)
    }
    setSaving(false)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrore('Carica un\'immagine JPG, PNG o WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrore('L\'immagine è troppo grande. Max 2MB.')
      return
    }

    setUploadingAvatar(true)
    setErrore('')
    setMessaggio('')
    const supabase = createClient()

    const filePath = `avatar/${userId}/avatar.jpg`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setErrore('Errore nel caricamento della foto.')
      setUploadingAvatar(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    // Aggiunge timestamp per evitare cache del browser
    const avatarUrl = `${urlData.publicUrl}?v=${Date.now()}`

    const { error: updateError } = await supabase
      .from('candidati')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', userId)

    if (updateError) {
      setErrore('Foto caricata ma errore nel salvataggio.')
    } else {
      setMessaggio('Foto del profilo aggiornata!')
      setRefreshKey(k => k + 1)
    }
    setUploadingAvatar(false)
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

    setUploadingCv(true)
    setErrore('')
    setMessaggio('')
    const supabase = createClient()

    const filePath = `cv/${userId}/cv.pdf`

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setErrore('Errore nel caricamento del CV.')
      setUploadingCv(false)
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
      setRefreshKey(k => k + 1)
    }
    setUploadingCv(false)
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

  const iniziali = `${nome?.[0] || ''}${cognome?.[0] || ''}`.toUpperCase()

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
          {/* Foto profilo */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Foto profilo</h2>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                {candidato?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={candidato.avatar_url}
                    alt="Foto profilo"
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {iniziali || '?'}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  {uploadingAvatar ? 'Caricamento...' : 'Cambia foto'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
                <p className="text-xs text-slate-400 mt-1.5">JPG, PNG o WebP · Max 2MB</p>
              </div>
            </div>
          </div>

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
                <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={telefonoVisibile}
                    onChange={e => setTelefonoVisibile(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-xs text-slate-600">
                    Rendi visibile il numero alle aziende
                    <span className="ml-1 text-slate-400">(disattivato = solo il profilo è visibile)</span>
                  </span>
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Città</label>
                  <input
                    type="text" value={citta} onChange={e => setCitta(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Anni di esperienza</label>
                  <input
                    type="number" min="0" max="50" value={anniEsperienza}
                    onChange={e => setAnniEsperienza(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="es. 3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ruolo cercato</label>
                <input
                  type="text" value={ruoloCercato} onChange={e => setRuoloCercato(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="es. Sviluppatore Web"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Presentazione
                  <span className="font-normal text-slate-400 ml-1">— descriviti alle aziende</span>
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Racconta chi sei, le tue competenze e cosa cerchi..."
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{bio.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profilo LinkedIn</label>
                <input
                  type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/tuoprofilo"
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
                  {uploadingCv ? 'Caricamento in corso...' : 'Clicca per caricare il CV'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Solo PDF, max 5MB</p>
              </div>
              <input
                type="file" accept=".pdf" onChange={handleCvUpload}
                className="hidden" disabled={uploadingCv}
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  )
}
