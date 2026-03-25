'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '@/lib/utils/slugify';
import styles from '../../admin.module.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const typeFields: Record<string, string[]> = {
    blog: ['category'],
    project: ['category', 'technologies'],
    certificate: ['issuer', 'credential_url'],
};

export default function NewPostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') || 'blog';

    const [form, setForm] = useState({
        title: '',
        slug: '',
        type: initialType,
        excerpt: '',
        content: '',
        category: '',
        technologies: '',
        issuer: '',
        credential_url: '',
        date: new Date().toISOString().split('T')[0],
        published: false,
        cover_image: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Auto-slug from title
    useEffect(() => {
        setForm(prev => ({ ...prev, slug: slugify(prev.title) }));
    }, [form.title]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleContentChange = useCallback((value: string) => {
        setForm(prev => ({ ...prev, content: value }));
    }, []);

    // Upload inline image
    const handleInlineImageUpload = async () => {
        fileInputRef.current?.click();
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setUploading(false);
                return data.url;
            }
            setError(data.error || 'Upload failed');
        } catch {
            setError('Upload failed');
        }
        setUploading(false);
        return null;
    };

    const handleInlineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (url) {
            const markdown = `\n![${file.name}](${url})\n`;
            setForm(prev => ({ ...prev, content: prev.content + markdown }));
        }
        e.target.value = '';
    };

    // Cover image upload
    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (url) {
            setForm(prev => ({ ...prev, cover_image: url }));
        }
        e.target.value = '';
    };

    // Drag & drop for cover
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;

        const url = await uploadFile(file);
        if (url) {
            setForm(prev => ({ ...prev, cover_image: url }));
        }
    };

    // Insert YouTube iframe
    const handleInsertYouTube = () => {
        const url = prompt('Paste YouTube URL:');
        if (!url) return;

        let videoId = '';
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (match) videoId = match[1];

        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        const iframe = `\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameBorder="0" allowFullScreen></iframe>\n`;
        setForm(prev => ({ ...prev, content: prev.content + iframe }));
    };

    const handleSave = async (publish = false) => {
        setSaving(true);
        setError('');
        setSuccess('');

        const payload = {
            ...form,
            published: publish,
            technologies: form.type === 'project'
                ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
                : [],
        };

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to save');
                setSaving(false);
                return;
            }

            setSuccess(publish ? 'Published!' : 'Saved as draft!');
            setTimeout(() => router.push('/admin/posts'), 1000);
        } catch {
            setError('Failed to save');
        }
        setSaving(false);
    };

    const extraFields = typeFields[form.type] || [];

    return (
        <div className={styles.editorPage}>
            <div className={styles.editorHeader}>
                <h1 className={styles.editorTitle}>New Post</h1>
                <div className={styles.editorActions}>
                    <button className={styles.saveBtn} onClick={() => handleSave(false)} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button className={styles.publishBtn} onClick={() => handleSave(true)} disabled={saving}>
                        Publish
                    </button>
                </div>
            </div>

            {success && <p className={styles.successMsg}>{success}</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}

            <form className={styles.editorForm} onSubmit={e => e.preventDefault()}>
                {/* Type */}
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className={styles.editorSelect}>
                        <option value="blog">Blog</option>
                        <option value="project">Project</option>
                        <option value="certificate">Certificate</option>
                    </select>
                </div>

                {/* Title + Slug */}
                <div className={styles.editorRow}>
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Title</label>
                        <input name="title" value={form.title} onChange={handleChange} className={styles.editorInput} placeholder="Post title" required />
                    </div>
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Slug</label>
                        <input name="slug" value={form.slug} onChange={handleChange} className={styles.editorInput} placeholder="auto-generated" />
                    </div>
                </div>

                {/* Date */}
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange} className={styles.editorInput} />
                </div>

                {/* Excerpt */}
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Excerpt</label>
                    <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={styles.editorTextarea} placeholder="Brief description" rows={2} />
                </div>

                {/* Type-specific fields */}
                {extraFields.includes('category') && (
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Category</label>
                        <input name="category" value={form.category} onChange={handleChange} className={styles.editorInput} placeholder="e.g. Web Development" />
                    </div>
                )}

                {extraFields.includes('technologies') && (
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Technologies (comma separated)</label>
                        <input name="technologies" value={form.technologies} onChange={handleChange} className={styles.editorInput} placeholder="React, Next.js, TypeScript" />
                    </div>
                )}

                {extraFields.includes('issuer') && (
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Issuer</label>
                        <input name="issuer" value={form.issuer} onChange={handleChange} className={styles.editorInput} placeholder="e.g. Google, CompTIA" />
                    </div>
                )}

                {extraFields.includes('credential_url') && (
                    <div className={styles.editorFormGroup}>
                        <label className={styles.editorLabel}>Credential URL</label>
                        <input name="credential_url" value={form.credential_url} onChange={handleChange} className={styles.editorInput} placeholder="https://..." />
                    </div>
                )}

                {/* Cover image */}
                <div className={styles.editorFormGroup}>
                    <label className={styles.editorLabel}>Cover Image</label>
                    <div
                        className={styles.imageUploadArea}
                        onClick={() => coverInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                    >
                        <div className={styles.imageUploadIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <p className={styles.imageUploadText}>
                            {uploading ? 'Uploading...' : 'Click or drag & drop to upload cover image'}
                        </p>
                    </div>
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} hidden />
                    {form.cover_image && (
                        <img src={form.cover_image} alt="Cover preview" className={styles.coverPreview} />
                    )}
                </div>

                {/* Content editor with toolbar  */}
                <div className={styles.editorFormGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.editorLabel}>Content (Markdown)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className={styles.tableBtn} onClick={handleInlineImageUpload} disabled={uploading}>
                                📷 Insert Image
                            </button>
                            <button type="button" className={styles.tableBtn} onClick={handleInsertYouTube}>
                                ▶️ YouTube
                            </button>
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
