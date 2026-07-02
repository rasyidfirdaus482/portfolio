import { createClient } from '@supabase/supabase-js';

const RESUME_KEY = 'resume_url';

export async function getResumeUrl() {
    const fallback = process.env.NEXT_PUBLIC_RESUME_URL || '';
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) return fallback;

    try {
        const supabase = createClient(url, key);
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', RESUME_KEY)
            .maybeSingle();

        if (error) return fallback;
        return data?.value || fallback;
    } catch {
        return fallback;
    }
}
