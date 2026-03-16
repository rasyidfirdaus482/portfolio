import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import { Container } from "@/components/layout/Container/Container";
import { MDXRenderer } from "@/components/ui/MDXRenderer/MDXRenderer";
import { TableOfContents } from "@/components/ui/TableOfContents/TableOfContents";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ShareButton } from "@/components/ui/ShareButton/ShareButton";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export async function generateStaticParams() {
    const slugs = getPostSlugs('blog');
    return slugs.map((slug) => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = getPostBySlug('blog', resolvedParams.slug);
    if (!post) return notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.meta.title,
        datePublished: post.meta.date,
        author: {
            '@type': 'Person',
            name: 'Rasyid Firdaus Harmaini',
        },
        description: post.meta.excerpt || '',
    };

    return (
        <Container className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs items={[
                { label: 'Blog', href: '/blog' },
                { label: post.meta.title },
            ]} />
            <header className={styles.header}>
                <h1 className={styles.title}>{post.meta.title}</h1>
                <div className={styles.metaInfo}>
                    <p>{post.meta.date}</p>
                    <span>•</span>
                    <p>{post.meta.readingTime}</p>
                </div>
            </header>
            
            <div className={styles.contentLayout}>
                <div className={styles.mainContent}>
                    <MDXRenderer source={post.content} />
                    <ShareButton title={post.meta.title} />
                </div>
                <aside className={styles.sidebar}>
                    <TableOfContents />
                </aside>
            </div>
        </Container>
    );
}
