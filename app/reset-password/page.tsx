'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviato, setInviato] = useState(false)
  const [errore, setErrore] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrore('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
      setErrore('Errore nell\'invio. Controlla l\'email inserita.')
      setLoading(false)
      return
    }

    setInviato(true)
    setLoading(false)
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
            {inviato ? (
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">Email inviata!</h1>
                <p className="text-slate-500 text-sm mb-6">
                  Controlla la tua casella email e clicca il link per impostare una nuova password.
                </p>
                <Link href="/login" className="text-blue-600 text-sm font-medium hover:underline">
                  Torna al login
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Password dimenticata?</h1>
                <p className="text-slate-500 text-sm mb-6">
                  Inserisci la tua email e ti invieremo un link per reimpostare la password.
                </p>

                {errore && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    {errore}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@esempio.it"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Invio...' : 'Invia link di reset'}
                  </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  <Link href="/login" className="text-blue-600 font-medium hover:underline">
                    ← Torna al login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
