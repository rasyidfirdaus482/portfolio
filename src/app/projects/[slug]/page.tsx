import { getPostSlugs } from "@/lib/mdx";
import { getPostWithSupabase } from "@/lib/posts";
import { Container } from "@/components/layout/Container/Container";
import { MDXRenderer } from "@/components/ui/MDXRenderer/MDXRenderer";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ShareButton } from "@/components/ui/ShareButton/ShareButton";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const revalidate = 60;

export async function generateStaticParams() {
    const slugs = getPostSlugs('projects');
    return slugs.map((slug) => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const project = await getPostWithSupabase('projects', resolvedParams.slug);
    if (!project) return { title: 'Not Found' };

    const ogImageUrl = `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.excerpt || 'Project')}`;

    return {
        title: `${project.title} — Rasyid Firdaus`,
        description: project.excerpt || '',
        openGraph: {
            title: project.title,
            description: project.excerpt || '',
            type: 'article',
            images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.excerpt || '',
            images: [ogImageUrl],
        },
    };
}
export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const project = await getPostWithSupabase('projects', resolvedParams.slug);
    if (!project) return notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        author: {
            '@type': 'Person',
            name: 'Rasyid Firdaus Harmaini',
        },
        description: project.excerpt || '',
    };

    return (
        <Container className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs items={[
                { label: 'Projects', href: '/projects' },
                { label: project.title },
            ]} />
            <header className={styles.header}>
                <h1 className={styles.title}>{project.title}</h1>
                {project.technologies && (
                    <div className={styles.techStack}>
                        {project.technologies.map((tech: string) => (
                            <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>
                )}
                <div className={styles.links}>
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="outline">View Source Code</Button>
                        </a>
                    )}
                    {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="primary">Live Demo</Button>
                        </a>
                    )}
                </div>
            </header>
            <MDXRenderer source={project.content} />
            <ShareButton title={project.title} />
        </Container>
    );
}
