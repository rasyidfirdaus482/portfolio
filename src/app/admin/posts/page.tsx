import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { PostsClient } from './PostsClient';
import { PostRow } from '@/types/post';

export default async function PostListPage() {
    const supabase = await createClient();
    
    // Fetch initial list of all posts to prevent client waterfall
    const { data: dbPosts } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });
        
    const posts: PostRow[] = dbPosts || [];

    return <PostsClient initialPosts={posts} />;
}
