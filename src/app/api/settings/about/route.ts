import { createClient } from '@/lib/supabase/server';
import { ABOUT_KEY, defaultAboutProfile, getAboutProfile } from '@/lib/site-settings';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    name: z.string().trim().min(1),
    tagline: z.string().trim().min(1),
    avatarUrl: z.string().trim().optional().default(''),
    githubUrl: z.string().trim().optional().default(''),
    linkedinUrl: z.string().trim().optional().default(''),
    email: z.string().trim().optional().default(''),
    intro1: z.string().trim().min(1),
    intro2: z.string().trim().min(1),
    softwareSkills: z.array(z.string().trim().min(1)).default([]),
    dataSkills: z.array(z.string().trim().min(1)).default([]),
    securitySkills: z.array(z.string().trim().min(1)).default([]),
    experiences: z.array(z.object({
        label: z.string().trim().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
    })).default([]),
});

function isValidEditableUrl(value: string) {
    if (!value) return true;
    if (value.startsWith('/')) return true;

    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:';
    } catch {
        return false;
    }
}

export async function GET() {
    return NextResponse.json({ about: await getAboutProfile() });
}

export async function PUT(request: Request) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
        return NextResponse.json({ error: 'Invalid about profile' }, { status: 400 });
    }

    const about = result.data;
    if (
        !isValidEditableUrl(about.avatarUrl) ||
        !isValidEditableUrl(about.githubUrl) ||
        !isValidEditableUrl(about.linkedinUrl) ||
        !isValidEditableUrl(about.email)
    ) {
        return NextResponse.json({ error: 'Invalid URL in about profile' }, { status: 400 });
    }

    const payload = JSON.stringify({
        ...defaultAboutProfile,
        ...about,
    });

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key: ABOUT_KEY,
            value: payload,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ about: JSON.parse(payload) });
}
