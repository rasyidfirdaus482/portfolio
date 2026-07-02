'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../admin.module.css';

export function ResumeSettings() {
    const [resumeUrl, setResumeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/settings/resume')
            .then(res => res.json())
            .then(data => setResumeUrl(data.resumeUrl || ''))
            .catch(() => setError('Failed to load resume setting'))
            .finally(() => setLoading(false));
    }, []);

    const saveResumeUrl = async (nextUrl = resumeUrl) => {
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/settings/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeUrl: nextUrl }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save resume URL');
                return;
            }

            setResumeUrl(data.resumeUrl || '');
            setMessage('Resume URL saved.');
        } catch {
            setError('Failed to save resume URL');
        } finally {
            setSaving(false);
        }
    };

    const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                setError(data.error || 'Failed to upload resume');
                return;
            }

            await saveResumeUrl(data.url);
        } catch {
            setError('Failed to upload resume');
        } finally {
            setSaving(false);
            event.target.value = '';
        }
    };

    return (
        <section className={styles.settingsCard}>
            <div>
                <h2 className={styles.settingsTitle}>Resume</h2>
                <p className={styles.settingsDescription}>
                    Upload a PDF resume or paste an external URL. This controls the public Resume button.
                </p>
            </div>

            <div className={styles.resumeControls}>
                <input
                    value={resumeUrl}
                    onChange={(event) => setResumeUrl(event.target.value)}
                    className={styles.editorInput}
                    placeholder="https://... or /resume.pdf"
                    disabled={loading || saving}
                />
                <div className={styles.resumeActions}>
                    <button className={styles.saveBtn} onClick={() => saveResumeUrl()} disabled={loading || saving}>
                        {saving ? 'Saving...' : 'Save URL'}
                    </button>
                    <button className={styles.tableBtn} onClick={() => fileInputRef.current?.click()} disabled={loading || saving}>
                        Upload PDF
                    </button>
                    {resumeUrl && (
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.tableBtn}>
                            Open
                        </a>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={uploadResume} hidden />
                {message && <p className={styles.successMsg}>{message}</p>}
                {error && <p className={styles.errorMsg}>{error}</p>}
            </div>
        </section>
    );
}
