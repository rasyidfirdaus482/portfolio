import React from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase/server';
import { PostRow } from '@/types/post';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: dbPosts } = await supabase.from('posts').select('*');
    const posts: PostRow[] = dbPosts || [];

    const blogCount = posts.filter(p => p.type === 'blog').length;
    const projectCount = posts.filter(p => p.type === 'project').length;
    const certCount = posts.filter(p => p.type === 'certificate').length;
    const draftCount = posts.filter(p => !p.published).length;

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
            </div>
        </div>
    );
}
