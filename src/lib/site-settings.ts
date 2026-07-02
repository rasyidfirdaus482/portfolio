import { createClient } from '@supabase/supabase-js';

const RESUME_KEY = 'resume_url';
const ABOUT_KEY = 'about_profile';

type AboutProfile = {
    name: string;
    tagline: string;
    avatarUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    email: string;
    intro1: string;
    intro2: string;
};

const defaultAboutProfile: AboutProfile = {
    name: 'Rasyid Firdaus Harmaini',
    tagline: 'Multidisciplinary Engineer',
    avatarUrl: '/avatar.png',
    githubUrl: 'https://github.com/rasyidfirdaus482',
    linkedinUrl: 'https://linkedin.com/in/rasyidfirdaus',
    email: 'mailto:rasyidfirdaus53@gmail.com',
    intro1: "Hello! I'm Rasyid Firdaus Harmaini, a multidisciplinary engineer who thrives at the intersection of software development, artificial intelligence, and cybersecurity. My journey didn't just stop at building responsive web applications; it evolved into securing the underlying infrastructure and crunching data to train machine learning models.",
    intro2: 'I believe that a truly robust system requires a holistic understanding - from designing intuitive frontends with React to configuring secure Ubuntu servers, and running penetration testing to fortify digital perimeters.',
};

async function getSiteSettingValue(key: string, fallback = '') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const keyValue = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !keyValue) return fallback;

    try {
        const supabase = createClient(url, keyValue);
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', key)
            .maybeSingle();

        if (error) return fallback;
        return data?.value || fallback;
    } catch {
        return fallback;
    }
}

export async function getResumeUrl() {
    return getSiteSettingValue(RESUME_KEY, process.env.NEXT_PUBLIC_RESUME_URL || '');
}

export async function getAboutProfile() {
    const raw = await getSiteSettingValue(ABOUT_KEY, '');

    if (!raw) return defaultAboutProfile;

    try {
        const parsed = JSON.parse(raw) as Partial<AboutProfile>;
        return {
            ...defaultAboutProfile,
            ...parsed,
        };
    } catch {
        return defaultAboutProfile;
    }
}

export { defaultAboutProfile, ABOUT_KEY };
