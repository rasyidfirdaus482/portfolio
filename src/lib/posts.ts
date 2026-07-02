import { getAllPosts as getMdxPosts, ContentType } from './mdx';
import { createClient } from '@supabase/supabase-js';
import { toSupabasePostType } from './hybrid';

function getSupabasePublicClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

function estimateReadingTime(content?: string | null) {
    return `${Math.ceil((content?.split(' ').length || 0) / 200)} min read`;
}

export async function getAllPostsWithSupabase(type: ContentType) {
    // 1. Get local MDX posts
    const mdxPosts = getMdxPosts(type);
    const supabaseType = toSupabasePostType(type);

    // 2. Format MDX posts to match unified shape
    const formattedMdxPosts = mdxPosts.map(post => ({
        slug: post.slug,
        title: post.meta.title || post.slug,
        excerpt: post.meta.excerpt || '',
        content: post.content,
        date: post.meta.date,
        readingTime: post.meta.readingTime,
        category: post.meta.category,
        technologies: post.meta.technologies,
        issuer: post.meta.issuer,
        credential_url: post.meta.credentialUrl,
        github: post.meta.github,
        demo: post.meta.demo,
        type: supabaseType,
        source: 'mdx'
    }));

    try {
        // 3. Get Supabase posts
        const supabase = getSupabasePublicClient();
        if (!supabase) return formattedMdxPosts;

        const { data: dbPosts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('type', supabaseType)
            .eq('published', true)
            .order('date', { ascending: false });

        if (error) {
            return formattedMdxPosts;
        }

        // 4. Format DB posts
        const mdxSlugs = new Set(formattedMdxPosts.map(post => post.slug));
        const formattedDbPosts = (dbPosts || [])
            .filter(post => !mdxSlugs.has(post.slug))
            .map(post => ({
                ...post,
                readingTime: estimateReadingTime(post.content),
                source: 'db'
            }));

        // 5. Merge and sort
        const allPosts = [...formattedMdxPosts, ...formattedDbPosts].sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
        });

        return allPosts;

    } catch {
        return formattedMdxPosts;
    }
}

export async function getPostWithSupabase(type: ContentType, slug: string) {
    const supabaseType = toSupabasePostType(type);

    // 1. Try Local MDX first
    let mdxPost = null;
    try {
        mdxPost = getMdxPosts(type).find(p => p.slug === slug);
    } catch {
        // Ignored
    }

    if (mdxPost) {
        return {
            slug: mdxPost.slug,
            title: mdxPost.meta.title || mdxPost.slug,
            excerpt: mdxPost.meta.excerpt || '',
            content: mdxPost.content,
            date: mdxPost.meta.date,
            readingTime: mdxPost.meta.readingTime,
            category: mdxPost.meta.category,
            technologies: mdxPost.meta.technologies,
            issuer: mdxPost.meta.issuer,
            credential_url: mdxPost.meta.credentialUrl,
            github: mdxPost.meta.github,
            demo: mdxPost.meta.demo,
            type: supabaseType,
            source: 'mdx'
        };
    }

    // 2. Try Supabase
    try {
        const supabase = getSupabasePublicClient();
        if (!supabase) return null;

        const { data: dbPost, error } = await supabase
            .from('posts')
            .select('*')
            .eq('type', supabaseType)
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error || !dbPost) {
            return null;
        }

        return {
            ...dbPost,
            readingTime: estimateReadingTime(dbPost.content),
            source: 'db'
        };

    } catch {
        return null;
    }
}
