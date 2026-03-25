import { Hero } from "@/components/ui/Hero/Hero";
import { Container } from "@/components/layout/Container/Container";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { getAllPostsWithSupabase } from "@/lib/posts";
import { Post } from "@/types/post";
import Link from "next/link";
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
  const allBlogs = await getAllPostsWithSupabase('blog');
  const recentBlogs = allBlogs.slice(0, 3);
  
  const allProjects = await getAllPostsWithSupabase('projects');
  const recentProjects = allProjects.slice(0, 3);
  
  const certificates = await getAllPostsWithSupabase('certificates');

  return (
    <div className={styles.page}>
      <Container>
        <Hero />

        <section className={styles.section}>
          <FadeIn>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Projects</h2>
              <Link href="/projects" className={styles.viewAll}>View All →</Link>
            </div>
          </FadeIn>
          <div className={styles.grid}>
            {recentProjects.map((project: Post, index: number) => (
              <FadeIn key={project.slug} delay={index * 0.1}>
                <Link href={`/projects/${project.slug}`} className={styles.link}>
                  <Card className={styles.card}>
                    {project.cover_image && (
                      <img src={project.cover_image} alt={project.title} className={styles.cardCover} />
                    )}
                    <div className={styles.cardBody}>
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
                  </Card>
                </Link>
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
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
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
      </Container>
    </div>
  );
}
