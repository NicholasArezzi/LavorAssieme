-- LavorAssieme – Schema Supabase
-- Esegui questo SQL nell'editor SQL di Supabase

-- =====================
-- TABELLE
-- =====================

-- Profili (collegati a auth.users)
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('candidato', 'azienda')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Candidati
CREATE TABLE public.candidati (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT,
  cognome TEXT,
  telefono TEXT,
  citta TEXT,
  ruolo_cercato TEXT,
  cv_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Aziende
CREATE TABLE public.aziende (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome_azienda TEXT NOT NULL,
  settore TEXT,
  citta TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidati ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aziende ENABLE ROW LEVEL SECURITY;

-- Profiles: ogni utente può leggere/scrivere solo il proprio
CREATE POLICY "Profilo personale" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

-- Candidati: lettura pubblica, scrittura solo propria
CREATE POLICY "Candidati lettura pubblica" ON public.candidati
  FOR SELECT USING (true);

CREATE POLICY "Candidati scrittura propria" ON public.candidati
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidati aggiornamento proprio" ON public.candidati
  FOR UPDATE USING (auth.uid() = user_id);

-- Aziende: ogni azienda legge/scrive solo la propria
CREATE POLICY "Aziende propria" ON public.aziende
  FOR ALL USING (auth.uid() = user_id);

-- =====================
-- STORAGE: bucket "cvs"
-- =====================

-- Crea il bucket (puoi farlo anche da UI Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT DO NOTHING;

-- Policy storage: upload solo autenticati
CREATE POLICY "Upload CV autenticati" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Policy storage: lettura pubblica dei CV
CREATE POLICY "Lettura CV pubblica" ON storage.objects
  FOR SELECT USING (bucket_id = 'cvs');

-- Policy storage: aggiornamento solo del proprio CV
CREATE POLICY "Aggiornamento CV proprio" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[2]);
