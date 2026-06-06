'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import styles from './admin.module.css';
import 'easymde/dist/easymde.min.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
    const redirectingRef = useRef(false);

    useEffect(() => {
        let cancelled = false;
        let authSubscription: { unsubscribe: () => void } | null = null;

        const initAuth = async () => {
            const supabase = createClient();
            supabaseRef.current = supabase;

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (!cancelled) {
                    setUser(session?.user ?? null);
                }
            });
            authSubscription = subscription;

            const { data: { user } } = await supabase.auth.getUser();
            if (!cancelled) {
                setUser(user);
                setLoading(false);
            }
        };

        initAuth().catch(() => {
            if (!cancelled) {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
            authSubscription?.unsubscribe();
        };
    }, []);

    // Redirect to login if not authenticated (only for non-login pages)
    useEffect(() => {
        if (user) {
            redirectingRef.current = false;
        }

        if (!loading && !user && !redirectingRef.current && pathname !== '/admin/login') {
            redirectingRef.current = true;
            router.replace('/admin/login');
        }
    }, [loading, user, router, pathname]);

    // Login page renders without sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return <div className={styles.loading}>Redirecting...</div>;
    }

    const handleLogout = async () => {
        await supabaseRef.current?.auth.signOut();
        setUser(null);
        router.replace('/admin/login');
    };

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <Link href="/admin/dashboard" className={styles.sidebarLogo}>
                    rasyid<span>.admin</span>
                </Link>

                <nav className={styles.sidebarNav}>
                    <Link
                        href="/admin/dashboard"
                        className={`${styles.sidebarLink} ${pathname === '/admin/dashboard' ? styles.sidebarActive : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/posts"
                        className={`${styles.sidebarLink} ${pathname?.startsWith('/admin/posts') ? styles.sidebarActive : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
                        Posts
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.sidebarLink} target="_blank">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                        View Site
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
