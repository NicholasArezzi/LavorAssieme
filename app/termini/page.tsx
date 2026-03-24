import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini e Condizioni – LavorAssieme',
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Termini e Condizioni d&apos;Uso</h1>
          <p className="text-slate-500 text-sm mb-8">Ultimo aggiornamento: marzo 2025</p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Accettazione dei termini</h2>
              <p>
                Utilizzando LavorAssieme accetti integralmente i presenti Termini e Condizioni d&apos;Uso.
                Se non li accetti, ti chiediamo di non utilizzare la piattaforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Descrizione del servizio</h2>
              <p>
                LavorAssieme è una piattaforma online che mette in contatto candidati in cerca di lavoro
                con aziende alla ricerca di personale. Il servizio è gratuito per tutti gli utenti.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">3. Registrazione e account</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Devi avere almeno 16 anni per registrarti.</li>
                <li>Le informazioni fornite in fase di registrazione devono essere veritiere e aggiornate.</li>
                <li>Sei responsabile della sicurezza della tua password e di tutte le attività svolte con il tuo account.</li>
                <li>Puoi eliminare il tuo account in qualsiasi momento contattando il supporto.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">4. Obblighi degli utenti</h2>
              <p>È vietato:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Inserire dati falsi, fuorvianti o di terzi senza autorizzazione.</li>
                <li>Pubblicare contenuti illegali, offensivi, discriminatori o che violino diritti di terzi.</li>
                <li>Usare la piattaforma per attività di spam, phishing o frode.</li>
                <li>Raccogliere dati di altri utenti per scopi non collegati al servizio.</li>
                <li>Tentare di accedere a sezioni non autorizzate della piattaforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">5. Contenuti e curriculum vitae</h2>
              <p>
                Caricando il tuo CV su LavorAssieme autorizzi la piattaforma a conservarlo e a renderlo
                accessibile alle aziende registrate. Rimani il proprietario dei tuoi dati e puoi
                richiederne la rimozione in qualsiasi momento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">6. Limitazione di responsabilità</h2>
              <p>
                LavorAssieme è una piattaforma di intermediazione e non è parte nei rapporti di lavoro
                che possono instaurarsi tra candidati e aziende. Non garantiamo che la ricerca di lavoro
                o di candidati abbia esito positivo. Non siamo responsabili di danni derivanti da:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>informazioni false inserite da altri utenti;</li>
                <li>interruzioni del servizio per cause tecniche o di forza maggiore;</li>
                <li>perdita di dati per cause indipendenti dalla nostra volontà.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">7. Modifiche al servizio e ai termini</h2>
              <p>
                Ci riserviamo il diritto di modificare i presenti Termini in qualsiasi momento.
                Le modifiche saranno comunicate via email o mediante avviso sulla piattaforma.
                L&apos;uso continuato del servizio dopo la notifica costituisce accettazione dei nuovi termini.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">8. Legge applicabile e foro competente</h2>
              <p>
                I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia
                è competente il Foro di Milano, salvo diversa disposizione di legge inderogabile
                a tutela dei consumatori.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">9. Contatti</h2>
              <p>
                Per qualsiasi richiesta scrivi a{' '}
                <strong>supporto@lavorassieme.it</strong>
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
