import { Hero } from "@/components/ui/Hero/Hero";
import { Container } from "@/components/layout/Container/Container";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function Home() {
  const recentBlogs = getAllPosts('blog').slice(0, 3);
  const recentProjects = getAllPosts('projects').slice(0, 3);

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
            {recentProjects.map((project: any, index: number) => (
              <FadeIn key={project.slug} delay={index * 0.1}>
                <Link href={`/projects/${project.slug}`} className={styles.link}>
                  <Card className={styles.card}>
                    {project.meta.category && (
                      <div className={styles.cardMeta}>
                        <Badge>{project.meta.category}</Badge>
                      </div>
                    )}
                    <h3 className={styles.cardTitle}>{project.meta.title}</h3>
                    <p className={styles.cardExcerpt}>{project.meta.excerpt}</p>
                    {project.meta.technologies && (
                      <div className={styles.cardTech}>
                        {project.meta.technologies.slice(0, 3).map((tech: string) => (
                          <span key={tech} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <FadeIn>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Latest Writings</h2>
              <Link href="/blog" className={styles.viewAll}>View All →</Link>
            </div>
          </FadeIn>
          <div className={styles.grid}>
            {recentBlogs.map((post: any, index: number) => (
              <FadeIn key={post.slug} delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`} className={styles.link}>
                  <Card className={styles.card}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardDate}>{post.meta.date}</span>
                      {post.meta.readingTime && (
                        <span className={styles.cardReadTime}>· {post.meta.readingTime}</span>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>{post.meta.title}</h3>
                    <p className={styles.cardExcerpt}>{post.meta.excerpt}</p>
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
