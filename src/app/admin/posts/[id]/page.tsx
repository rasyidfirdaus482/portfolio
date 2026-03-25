'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '@/lib/utils/slugify';
import styles from '../../admin.module.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [form, setForm] = useState({
        title: '',
        slug: '',
        type: 'blog',
        excerpt: '',
        content: '',
        category: '',
        technologies: '',
        issuer: '',
        credential_url: '',
        date: '',
        published: false,
        cover_image: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Load post
    useEffect(() => {

        fetch(`/api/posts/${postId}`)
            .then(res => res.json())
            .then(data => {
                setForm({
                    title: data.title || '',
                    slug: data.slug || '',
                    type: data.type || 'blog',
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    category: data.category || '',
                    technologies: Array.isArray(data.technologies) ? data.technologies.join(', ') : '',
                    issuer: data.issuer || '',
                    credential_url: data.credential_url || '',
                    date: data.date || '',
                    published: data.published || false,
                    cover_image: data.cover_image || '',
                });
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load post');
                setLoading(false);
            });
    }, [postId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleContentChange = useCallback((value: string) => {
        setForm(prev => ({ ...prev, content: value }));
    }, []);

    const uploadFile = async (file: File): Promise<string | null> => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) { setUploading(false); return data.url; }
            setError(data.error || 'Upload failed');
        } catch { setError('Upload failed'); }
        setUploading(false);
        return null;
    };

    const handleInlineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setForm(prev => ({ ...prev, content: prev.content + `\n![${file.name}](${url})\n` }));
        e.target.value = '';
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setForm(prev => ({ ...prev, cover_image: url }));
        e.target.value = '';
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const url = await uploadFile(file);
        if (url) setForm(prev => ({ ...prev, cover_image: url }));
    };

    const handleInsertYouTube = () => {
        const url = prompt('Paste YouTube URL:');
        if (!url) return;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (!match) { setError('Invalid YouTube URL'); return; }
        const iframe = `\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/${match[1]}" frameBorder="0" allowFullScreen></iframe>\n`;
        setForm(prev => ({ ...prev, content: prev.content + iframe }));
    };

    const handleSave = async (publish?: boolean) => {
        setSaving(true);
        setError('');
        setSuccess('');

        const payload = {
            ...form,
            published: publish !== undefined ? publish : form.published,
            technologies: form.type === 'project'
                ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
                : [],
        };

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
            setSuccess('Saved!');
            setTimeout(() => setSuccess(''), 3000);
        } catch { setError('Failed to save'); }
        setSaving(false);
    };

    if (loading) return <p className={styles.emptyState}>Loading...</p>;

    return (
        <div className={styles.editorPage}>
            <div className={styles.editorHeader}>
                <h1 className={styles.editorTitle}>Edit Post</h1>
                <div className={styles.editorActions}>
                    <button className={styles.saveBtn} onClick={() => handleSave()} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className={styles.publishBtn} onClick={() => handleSave(!form.published)} disabled={saving}>
                        {form.published ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>

            {success && <p className={styles.successMsg}>{success}</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}

            <form className={styles.editorForm} onSubmit={e => e.preventDefault()}>
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className={styles.editorSelect}>
                        <option value="blog">Blog</option>
                        <option value="project">Project</option>
                        <option value="certificate">Certificate</option>
                    </select>
                </div>

                <div className={styles.editorRow}>
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Title</label>
                        <input name="title" value={form.title} onChange={handleChange} className={styles.editorInput} />
                    </div>
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Slug</label>
                        <input name="slug" value={form.slug} onChange={handleChange} className={styles.editorInput} />
                    </div>
                </div>

                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} className={styles.editorInput} />
                </div>

                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Excerpt</label>
                    <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={styles.editorTextarea} rows={2} />
                </div>

                {form.type === 'blog' && (
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Category</label>
                        <input name="category" value={form.category} onChange={handleChange} className={styles.editorInput} />
                    </div>
                )}
                {form.type === 'project' && (
                    <>
                        <div className={styles.editorFormGroup}>
                            <label className={styles.editorLabel}>Category</label>
                            <input name="category" value={form.category} onChange={handleChange} className={styles.editorInput} />
                        </div>
                        <div className={styles.editorFormGroup}>
                            <label className={styles.editorLabel}>Technologies (comma separated)</label>
                            <input name="technologies" value={form.technologies} onChange={handleChange} className={styles.editorInput} />
                        </div>
                    </>
                )}
                {form.type === 'certificate' && (
                    <>
                        <div className={styles.editorFormGroup}>
                            <label className={styles.editorLabel}>Issuer</label>
                            <input name="issuer" value={form.issuer} onChange={handleChange} className={styles.editorInput} />
                        </div>
                        <div className={styles.editorFormGroup}>
                            <label className={styles.editorLabel}>Credential URL</label>
                            <input name="credential_url" value={form.credential_url} onChange={handleChange} className={styles.editorInput} />
                        </div>
                    </>
                )}

                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Cover Image</label>
                    <div className={styles.imageUploadArea} onClick={() => coverInputRef.current?.click()} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
                        <p className={styles.imageUploadText}>{uploading ? 'Uploading...' : 'Click or drag & drop'}</p>
                    </div>
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} hidden />
                    {form.cover_image && <img src={form.cover_image} alt="Cover" className={styles.coverPreview} />}
                </div>

                <div className={styles.editorFormGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.editorLabel}>Content (Markdown)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className={styles.tableBtn} onClick={() => fileInputRef.current?.click()} disabled={uploading}>📷 Insert Image</button>
                            <button type="button" className={styles.tableBtn} onClick={handleInsertYouTube}>▶️ YouTube</button>
                        </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInlineFileChange} hidden />
                    <div className={styles.editorMarkdown}>
                        <SimpleMDE value={form.content} onChange={handleContentChange} />
                    </div>
                </div>

                {/* Live Preview */}
                {form.content && (
                    <div className={styles.previewContainer}>
                        <h3 className={styles.previewTitle}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            Live Preview
                        </h3>
                        <div className={styles.previewContent}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {form.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
