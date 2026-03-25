import { getPostSlugs } from "@/lib/mdx";
import { getPostWithSupabase } from "@/lib/posts";
import { Container } from "@/components/layout/Container/Container";
import { MDXRenderer } from "@/components/ui/MDXRenderer/MDXRenderer";
import { TableOfContents } from "@/components/ui/TableOfContents/TableOfContents";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ShareButton } from "@/components/ui/ShareButton/ShareButton";
import { ReadingProgress } from "@/components/ui/ReadingProgress/ReadingProgress";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const revalidate = 60;

export async function generateStaticParams() {
    const slugs = getPostSlugs('blog');
    return slugs.map((slug) => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPostWithSupabase('blog', resolvedParams.slug);
    if (!post) return { title: 'Not Found' };

    const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt || 'Blog Post')}`;

    return {
        title: `${post.title} — Rasyid Firdaus`,
        description: post.excerpt || '',
        openGraph: {
            title: post.title,
            description: post.excerpt || '',
            type: 'article',
            publishedTime: post.date,
            images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || '',
            images: [ogImageUrl],
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = await getPostWithSupabase('blog', resolvedParams.slug);
    if (!post) return notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: 'Rasyid Firdaus Harmaini',
        },
        description: post.excerpt || '',
    };

    return (
        <>
        <ReadingProgress />
        <Container className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs items={[
                { label: 'Blog', href: '/blog' },
                { label: post.title },
            ]} />
            <header className={styles.header}>
                <h1 className={styles.title}>{post.title}</h1>
                <div className={styles.metaInfo}>
                    <p>{post.date}</p>
                    <span>•</span>
                    <p>{post.readingTime}</p>
                </div>
            </header>
            
            <div className={styles.contentLayout}>
                <div className={styles.mainContent}>
                    <MDXRenderer source={post.content} />
                    <ShareButton title={post.title} />
                </div>
                <aside className={styles.sidebar}>
                    <TableOfContents />
                </aside>
            </div>
        </Container>
        </>
    );
}
