import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – LavorAssieme',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">LavorAssieme</Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 text-sm mb-8">Ultimo aggiornamento: marzo 2025</p>

          <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">1. Titolare del trattamento</h2>
              <p>
                Il titolare del trattamento dei dati personali è <strong>LavorAssieme</strong>,
                raggiungibile all&apos;indirizzo email: <strong>privacy@lavorassieme.it</strong>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">2. Dati raccolti</h2>
              <p>LavorAssieme raccoglie le seguenti categorie di dati personali:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Dati di registrazione:</strong> indirizzo email e password (cifrata).</li>
                <li><strong>Dati del profilo candidato:</strong> nome, cognome, telefono, città, ruolo cercato, curriculum vitae (PDF).</li>
                <li><strong>Dati del profilo azienda:</strong> nome azienda, settore, città.</li>
                <li><strong>Dati tecnici:</strong> log di accesso, indirizzo IP, tipo di browser (raccolti automaticamente per sicurezza e manutenzione).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">3. Finalità e base giuridica del trattamento</h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  <strong>Erogazione del servizio</strong> (art. 6, par. 1, lett. b GDPR – esecuzione del contratto):
                  gestione dell&apos;account, pubblicazione del profilo, ricerca candidati.
                </li>
                <li>
                  <strong>Obblighi di legge</strong> (art. 6, par. 1, lett. c GDPR):
                  adempimento di obblighi fiscali e normativi.
                </li>
                <li>
                  <strong>Legittimo interesse</strong> (art. 6, par. 1, lett. f GDPR):
                  prevenzione di abusi e sicurezza della piattaforma.
                </li>
                <li>
                  <strong>Consenso</strong> (art. 6, par. 1, lett. a GDPR):
                  comunicazioni promozionali, ove espressamente richiesto.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">4. Visibilità dei dati</h2>
              <p>
                I profili dei <strong>candidati</strong> (nome, cognome, città, ruolo cercato, CV) sono
                visibili alle aziende registrate sulla piattaforma. Il curriculum caricato è scaricabile
                dalle aziende registrate. L&apos;indirizzo email non è mai mostrato pubblicamente.
              </p>
              <p className="mt-2">
                I dati delle <strong>aziende</strong> (nome, settore, città) sono visibili ai candidati
                registrati.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">5. Comunicazione a terzi</h2>
              <p>
                I dati non sono ceduti a terzi per finalità di marketing. Vengono condivisi solo con:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Supabase Inc.</strong> (USA) – fornitore di database e autenticazione, con garanzie adeguate ai sensi dell&apos;art. 46 GDPR (Standard Contractual Clauses).</li>
                <li><strong>Vercel Inc.</strong> (USA) – fornitore di hosting, con analoghe garanzie contrattuali.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">6. Conservazione dei dati</h2>
              <p>
                I dati vengono conservati per tutta la durata dell&apos;account e per i 12 mesi successivi
                alla cancellazione, salvo obblighi di legge che impongano periodi più lunghi.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">7. Diritti dell&apos;interessato</h2>
              <p>Hai il diritto di:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Accedere ai tuoi dati personali (art. 15 GDPR)</li>
                <li>Rettificarli se inesatti (art. 16 GDPR)</li>
                <li>Chiederne la cancellazione («diritto all&apos;oblio», art. 17 GDPR)</li>
                <li>Limitare il trattamento (art. 18 GDPR)</li>
                <li>Ricevere i tuoi dati in formato portabile (art. 20 GDPR)</li>
                <li>Opporti al trattamento (art. 21 GDPR)</li>
                <li>Revocare il consenso in qualsiasi momento</li>
                <li>Proporre reclamo al Garante per la Protezione dei Dati Personali (<a href="https://www.gpdp.it" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.gpdp.it</a>)</li>
              </ul>
              <p className="mt-2">
                Per esercitare questi diritti scrivi a <strong>privacy@lavorassieme.it</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">8. Cookie</h2>
              <p>
                Per informazioni sui cookie utilizzati, consulta la nostra{' '}
                <Link href="/cookie" className="text-blue-600 hover:underline">Cookie Policy</Link>.
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
