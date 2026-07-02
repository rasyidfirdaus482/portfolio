'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from '../admin.module.css';

export default function LoginPage() {
    const isSupabaseConfigured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured) {
            setError('Supabase is not configured. Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
            return;
        }

        setLoading(true);
        setError('');

        let authError: Error | null = null;
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            authError = error;
        } catch {
            authError = new Error('Supabase is not configured.');
        }

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard');
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <h1 className={styles.loginLogo}>
                    rasyid<span>.admin</span>
                </h1>
                <p className={styles.loginSubtitle}>Sign in to manage your content</p>

                <form onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.formInput}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.formInput}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={loading || !isSupabaseConfigured}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {!isSupabaseConfigured && (
                        <p className={styles.loginError}>
                            Supabase is not configured. Fill .env.local to enable admin login.
                        </p>
                    )}
                    {error && <p className={styles.loginError}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
