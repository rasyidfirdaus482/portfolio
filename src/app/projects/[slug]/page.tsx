import { getPostSlugs } from "@/lib/mdx";
import { getPostWithSupabase } from "@/lib/posts";
import { Container } from "@/components/layout/Container/Container";
import { MDXRenderer } from "@/components/ui/MDXRenderer/MDXRenderer";
import { Badge } from "@/components/ui/Badge/Badge";
import { TrackedButton } from "@/components/ui/TrackedButton/TrackedButton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ShareButton } from "@/components/ui/ShareButton/ShareButton";
import { notFound } from "next/navigation";
import Image from "next/image";
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
    const canonical = `/projects/${resolvedParams.slug}`;

    return {
        title: `${project.title} - Rasyid Firdaus`,
        description: project.excerpt || '',
        alternates: {
            canonical,
        },
        openGraph: {
            title: project.title,
            description: project.excerpt || '',
            type: 'article',
            url: canonical,
            publishedTime: project.date,
            authors: ['Rasyid Firdaus Harmaini'],
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://rasyidfirdaus.vercel.app'}/projects/${resolvedParams.slug}`,
        author: {
            '@type': 'Person',
            name: 'Rasyid Firdaus Harmaini',
        },
        description: project.excerpt || '',
        datePublished: project.date,
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
            <header className={styles.hero}>
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>{project.category || 'Project Case Study'}</p>
                    <h1 className={styles.title}>{project.title}</h1>
                    {project.excerpt && <p className={styles.excerpt}>{project.excerpt}</p>}
                    {project.technologies && (
                        <div className={styles.techStack}>
                            {project.technologies.map((tech: string) => (
                                <Badge key={tech}>{tech}</Badge>
                            ))}
                        </div>
                    )}
                    <div className={styles.links}>
                        {project.github && (
                            <TrackedButton href={project.github} target="_blank" rel="noopener noreferrer" variant="outline" eventName="project_github_click" eventProperties={{ source: 'project_detail', slug: project.slug }}>
                                View Source Code
                            </TrackedButton>
                        )}
                        {project.demo && (
                            <TrackedButton href={project.demo} target="_blank" rel="noopener noreferrer" variant="primary" eventName="project_visit_click" eventProperties={{ source: 'project_detail', slug: project.slug }}>
                                Live Demo
                            </TrackedButton>
                        )}
                    </div>
                </div>

                <aside className={styles.summary}>
                    <div>
                        <span className={styles.summaryLabel}>Role</span>
                        <strong>Builder / Engineer</strong>
                    </div>
                    <div>
                        <span className={styles.summaryLabel}>Published</span>
                        <strong>{project.date}</strong>
                    </div>
                    <div>
                        <span className={styles.summaryLabel}>Status</span>
                        <strong>{project.demo ? 'Live' : project.github ? 'Source available' : 'Case study'}</strong>
                    </div>
                </aside>
            </header>

            {project.cover_image && (
                <div className={styles.coverWrap}>
                    <Image src={project.cover_image} alt={project.title} width={1200} height={675} className={styles.coverImage} priority />
                </div>
            )}

            <section className={styles.caseStudyLayout}>
                <aside className={styles.caseAside}>
                    <p className={styles.caseAsideTitle}>Case Study</p>
                    <p className={styles.caseAsideText}>Problem, solution, implementation notes, and outcomes from this project.</p>
                </aside>
                <div>
                    <MDXRenderer source={project.content} />
                    <ShareButton title={project.title} />
                </div>
            </section>
        </Container>
    );
}
