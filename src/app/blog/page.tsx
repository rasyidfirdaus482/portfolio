import { getAllPostsWithSupabase } from "@/lib/posts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Container } from "@/components/layout/Container/Container";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { BlogList } from "@/components/ui/BlogList/BlogList";
import styles from "./page.module.css";

export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await getAllPostsWithSupabase('blog');

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <FadeIn>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Articles on software engineering, design, and more.</p>
      </FadeIn>

      <BlogList initialPosts={posts} />
    </Container>
  );
}
