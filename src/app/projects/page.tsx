import { getAllPostsWithSupabase } from "@/lib/posts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Container } from "@/components/layout/Container/Container";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { ProjectList } from "@/components/ui/ProjectList/ProjectList";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects — Rasyid Firdaus Harmaini",
  description: "Selected projects across web development, data and machine learning, cybersecurity, and infrastructure.",
  openGraph: {
    title: "Projects — Rasyid Firdaus Harmaini",
    description: "Selected projects across web development, data and machine learning, cybersecurity, and infrastructure.",
  },
};

export default async function ProjectsIndex() {
  const projects = await getAllPostsWithSupabase('projects');

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'Projects' }]} />
      <FadeIn>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>Selected work across web development, data, cybersecurity, and infrastructure.</p>
      </FadeIn>
      
      <ProjectList initialProjects={projects} />
    </Container>
  );
}
