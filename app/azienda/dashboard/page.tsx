'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Candidato {
  id: string
  nome: string
  cognome: string
  citta: string
  ruolo_cercato: string
  telefono: string
  telefono_visibile: boolean
  cv_url: string | null
  avatar_url: string | null
  anni_esperienza: number | null
}

interface Azienda {
  nome_azienda: string
  settore: string
  citta: string
}

export default function AziendaDashboard() {
  const router = useRouter()

  const [azienda, setAzienda] = useState<Azienda | null>(null)
  const [candidati, setCandidati] = useState<Candidato[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  const [cercaRuolo, setCercaRuolo] = useState('')
  const [cercaCitta, setCercaCitta] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (cancelled) return

      const { data } = await supabase
        .from('aziende')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (cancelled) return
      if (data) setAzienda(data)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [router])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearching(true)
    const supabase = createClient()

    let query = supabase.from('candidati').select('*')

    if (cercaRuolo.trim()) {
      query = query.ilike('ruolo_cercato', `%${cercaRuolo.trim()}%`)
    }
    if (cercaCitta.trim()) {
      query = query.ilike('citta', `%${cercaCitta.trim()}%`)
    }

    const { data } = await query.order('id', { ascending: false })
    setCandidati(data || [])
    setSearching(false)
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
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
            {azienda && (
              <span className="ml-3 text-sm text-slate-500">{azienda.nome_azienda}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            Esci
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Cerca candidati</h1>
          <p className="text-slate-500 text-sm mt-1">
            Trova il candidato giusto per la tua azienda
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Ruolo
              </label>
              <input
                type="text"
                value={cercaRuolo}
                onChange={e => setCercaRuolo(e.target.value)}
                placeholder="es. Sviluppatore, Grafico..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Città
              </label>
              <input
                type="text"
                value={cercaCitta}
                onChange={e => setCercaCitta(e.target.value)}
                placeholder="es. Milano, Roma..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={searching}
                className="w-full sm:w-auto bg-emerald-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {searching ? 'Ricerca...' : 'Cerca'}
              </button>
            </div>
          </form>
        </div>

        {/* Risultati */}
        {candidati.length > 0 ? (
          <div>
            <p className="text-sm text-slate-500 mb-4">
              {candidati.length} candidat{candidati.length === 1 ? 'o' : 'i'} trovat{candidati.length === 1 ? 'o' : 'i'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {candidati.map(c => (
                <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {c.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.avatar_url}
                        alt={`${c.nome} ${c.cognome}`}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
                        {c.nome?.[0]?.toUpperCase()}{c.cognome?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{c.nome} {c.cognome}</p>
                      <p className="text-xs text-slate-500">📍 {c.citta}</p>
                      {c.anni_esperienza != null && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {c.anni_esperienza === 0 ? 'Nessuna esp.' : `${c.anni_esperienza} anni esp.`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {c.ruolo_cercato}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/candidato/${c.id}`}
                      target="_blank"
                      className="text-xs font-medium text-slate-600 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Vedi profilo
                    </Link>
                    {c.cv_url && (
                      <a
                        href={c.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        📥 Scarica CV
                      </a>
                    )}
                    {c.telefono && c.telefono_visibile && (
                      <a
                        href={`tel:${c.telefono}`}
                        className="text-xs font-medium text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        📞 Chiama
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-slate-600 font-medium">Usa la ricerca per trovare candidati</p>
            <p className="text-slate-400 text-sm mt-1">Puoi cercare per ruolo, città o entrambi</p>
          </div>
        )}
      </main>
    </div>
  )
}
