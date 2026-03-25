'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '../Card/Card';
import { FadeIn } from '../FadeIn/FadeIn';
import { Post } from '@/types/post';
import styles from './BlogList.module.css';

export const BlogList = ({ initialPosts }: { initialPosts: Post[] }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return initialPosts;
        const query = searchQuery.toLowerCase();
        return initialPosts.filter(post =>
            post.title?.toLowerCase().includes(query) ||
            post.excerpt?.toLowerCase().includes(query)
        );
    }, [initialPosts, searchQuery]);

    return (
        <div>
            <FadeIn delay={0.2}>
                <div className={styles.searchContainer}>
                    <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchQuery && (
                        <button className={styles.clearBtn} onClick={() => setSearchQuery('')} aria-label="Clear search">
                            ✕
                        </button>
                    )}
                </div>
            </FadeIn>

            <div className={styles.grid}>
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post: Post, index: number) => (
                        <FadeIn key={post.slug} delay={index * 0.1}>
                            <Link href={`/blog/${post.slug}`} className={styles.link}>
                                <Card className={styles.card}>
                                    {post.cover_image && (
                                        <img src={post.cover_image} alt={post.title} className={styles.cardCover} />
                                    )}
                                    <div className={styles.cardBody}>
                                        <h2 className={styles.postTitle}>{post.title}</h2>
                                        <div className={styles.metaInfo}>
                                            <p className={styles.date}>{post.date}</p>
                                            <span>•</span>
                                            <p className={styles.readingTime}>{post.readingTime}</p>
                                        </div>
                                        <p className={styles.excerpt}>{post.excerpt}</p>
                                    </div>
                                </Card>
                            </Link>
                        </FadeIn>
                    ))
                ) : (
                    <FadeIn>
                        <div className={styles.emptyState}>
                            No articles found matching &quot;{searchQuery}&quot;
                        </div>
                    </FadeIn>
                )}
            </div>

            {filteredPosts.length > 0 && (
                <p className={styles.resultCount}>
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </p>
            )}
        </div>
    );
};
