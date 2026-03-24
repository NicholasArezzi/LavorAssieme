import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy – LavorAssieme',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Cookie Policy</h1>
          <p className="text-slate-500 text-sm mb-8">Ultimo aggiornamento: marzo 2025</p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Cosa sono i cookie</h2>
              <p>
                I cookie sono piccoli file di testo che i siti web salvano nel browser dell&apos;utente
                durante la navigazione. Vengono usati per far funzionare il sito correttamente,
                ricordare le preferenze e analizzare l&apos;utilizzo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Cookie utilizzati da LavorAssieme</h2>

              <div className="overflow-x-auto mt-3">
                <table className="w-full border border-slate-200 rounded-lg text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-slate-700 border-b border-slate-200">Nome</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-700 border-b border-slate-200">Tipo</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-700 border-b border-slate-200">Finalità</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-700 border-b border-slate-200">Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 font-mono">sb-*</td>
                      <td className="px-3 py-2">Tecnico</td>
                      <td className="px-3 py-2">Sessione di autenticazione Supabase (necessario per il login)</td>
                      <td className="px-3 py-2">Sessione / 1 anno</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-3 py-2 font-mono">cookie_consent</td>
                      <td className="px-3 py-2">Preferenza</td>
                      <td className="px-3 py-2">Memorizza la scelta dell&apos;utente sul banner cookie</td>
                      <td className="px-3 py-2">1 anno</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-1">Cookie tecnici / necessari</h3>
                  <p className="text-green-700">
                    Indispensabili per il funzionamento del sito. Consentono la navigazione e l&apos;accesso
                    alle aree riservate. Non richiedono consenso (art. 122, comma 1, D.Lgs. 196/2003).
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-1">Cookie di preferenza</h3>
                  <p className="text-blue-700">
                    Permettono al sito di ricordare le scelte dell&apos;utente (es. consenso cookie).
                    Non profilano né tracciano comportamenti.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-700 mb-1">Cookie di terze parti / analytics</h3>
                  <p className="text-slate-600">
                    LavorAssieme attualmente <strong>non utilizza</strong> cookie di profilazione,
                    advertising o analytics di terze parti.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Come gestire i cookie</h2>
              <p>
                Puoi modificare le impostazioni dei cookie direttamente dal tuo browser:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
                <li>Firefox: Impostazioni → Privacy e sicurezza → Cookie e dati siti</li>
                <li>Safari: Preferenze → Privacy → Gestisci dati siti web</li>
                <li>Edge: Impostazioni → Cookie e autorizzazioni sito</li>
              </ul>
              <p className="mt-2 text-slate-500">
                Attenzione: disabilitare i cookie tecnici potrebbe compromettere il funzionamento
                del login e delle funzionalità della piattaforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Normativa di riferimento</h2>
              <p>
                La presente Cookie Policy è redatta in conformità al Regolamento UE 2016/679 (GDPR),
                al D.Lgs. 196/2003 (Codice Privacy) come modificato dal D.Lgs. 101/2018, e alle
                Linee guida del Garante Privacy in materia di cookie (9 giugno 2021).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Contatti</h2>
              <p>
                Per qualsiasi domanda sui cookie scrivi a{' '}
                <strong>privacy@lavorassieme.it</strong>
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-4">
        <div className="max-w-5xl mx-auto text-center text-slate-500 text-sm flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link href="/termini" className="hover:text-blue-600">Termini e Condizioni</Link>
          <Link href="/cookie" className="hover:text-blue-600">Cookie Policy</Link>
        </div>
      </footer>
    </div>
  )
}
