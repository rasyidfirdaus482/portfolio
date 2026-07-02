import { createClient } from '@/lib/supabase/server';
import { getResumeUrl } from '@/lib/site-settings';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    resumeUrl: z.string().trim().optional().default(''),
});

function isValidResumeUrl(value: string) {
    if (!value) return true;
    if (value.startsWith('/')) return true;

    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

export async function GET() {
    return NextResponse.json({ resumeUrl: await getResumeUrl() });
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

    if (!result.success || !isValidResumeUrl(result.data.resumeUrl)) {
        return NextResponse.json({ error: 'Invalid resume URL' }, { status: 400 });
    }

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key: 'resume_url',
            value: result.data.resumeUrl,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resumeUrl: result.data.resumeUrl });
}
