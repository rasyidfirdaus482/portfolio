import { getAllPosts } from "@/lib/mdx";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Container } from "@/components/layout/Container/Container";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { ProjectList } from "@/components/ui/ProjectList/ProjectList";
import styles from "./page.module.css";

export default function ProjectsIndex() {
  const projects = getAllPosts('projects');

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'Projects' }]} />
      <FadeIn>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>A selection of my professional work across different domains.</p>
      </FadeIn>
      
      <ProjectList initialProjects={projects} />
    </Container>
  );
}
