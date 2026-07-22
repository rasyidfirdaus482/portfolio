import { Hero } from "@/components/ui/Hero/Hero";
import { Container } from "@/components/layout/Container/Container";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { getAllPostsWithSupabase } from "@/lib/posts";
import { getResumeUrl, getAboutProfile } from "@/lib/site-settings";
import { Post } from "@/types/post";
import Link from "next/link";
import Image from "next/image";
import { TrackedLink } from "@/components/ui/TrackedLink/TrackedLink";
import styles from "./page.module.css";

export const metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const resumeUrl = await getResumeUrl();
  const profile = await getAboutProfile();
  const allBlogs = await getAllPostsWithSupabase('blog');
  const recentBlogs = allBlogs.slice(0, 3);
  
  const allProjects = await getAllPostsWithSupabase('projects');
  const featuredProjects = [...allProjects]
    .sort((a: Post, b: Post) => Number(Boolean(b.demo || b.github || b.cover_image)) - Number(Boolean(a.demo || a.github || a.cover_image)))
    .slice(0, 3);
  
  const certificates = await getAllPostsWithSupabase('certificates');

  return (
    <div className={styles.page}>
      <Container>
        <Hero avatarUrl={profile.avatarUrl} />

        <section className={styles.section}>
          <FadeIn>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
              <Link href="/projects" className={styles.viewAll}>View All →</Link>
            </div>
          </FadeIn>
          <div className={styles.grid}>
            {featuredProjects.map((project: Post, index: number) => (
              <FadeIn key={project.slug} delay={index * 0.1}>
                <Card className={styles.card}>
                  <Link href={`/projects/${project.slug}`} className={styles.link}>
                    {project.cover_image ? (
                      <Image src={project.cover_image} alt={project.title} className={styles.cardCover} width={720} height={405} />
                    ) : (
                      <div className={styles.cardCoverFallback}>
                        <span>{project.category || 'Project'}</span>
                      </div>
                    )}
                    <div className={styles.cardBody}>
                      <div className={styles.statusRow}>
                        {project.demo && <span className={styles.statusBadge}>Live</span>}
                        {project.github && <span className={styles.statusBadge}>Open Source</span>}
                        <span className={styles.statusBadge}>Case Study</span>
                      </div>
                      {project.category && (
                        <div className={styles.cardMeta}>
                          <Badge>{project.category}</Badge>
                        </div>
                      )}
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardExcerpt}>{project.excerpt}</p>
                      {project.technologies && (
                        <div className={styles.cardTech}>
                          {project.technologies.slice(0, 3).map((tech: string) => (
                            <span key={tech} className={styles.techTag}>{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                  {(project.demo || project.github) && (
                    <div className={styles.cardActions}>
                      {project.demo && (
                        <TrackedLink href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.visitBtn} eventName="project_visit_click" eventProperties={{ source: 'home', slug: project.slug }}>
                          Visit
                        </TrackedLink>
                      )}
                      {project.github && (
                        <TrackedLink href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubBtn} eventName="project_github_click" eventProperties={{ source: 'home', slug: project.slug }}>
                          GitHub
                        </TrackedLink>
                      )}
                    </div>
                  )}
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className={styles.section}>
            <FadeIn>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Certifications</h2>
              </div>
            </FadeIn>
            <div className={styles.certGrid}>
              {certificates.map((cert: Post, index: number) => (
                <FadeIn key={cert.slug} delay={index * 0.1}>
                  <Card className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    </div>
                    <h3 className={styles.certTitle}>{cert.title}</h3>
                    <p className={styles.certIssuer}>{cert.issuer}</p>
                    <p className={styles.certDate}>{cert.date}</p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.certLink}
                      >
                        View Credential →
                      </a>
                    )}
                  </Card>
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <FadeIn>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest Writings</h2>
              <Link href="/blog" className={styles.viewAll}>View All →</Link>
            </div>
          </FadeIn>
          <div className={styles.grid}>
            {recentBlogs.map((post: Post, index: number) => (
              <FadeIn key={post.slug} delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`} className={styles.link}>
                  <Card className={styles.card}>
                    {post.cover_image && (
                      <img src={post.cover_image} alt={post.title} className={styles.cardCover} />
                    )}
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>{post.date}</span>
                        {post.readingTime && (
                          <span className={styles.cardReadTime}>· {post.readingTime}</span>
                        )}
                      </div>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <FadeIn>
            <div>
              <h2 className={styles.ctaTitle}>Need a practical engineer for web, data, or infrastructure work?</h2>
              <p className={styles.ctaText}>
                I build production-minded interfaces, content systems, and technical workflows with attention to maintainability and security.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/about" className={styles.ctaPrimary}>Contact Me</Link>
              {resumeUrl && (
                <TrackedLink href={resumeUrl} className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer" eventName="resume_click" eventProperties={{ source: 'home_cta' }}>
                  Resume
                </TrackedLink>
              )}
            </div>
          </FadeIn>
        </section>
      </Container>
    </div>
  );
}
