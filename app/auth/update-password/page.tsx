'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [conferma, setConferma] = useState('')
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== conferma) {
      setErrore('Le password non coincidono.')
      return
    }
    if (password.length < 8) {
      setErrore('La password deve essere di almeno 8 caratteri.')
      return
    }

    setLoading(true)
    setErrore('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrore('Errore nell\'aggiornamento. Il link potrebbe essere scaduto.')
      setLoading(false)
      return
    }

    // Ottieni il profilo per redirect corretto
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profile?.role === 'candidato') {
        router.push('/candidato/dashboard')
        return
      }
      if (profile?.role === 'azienda') {
        router.push('/azienda/dashboard')
        return
      }
    }
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Nuova password</h1>
            <p className="text-slate-500 text-sm mb-6">Scegli una nuova password per il tuo account.</p>

            {errore && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {errore}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nuova password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimo 8 caratteri"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Conferma password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={conferma}
                  onChange={e => setConferma(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ripeti la password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Aggiornamento...' : 'Aggiorna password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
