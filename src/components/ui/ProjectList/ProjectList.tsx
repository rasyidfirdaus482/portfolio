'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { FadeIn } from '../FadeIn/FadeIn';
import { Post } from '@/types/post';
import { TrackedLink } from '@/components/ui/TrackedLink/TrackedLink';
import styles from './ProjectList.module.css';

const CATEGORIES = ['All', 'Web & App', 'Data & ML', 'Cybersecurity', 'Infrastructure'];

export const ProjectList = ({ initialProjects }: { initialProjects: Post[] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTech, setActiveTech] = useState('All');

  const techFilters = useMemo(() => {
    const techSet = new Set<string>();
    initialProjects.forEach(project => {
      project.technologies?.forEach(tech => techSet.add(tech));
    });
    return ['All', ...Array.from(techSet).sort()];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesTech = activeTech === 'All' || project.technologies?.includes(activeTech);
      return matchesCategory && matchesTech;
    });
  }, [activeCategory, activeTech, initialProjects]);

  return (
    <div>
      <div className={styles.filterContainer}>
        <FadeIn delay={0.2}>
          <div className={styles.tabs}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`${styles.tab} ${activeCategory === category ? styles.activeTab : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className={styles.techFilters}>
            {techFilters.map(tech => (
              <button
                key={tech}
                onClick={() => setActiveTech(tech)}
                className={`${styles.techFilter} ${activeTech === tech ? styles.activeTechFilter : ''}`}
              >
                {tech}
              </button>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className={styles.grid}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: Post, index: number) => (
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
                  <div className={styles.statusRow}>
                    {project.demo && <span className={styles.statusBadge}>Live</span>}
                    {project.github && <span className={styles.statusBadge}>Open Source</span>}
                    <span className={styles.statusBadge}>Case Study</span>
                  </div>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    {project.category && (
                        <span className={styles.categoryBadge}>{project.category}</span>
                    )}
                  </div>
                  <p className={styles.excerpt}>{project.excerpt}</p>
                  {project.technologies && (
                    <div className={styles.techStack}>
                      {project.technologies.slice(0, 4).map((tech: string) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  )}
                </Link>
                {(project.demo || project.github) && (
                  <div className={styles.cardActions}>
                    {project.demo && (
                      <TrackedLink href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.visitBtn} eventName="project_visit_click" eventProperties={{ source: 'projects_index', slug: project.slug }}>
                        <span aria-hidden="true">↗</span> Visit
                      </TrackedLink>
                    )}
                    {project.github && (
                      <TrackedLink href={project.github} target="_blank" rel="noopener noreferrer" className={styles.githubBtn} eventName="project_github_click" eventProperties={{ source: 'projects_index', slug: project.slug }}>
                        <span aria-hidden="true">⌘</span> GitHub
                      </TrackedLink>
                    )}
                  </div>
                )}
              </Card>
            </FadeIn>
          ))
        ) : (
          <FadeIn>
            <div className={styles.emptyState}>
                No projects found in this category yet.
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};
