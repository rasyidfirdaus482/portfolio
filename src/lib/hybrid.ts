import { createClient } from '@supabase/supabase-js';
import { getAllPosts as getMdxPosts, ContentType } from './mdx';

// Server-side Supabase client (not user-authenticated, just reads public data)
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

interface HybridPost {
    slug: string;
    meta: Record<string, any>;
    content: string;
    source: 'mdx' | 'supabase';
}

/**
 * Fetch posts from both MDX files and Supabase, merged and deduplicated by slug.
 * MDX posts take priority (existing content is preserved).
 */
export async function getHybridPosts(type: ContentType): Promise<HybridPost[]> {
    // 1. MDX posts (always available, even without Supabase)
    const mdxPosts: HybridPost[] = getMdxPosts(type).map(p => ({
        slug: p.slug,
        meta: p.meta,
        content: p.content,
        source: 'mdx' as const,
    }));

    // 2. Supabase posts
    let supabasePosts: HybridPost[] = [];
    const supabase = getSupabaseAdmin();

    if (supabase) {
        try {
            const supabaseType = type === 'projects' ? 'project' : type === 'certificates' ? 'certificate' : type;
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('type', supabaseType)
                .eq('published', true)
                .order('date', { ascending: false });

            if (data) {
                supabasePosts = data.map(post => ({
                    slug: post.slug,
                    meta: {
                        title: post.title,
                        excerpt: post.excerpt,
                        date: post.date,
                        category: post.category,
                        technologies: post.technologies,
                        issuer: post.issuer,
                        credentialUrl: post.credential_url,
                        cover_image: post.cover_image,
                    },
                    content: post.content,
                    source: 'supabase' as const,
                }));
            }
        } catch {
            // Supabase not configured yet — silently continue with MDX-only
        }
    }

    // 3. Merge: MDX takes priority, Supabase fills the rest
    const slugSet = new Set(mdxPosts.map(p => p.slug));
    const uniqueSupabase = supabasePosts.filter(p => !slugSet.has(p.slug));
    const merged = [...mdxPosts, ...uniqueSupabase];

    // Sort by date descending
    merged.sort((a, b) => {
        const dateA = new Date(a.meta.date || 0);
        const dateB = new Date(b.meta.date || 0);
        return dateB.getTime() - dateA.getTime();
    });

    return merged;
}
