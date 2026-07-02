import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        return NextResponse.json({ error: 'Contact storage is not configured' }, { status: 500 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ error: 'Please fill every field correctly.' }, { status: 400 });
    }

    const supabase = createClient(url, key);
    const { error } = await supabase
        .from('contact_messages')
        .insert({
            name: result.data.name,
            email: result.data.email,
            message: result.data.message,
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
}
