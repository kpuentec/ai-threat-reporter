
-- AI Cyber Threat Reporter — Supabase Schema

-- users (stores app-level data)
CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- analyses
CREATE TABLE IF NOT EXISTS public.analyses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    input_text      TEXT NOT NULL,
    input_type      TEXT NOT NULL DEFAULT 'text',   -- 'text', 'file', 'url'
    threat_type     TEXT NOT NULL,
    severity        TEXT NOT NULL DEFAULT 'Unknown', -- 'Low', 'Medium', 'High', 'Critical'
    impact          TEXT NOT NULL,
    remediation     TEXT NOT NULL,
    vt_result       JSONB,                           -- VirusTotal result
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- log files
CREATE TABLE IF NOT EXISTS public.log_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    filename        TEXT NOT NULL,
    line_count      INT NOT NULL DEFAULT 0,
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- usage tracking (per user, per day)
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    count       INT NOT NULL DEFAULT 0,
    UNIQUE(user_id, date)
);

-- RLS users only see their own data
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_files       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking  ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "users_own" ON public.users
    FOR ALL USING (auth.uid() = id);

-- analyses
CREATE POLICY "analyses_own" ON public.analyses
    FOR ALL USING (auth.uid() = user_id);

-- log_files
CREATE POLICY "log_files_own" ON public.log_files
    FOR ALL USING (auth.uid() = user_id);

-- usage_tracking
CREATE POLICY "usage_own" ON public.usage_tracking
    FOR ALL USING (auth.uid() = user_id);

-- indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id   ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created   ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user_date    ON public.usage_tracking(user_id, date);

-- auto-create user profile row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();