import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect per reset password
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Controlla se il profilo esiste già
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()

        // Se il profilo esiste, redirect alla dashboard
        if (profile?.role === 'candidato') {
          return NextResponse.redirect(`${origin}/candidato/dashboard`)
        }
        if (profile?.role === 'azienda') {
          return NextResponse.redirect(`${origin}/azienda/dashboard`)
        }

        // Profilo non esiste: crea profilo dai metadata (registrazione con email confirmation)
        const meta = user.user_metadata as Record<string, string | number>
        const ruolo = meta?.role as 'candidato' | 'azienda' | undefined

        if (ruolo) {
          // Crea profilo
          await supabase.from('profiles').insert({ user_id: user.id, role: ruolo })

          if (ruolo === 'candidato') {
            await supabase.from('candidati').insert({
              user_id: user.id,
              nome: meta.nome || '',
              cognome: meta.cognome || '',
              telefono: meta.telefono || '',
              citta: meta.citta || '',
              ruolo_cercato: meta.ruolo_cercato || '',
            })
            return NextResponse.redirect(`${origin}/candidato/dashboard`)
          }

          if (ruolo === 'azienda') {
            await supabase.from('aziende').insert({
              user_id: user.id,
              nome_azienda: meta.nome_azienda || '',
              settore: meta.settore || '',
              citta: meta.citta || '',
            })
            return NextResponse.redirect(`${origin}/azienda/dashboard`)
          }
        }
      }

      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login?errore=callback`)
}
