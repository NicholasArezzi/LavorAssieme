'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function RegistratiForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ruoloParam = searchParams.get('ruolo') as 'candidato' | 'azienda' | null

  const [step, setStep] = useState<'ruolo' | 'form'>(ruoloParam ? 'form' : 'ruolo')
  const [ruolo, setRuolo] = useState<'candidato' | 'azienda'>(ruoloParam || 'candidato')
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')

  // Campi comuni
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Campi candidato
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [citta, setCitta] = useState('')
  const [ruoloCercato, setRuoloCercato] = useState('')

  // Campi azienda
  const [nomeAzienda, setNomeAzienda] = useState('')
  const [settore, setSettore] = useState('')
  const [cittaAzienda, setCittaAzienda] = useState('')

  useEffect(() => {
    if (ruoloParam) {
      setRuolo(ruoloParam)
      setStep('form')
    }
  }, [ruoloParam])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrore('')

    const supabase = createClient()

    // 1. Crea account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      setErrore(authError?.message || 'Errore durante la registrazione.')
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // 2. Crea profilo
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ user_id: userId, role: ruolo })

    if (profileError) {
      setErrore('Errore nella creazione del profilo.')
      setLoading(false)
      return
    }

    // 3. Inserisci dati specifici
    if (ruolo === 'candidato') {
      const { error: candidatoError } = await supabase
        .from('candidati')
        .insert({
          user_id: userId,
          nome,
          cognome,
          telefono,
          citta,
          ruolo_cercato: ruoloCercato,
        })

      if (candidatoError) {
        setErrore('Errore nel salvataggio dei dati.')
        setLoading(false)
        return
      }
      router.push('/candidato/dashboard')
    } else {
      const { error: aziendaError } = await supabase
        .from('aziende')
        .insert({
          user_id: userId,
          nome_azienda: nomeAzienda,
          settore,
          citta: cittaAzienda,
        })

      if (aziendaError) {
        setErrore('Errore nel salvataggio dei dati.')
        setLoading(false)
        return
      }
      router.push('/azienda/dashboard')
    }
  }

  if (step === 'ruolo') {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Registrati</h1>
          <p className="text-slate-500 text-sm mb-8">Chi sei?</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setRuolo('candidato'); setStep('form') }}
              className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="text-3xl">👤</span>
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-blue-700">Candidato</p>
                <p className="text-xs text-slate-500 mt-1">Cerco lavoro</p>
              </div>
            </button>
            <button
              onClick={() => { setRuolo('azienda'); setStep('form') }}
              className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <span className="text-3xl">🏢</span>
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Azienda</p>
                <p className="text-xs text-slate-500 mt-1">Cerco personale</p>
              </div>
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Hai già un account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Accedi</Link>
        </p>
      </div>
    )
  }

  const isCandidato = ruolo === 'candidato'
  const accent = isCandidato ? 'blue' : 'emerald'

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <button
          onClick={() => setStep('ruolo')}
          className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
        >
          ← Indietro
        </button>

        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          isCandidato ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {isCandidato ? '👤 Candidato' : '🏢 Azienda'}
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Crea il tuo account</h1>

        {errore && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {errore}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campi candidato */}
          {isCandidato && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                  <input
                    type="text" required value={nome} onChange={e => setNome(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cognome *</label>
                  <input
                    type="text" required value={cognome} onChange={e => setCognome(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rossi"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
                <input
                  type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+39 333 1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Città *</label>
                <input
                  type="text" required value={citta} onChange={e => setCitta(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Milano"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ruolo cercato *</label>
                <input
                  type="text" required value={ruoloCercato} onChange={e => setRuoloCercato(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="es. Sviluppatore Web, Grafico, Contabile..."
                />
              </div>
            </>
          )}

          {/* Campi azienda */}
          {!isCandidato && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome azienda *</label>
                <input
                  type="text" required value={nomeAzienda} onChange={e => setNomeAzienda(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Acme S.r.l."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Settore *</label>
                <input
                  type="text" required value={settore} onChange={e => setSettore(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="es. Tecnologia, Commercio, Edilizia..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Città *</label>
                <input
                  type="text" required value={cittaAzienda} onChange={e => setCittaAzienda(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Roma"
                />
              </div>
            </>
          )}

          {/* Campi comuni */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${accent}-500 focus:border-transparent`}
              placeholder="tu@esempio.it"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <input
              type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${accent}-500 focus:border-transparent`}
              placeholder="Minimo 6 caratteri"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-white ${
              isCandidato ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Registrazione in corso...' : 'Crea account'}
          </button>
        </form>
      </div>
      <p className="text-center text-sm text-slate-500 mt-4">
        Hai già un account?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">Accedi</Link>
      </p>
    </div>
  )
}

export default function RegistratiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-slate-500">Caricamento...</div>}>
          <RegistratiForm />
        </Suspense>
      </main>
    </div>
  )
}
