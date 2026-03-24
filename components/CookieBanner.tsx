'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && !localStorage.getItem('cookie_consent')
  )

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-200 flex-1">
          Utilizziamo cookie tecnici necessari al funzionamento del sito e cookie di preferenza
          per ricordare le tue scelte. Non utilizziamo cookie di profilazione o advertising.{' '}
          <Link href="/cookie" className="underline hover:text-white text-slate-300">
            Cookie Policy
          </Link>{' '}
          –{' '}
          <Link href="/privacy" className="underline hover:text-white text-slate-300">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Rifiuta
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  )
}
