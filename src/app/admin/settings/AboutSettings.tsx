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
    softwareSkills: string[];
    dataSkills: string[];
    securitySkills: string[];
    experiences: Array<{
        label: string;
        title: string;
        description: string;
    }>;
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
    softwareSkills: [],
    dataSkills: [],
    securitySkills: [],
    experiences: [],
};

function parseCsv(value: string) {
    return value.split(',').map(item => item.trim()).filter(Boolean);
}

function formatCsv(value: string[]) {
    return value.join(', ');
}

function parseExperiences(value: string) {
    return value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const [label = '', title = '', description = ''] = line.split('|').map(part => part.trim());
            return { label, title, description };
        })
        .filter(item => item.label && item.title && item.description);
}

function formatExperiences(value: AboutProfile['experiences']) {
    return value.map(item => `${item.label} | ${item.title} | ${item.description}`).join('\n');
}

export function AboutSettings() {
    const [form, setForm] = useState<AboutProfile>(defaultAbout);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [softwareSkillsInput, setSoftwareSkillsInput] = useState('');
    const [dataSkillsInput, setDataSkillsInput] = useState('');
    const [securitySkillsInput, setSecuritySkillsInput] = useState('');
    const [experiencesInput, setExperiencesInput] = useState('');

    useEffect(() => {
        fetch('/api/settings/about')
            .then(res => res.json())
            .then(data => {
                const about = { ...defaultAbout, ...(data.about || {}) };
                setForm(about);
                setSoftwareSkillsInput(formatCsv(about.softwareSkills));
                setDataSkillsInput(formatCsv(about.dataSkills));
                setSecuritySkillsInput(formatCsv(about.securitySkills));
                setExperiencesInput(formatExperiences(about.experiences));
            })
            .catch(() => setError('Failed to load about settings'))
            .finally(() => setLoading(false));
    }, []);

    const saveAbout = async (nextForm = form) => {
        setSaving(true);
        setMessage('');
        setError('');
        const payload = {
            ...nextForm,
            softwareSkills: parseCsv(softwareSkillsInput),
            dataSkills: parseCsv(dataSkillsInput),
            securitySkills: parseCsv(securitySkillsInput),
            experiences: parseExperiences(experiencesInput),
        };

        try {
            const res = await fetch('/api/settings/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Software Skills</label>
                    <textarea className={styles.editorTextarea} rows={3} value={softwareSkillsInput} onChange={(e) => setSoftwareSkillsInput(e.target.value)} disabled={loading || saving} placeholder="JavaScript, TypeScript, React" />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Data Skills</label>
                    <textarea className={styles.editorTextarea} rows={3} value={dataSkillsInput} onChange={(e) => setDataSkillsInput(e.target.value)} disabled={loading || saving} placeholder="Python, Machine Learning, Pandas" />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Infrastructure & Security Skills</label>
                    <textarea className={styles.editorTextarea} rows={3} value={securitySkillsInput} onChange={(e) => setSecuritySkillsInput(e.target.value)} disabled={loading || saving} placeholder="Ubuntu Server, Networking, Security Audit" />
                </div>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Experience</label>
                    <textarea className={styles.editorTextarea} rows={6} value={experiencesInput} onChange={(e) => setExperiencesInput(e.target.value)} disabled={loading || saving} placeholder="Current | Portfolio, Web Apps, and Content Systems | Building Next.js applications..." />
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
