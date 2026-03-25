import { getAllPosts as getMdxPosts, ContentType } from './mdx';
import { createClient } from '@supabase/supabase-js';

export async function getAllPostsWithSupabase(type: ContentType) {
    // 1. Get local MDX posts
    const mdxPosts = getMdxPosts(type);

    // 2. Format MDX posts to match unified shape
    const formattedMdxPosts = mdxPosts.map(post => ({
        slug: post.slug,
        title: post.meta.title,
        excerpt: post.meta.excerpt,
        content: post.content,
        date: post.meta.date,
        readingTime: post.meta.readingTime,
        category: post.meta.category,
        technologies: post.meta.technologies,
        issuer: post.meta.issuer,
        credential_url: post.meta.credentialUrl,
        type: type,
        source: 'mdx'
    }));

    try {
        // 3. Get Supabase posts
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: dbPosts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('type', type)
            .eq('published', true)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching Supabase posts:', error);
            return formattedMdxPosts;
        }

        // 4. Format DB posts
        const formattedDbPosts = (dbPosts || []).map(post => ({
            ...post,
            readingTime: `${Math.ceil((post.content?.split(' ').length || 0) / 200)} min read`, // rough estimate
            source: 'db'
        }));

        // 5. Merge and sort
        const allPosts = [...formattedMdxPosts, ...formattedDbPosts].sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
        });

        return allPosts;

    } catch (err) {
        console.error('Failed to fetch from Supabase:', err);
        return formattedMdxPosts;
    }
}

export async function getPostWithSupabase(type: ContentType, slug: string) {
    // 1. Try Local MDX first
    let mdxPost = null;
    try {
        mdxPost = getMdxPosts(type).find(p => p.slug === slug);
    } catch (e) {
        // Ignored
    }

    if (mdxPost) {
        return {
            slug: mdxPost.slug,
            title: mdxPost.meta.title,
            excerpt: mdxPost.meta.excerpt,
            content: mdxPost.content,
            date: mdxPost.meta.date,
            readingTime: mdxPost.meta.readingTime,
            category: mdxPost.meta.category,
            technologies: mdxPost.meta.technologies,
            issuer: mdxPost.meta.issuer,
            credential_url: mdxPost.meta.credentialUrl,
            github: mdxPost.meta.github,
            demo: mdxPost.meta.demo,
            type: type,
            source: 'mdx'
        } as Record<string, any>;
    }

    // 2. Try Supabase
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: dbPost, error } = await supabase
            .from('posts')
            .select('*')
            .eq('type', type)
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error || !dbPost) {
            return null;
        }

        return {
            ...dbPost,
            readingTime: `${Math.ceil((dbPost.content?.split(' ').length || 0) / 200)} min read`,
            source: 'db'
        };

    } catch (err) {
        return null;
    }
}
