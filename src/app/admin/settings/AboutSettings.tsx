'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../admin.module.css';

type AboutProfile = {
    name: string;
    tagline: string;
    avatarUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    email: string;
    intro1: string;
    intro2: string;
};

const defaultAbout: AboutProfile = {
    name: 'Rasyid Firdaus Harmaini',
    tagline: 'Multidisciplinary Engineer',
    avatarUrl: '/avatar.png',
    githubUrl: 'https://github.com/rasyidfirdaus482',
    linkedinUrl: 'https://linkedin.com/in/rasyidfirdaus',
    email: 'mailto:rasyidfirdaus53@gmail.com',
    intro1: '',
    intro2: '',
};

export function AboutSettings() {
    const [form, setForm] = useState<AboutProfile>(defaultAbout);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/settings/about')
            .then(res => res.json())
            .then(data => setForm((prev) => ({ ...prev, ...(data.about || {}) })))
            .catch(() => setError('Failed to load about settings'))
            .finally(() => setLoading(false));
    }, []);

    const saveAbout = async (nextForm = form) => {
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/settings/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nextForm),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save about settings');
                return;
            }

            setForm((prev) => ({ ...prev, ...(data.about || {}) }));
            setMessage('About profile saved.');
        } catch {
            setError('Failed to save about settings');
        } finally {
            setSaving(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSaving(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (!res.ok || !data.url) {
                setError(data.error || 'Failed to upload avatar');
                return;
            }

            const nextForm = { ...form, avatarUrl: data.url };
            setForm(nextForm);
            await saveAbout(nextForm);
        } catch {
            setError('Failed to upload avatar');
        } finally {
            setSaving(false);
            event.target.value = '';
        }
    };

    return (
        <section className={styles.settingsCard}>
            <div>
                <h2 className={styles.settingsTitle}>About</h2>
                <p className={styles.settingsDescription}>
                    Edit the public About profile, including avatar, intro text, and social links.
                </p>
            </div>

            <div className={styles.aboutGrid}>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Name</label>
                    <input className={styles.editorInput} value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Tagline</label>
                    <input className={styles.editorInput} value={form.tagline} onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Avatar URL</label>
                    <input className={styles.editorInput} value={form.avatarUrl} onChange={(e) => setForm(prev => ({ ...prev, avatarUrl: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Avatar Upload</label>
                    <div className={styles.resumeActions}>
                        <button className={styles.tableBtn} onClick={() => fileInputRef.current?.click()} disabled={loading || saving}>
                            Upload Image
                        </button>
                        {form.avatarUrl && (
                            <a href={form.avatarUrl} target="_blank" rel="noopener noreferrer" className={styles.tableBtn}>
                                Open
                            </a>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadAvatar} hidden />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>GitHub URL</label>
                    <input className={styles.editorInput} value={form.githubUrl} onChange={(e) => setForm(prev => ({ ...prev, githubUrl: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>LinkedIn URL</label>
                    <input className={styles.editorInput} value={form.linkedinUrl} onChange={(e) => setForm(prev => ({ ...prev, linkedinUrl: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Email URL</label>
                    <input className={styles.editorInput} value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Intro Paragraph 1</label>
                    <textarea className={styles.editorTextarea} rows={4} value={form.intro1} onChange={(e) => setForm(prev => ({ ...prev, intro1: e.target.value }))} disabled={loading || saving} />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Intro Paragraph 2</label>
                    <textarea className={styles.editorTextarea} rows={4} value={form.intro2} onChange={(e) => setForm(prev => ({ ...prev, intro2: e.target.value }))} disabled={loading || saving} />
                </div>
            </div>

            <div className={styles.resumeActions}>
                <button className={styles.saveBtn} onClick={() => saveAbout()} disabled={loading || saving}>
                    {saving ? 'Saving...' : 'Save About'}
                </button>
            </div>

            {message && <p className={styles.successMsg}>{message}</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}
        </section>
    );
}
