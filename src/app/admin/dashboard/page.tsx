import React from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase/server';
import { PostRow } from '@/types/post';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: dbPosts } = await supabase.from('posts').select('*');
    const posts: PostRow[] = dbPosts || [];
    const { data: messages } = await supabase
        .from('contact_messages')
        .select('id,name,email,message,created_at,read')
        .order('created_at', { ascending: false })
        .limit(5);

    const blogCount = posts.filter(p => p.type === 'blog').length;
    const projectCount = posts.filter(p => p.type === 'project').length;
    const certCount = posts.filter(p => p.type === 'certificate').length;
    const draftCount = posts.filter(p => !p.published).length;
    const recentPosts = [...posts].sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()).slice(0, 5);
    const unreadCount = (messages || []).filter(message => !message.read).length;

    return (
        <div>
            <div className={styles.dashboardHeader}>
                <h1 className={styles.dashboardTitle}>Dashboard</h1>
                <p className={styles.dashboardSubtitle}>
                    Overview of your content
                </p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <p className={styles.statLabel}>Blog Posts</p>
                    <p className={styles.statValue}>{blogCount}</p>
                </div>
                <div className={styles.statCard}>
                    <p className={styles.statLabel}>Projects</p>
                    <p className={styles.statValue}>{projectCount}</p>
                </div>
                <div className={styles.statCard}>
                    <p className={styles.statLabel}>Certificates</p>
                    <p className={styles.statValue}>{certCount}</p>
                </div>
                <div className={styles.statCard}>
                    <p className={styles.statLabel}>Drafts</p>
                    <p className={styles.statValue}>{draftCount}</p>
                </div>
                <div className={styles.statCard}>
                    <p className={styles.statLabel}>Unread Messages</p>
                    <p className={styles.statValue}>{unreadCount}</p>
                </div>
            </div>

            <div className={styles.quickActions}>
                <Link href="/admin/posts/new?type=blog" className={styles.actionBtn}>
                    + New Blog Post
                </Link>
                <Link href="/admin/posts/new?type=project" className={styles.actionBtn}>
                    + New Project
                </Link>
                <Link href="/admin/posts/new?type=certificate" className={styles.actionBtn}>
                    + New Certificate
                </Link>
                <Link href="/admin/settings" className={styles.actionBtn}>
                    Settings
                </Link>
            </div>

            <div className={styles.dashboardGrid}>
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Recent Content</h2>
                        <Link href="/admin/posts" className={styles.panelLink}>Manage</Link>
                    </div>
                    {recentPosts.length > 0 ? (
                        <div className={styles.compactList}>
                            {recentPosts.map(post => (
                                <Link key={post.id} href={`/admin/posts/${post.id}`} className={styles.compactItem}>
                                    <span>
                                        <strong>{post.title}</strong>
                                        <small>{post.type} - {post.published ? 'Published' : 'Draft'}</small>
                                    </span>
                                    <small>{post.date}</small>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No content yet.</p>
                    )}
                </section>

                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2>Recent Messages</h2>
                    </div>
                    {(messages || []).length > 0 ? (
                        <div className={styles.compactList}>
                            {(messages || []).map(message => (
                                <div key={message.id} className={styles.compactItem}>
                                    <span>
                                        <strong>{message.name}</strong>
                                        <small>{message.email}</small>
                                        <small>{message.message}</small>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No messages yet.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
