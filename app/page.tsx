import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">LavorAssieme</span>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Accedi
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Trova lavoro o i candidati giusti
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-xl mx-auto">
              LavorAssieme connette candidati e aziende in tutta Italia. Semplice, veloce, gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/registrati?ruolo=candidato"
                className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Sono un Candidato
              </Link>
              <Link
                href="/registrati?ruolo=azienda"
                className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-400 transition-colors text-center border border-blue-400"
              >
                Sono un&apos;Azienda
              </Link>
            </div>
          </div>
        </section>

        {/* Come funziona */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-12">
              Come funziona
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Candidati */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Per i Candidati</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Registrati gratuitamente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Carica il tuo CV in PDF
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Vieni trovato dalle aziende
                  </li>
                </ul>
                <Link
                  href="/registrati?ruolo=candidato"
                  className="mt-5 inline-block bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Registrati come candidato
                </Link>
              </div>

              {/* Aziende */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-emerald-600 text-xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Per le Aziende</h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    Registra la tua azienda
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    Cerca candidati per ruolo e città
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    Scarica i CV direttamente
                  </li>
                </ul>
                <Link
                  href="/registrati?ruolo=azienda"
                  className="mt-5 inline-block bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Registra la tua azienda
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4">
        <div className="max-w-5xl mx-auto text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} LavorAssieme – Piattaforma italiana per il lavoro
        </div>
      </footer>
    </div>
  );
}
