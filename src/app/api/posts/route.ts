import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for post validation
const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
    type: z.enum(['blog', 'project', 'certificate']),
    excerpt: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    technologies: z.array(z.string()).optional().nullable(),
    issuer: z.string().optional().nullable(),
    credential_url: z.string().url().optional().or(z.literal('')).nullable(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional().nullable(),
    published: z.boolean().optional().nullable(),
    cover_image: z.string().url().optional().or(z.literal('')).nullable(),
});

// GET /api/posts — List all posts, optional ?type=blog|project|certificate
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const published = searchParams.get('published');

    const supabase = await createClient();

    let query = supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });

    if (type) {
        query = query.eq('type', type);
    }

    if (published !== null) {
        query = query.eq('published', published === 'true');
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST /api/posts — Create a new post
export async function POST(request: Request) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Zod validation
    const result = postSchema.safeParse(body);
    if (!result.success) {
        const errors = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return NextResponse.json({ error: `Validation failed - ${errors}` }, { status: 400 });
    }

    const validData = result.data;

    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: validData.title,
            slug: validData.slug,
            type: validData.type,
            excerpt: validData.excerpt || '',
            content: validData.content || '',
            category: validData.category || null,
            technologies: validData.technologies || [],
            issuer: validData.issuer || null,
            credential_url: validData.credential_url || null,
            date: validData.date || new Date().toISOString().split('T')[0],
            published: validData.published ?? false,
            cover_image: validData.cover_image || null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
