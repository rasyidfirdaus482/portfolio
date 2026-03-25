'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import { PostRow } from '@/types/post';

const typeStyles: Record<string, string> = {
    blog: styles.typeBlog,
    project: styles.typeProject,
    certificate: styles.typeCertificate,
};

export function PostsClient({ initialPosts }: { initialPosts: PostRow[] }) {
    const [posts, setPosts] = useState<PostRow[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const router = useRouter();

    const fetchPosts = async (currentFilter: string) => {
        setLoading(true);
        const url = currentFilter === 'all' ? '/api/posts' : `/api/posts?type=${currentFilter}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            // Error handling ignored for brevity
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (f: string) => {
        setFilter(f);
        fetchPosts(f);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setLoading(true);
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        await fetchPosts(filter);
    };

    const handleTogglePublish = async (post: PostRow) => {
        setLoading(true);
        await fetch(`/api/posts/${post.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: !post.published }),
        });
        await fetchPosts(filter);
    };

    return (
        <div>
            <div className={styles.postsHeader}>
                <h1 className={styles.postsTitle}>All Posts</h1>
                <Link href="/admin/posts/new" className={styles.actionBtn}>
                    + New Post
                </Link>
            </div>

            <div className={styles.filters}>
                {['all', 'blog', 'project', 'certificate'].map(f => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                        onClick={() => handleFilterChange(f)}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className={styles.emptyState}>Updating...</p>
            ) : posts.length === 0 ? (
                <p className={styles.emptyState}>No posts found. Create your first one!</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td><strong>{post.title}</strong></td>
                                <td>
                                    <span className={`${styles.typeBadge} ${typeStyles[post.type] || ''}`}>
                                        {post.type}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.statusDot} ${post.published ? styles.statusPublished : styles.statusDraft}`} />
                                    {post.published ? 'Published' : 'Draft'}
                                </td>
                                <td>{post.date}</td>
                                <td>
                                    <div className={styles.tableActions}>
                                        <button
                                            className={styles.tableBtn}
                                            onClick={() => router.push(`/admin/posts/${post.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.tableBtn}
                                            onClick={() => handleTogglePublish(post)}
                                        >
                                            {post.published ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <button
                                            className={`${styles.tableBtn} ${styles.tableBtnDanger}`}
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
