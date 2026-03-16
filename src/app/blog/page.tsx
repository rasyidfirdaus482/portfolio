import { getAllPosts } from "@/lib/mdx";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Container } from "@/components/layout/Container/Container";
import { Card } from "@/components/ui/Card/Card";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import Link from "next/link";
import styles from "./page.module.css";

export default function BlogIndex() {
  const posts = getAllPosts('blog');

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <FadeIn>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Articles on software engineering, design, and more.</p>
      </FadeIn>
      
      <div className={styles.grid}>
        {posts.map((post: any, index: number) => (
          <FadeIn key={post.slug} delay={index * 0.1}>
            <Link href={`/blog/${post.slug}`} className={styles.link}>
              <Card className={styles.card}>
                <h2 className={styles.postTitle}>{post.meta.title}</h2>
                <div className={styles.metaInfo}>
                  <p className={styles.date}>{post.meta.date}</p>
                  <span>•</span>
                  <p className={styles.readingTime}>{post.meta.readingTime}</p>
                </div>
                <p className={styles.excerpt}>{post.meta.excerpt}</p>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Container>
  );
}
