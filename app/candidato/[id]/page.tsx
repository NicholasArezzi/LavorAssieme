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

  const iniziali = `${candidato.nome?.[0] || ''}${candidato.cognome?.[0] || ''}`.toUpperCase()

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
            {candidato.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={candidato.avatar_url}
                alt={`${candidato.nome} ${candidato.cognome}`}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0">
                {iniziali || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-800">
                {candidato.nome} {candidato.cognome}
              </h1>
              <p className="text-blue-600 font-medium mt-0.5">{candidato.ruolo_cercato}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-slate-500 text-sm">📍 {candidato.citta}</span>
                {candidato.anni_esperienza != null && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {candidato.anni_esperienza === 0
                      ? 'Nessuna esperienza'
                      : `${candidato.anni_esperienza} ann${candidato.anni_esperienza === 1 ? 'o' : 'i'} di esperienza`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Presentazione */}
          {candidato.bio && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Presentazione</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{candidato.bio}</p>
            </div>
          )}

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
            {candidato.telefono && candidato.telefono_visibile && (
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
            {candidato.linkedin && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">LinkedIn</p>
                <a
                  href={candidato.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline truncate block"
                >
                  Vedi profilo LinkedIn →
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
