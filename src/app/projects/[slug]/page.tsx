import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import { Container } from "@/components/layout/Container/Container";
import { MDXRenderer } from "@/components/ui/MDXRenderer/MDXRenderer";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ShareButton } from "@/components/ui/ShareButton/ShareButton";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export async function generateStaticParams() {
    const slugs = getPostSlugs('projects');
    return slugs.map((slug) => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export default async function ProjectPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const project = getPostBySlug('projects', resolvedParams.slug);
    if (!project) return notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.meta.title,
        author: {
            '@type': 'Person',
            name: 'Rasyid Firdaus Harmaini',
        },
        description: project.meta.excerpt || '',
    };

    return (
        <Container className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs items={[
                { label: 'Projects', href: '/projects' },
                { label: project.meta.title },
            ]} />
            <header className={styles.header}>
                <h1 className={styles.title}>{project.meta.title}</h1>
                {project.meta.technologies && (
                    <div className={styles.techStack}>
                        {project.meta.technologies.map((tech: string) => (
                            <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>
                )}
                <div className={styles.links}>
                    {project.meta.github && (
                        <a href={project.meta.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="outline">View Source Code</Button>
                        </a>
                    )}
                    {project.meta.demo && (
                        <a href={project.meta.demo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button variant="primary">Live Demo</Button>
                        </a>
                    )}
                </div>
            </header>
            <MDXRenderer source={project.content} />
            <ShareButton title={project.meta.title} />
        </Container>
    );
}
