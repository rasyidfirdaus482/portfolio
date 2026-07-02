import { getAllPostsWithSupabase } from "@/lib/posts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Container } from "@/components/layout/Container/Container";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { BlogList } from "@/components/ui/BlogList/BlogList";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog - Rasyid Firdaus Harmaini",
  description: "Articles and notes on software engineering, web development, data, infrastructure, and security.",
  openGraph: {
    title: "Blog - Rasyid Firdaus Harmaini",
    description: "Articles and notes on software engineering, web development, data, infrastructure, and security.",
  },
};

export default async function BlogIndex() {
  const posts = await getAllPostsWithSupabase('blog');

  return (
    <Container className={styles.page}>
      <div className={styles.hero}>
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <FadeIn>
          <div className={styles.heroContent}>
            <div>
              <p className={styles.eyebrow}>Writing</p>
              <h1 className={styles.title}>Blog</h1>
              <p className={styles.subtitle}>
                Articles and notes on software engineering, data, infrastructure, and security.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div>
                <span className={styles.statValue}>{posts.length}</span>
                <span className={styles.statLabel}>Articles</span>
              </div>
              <div>
                <span className={styles.statValue}>Technical</span>
                <span className={styles.statLabel}>Focus</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <BlogList initialPosts={posts} />
    </Container>
  );
}
