export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CandidatoPublicPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: candidato } = await supabase
    .from('candidati')
    .select('*')
    .eq('id', id)
    .single()

  if (!candidato) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Header profilo */}
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0">
              {candidato.nome?.[0]?.toUpperCase()}{candidato.cognome?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {candidato.nome} {candidato.cognome}
              </h1>
              <p className="text-blue-600 font-medium mt-0.5">{candidato.ruolo_cercato}</p>
              <p className="text-slate-500 text-sm mt-1">📍 {candidato.citta}</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Ruolo cercato</p>
              <p className="text-slate-800 font-medium">{candidato.ruolo_cercato || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Città</p>
              <p className="text-slate-800 font-medium">{candidato.citta || '—'}</p>
            </div>
            {candidato.telefono && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Telefono</p>
                <a
                  href={`tel:${candidato.telefono}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {candidato.telefono}
                </a>
              </div>
            )}
          </div>

          {/* CV Download */}
          {candidato.cv_url ? (
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Curriculum Vitae</h2>
              <a
                href={candidato.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📥 Scarica CV (PDF)
              </a>
            </div>
          ) : (
            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-400 italic">CV non ancora caricato</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
