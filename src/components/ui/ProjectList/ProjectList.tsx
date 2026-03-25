'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { FadeIn } from '../FadeIn/FadeIn';
import { Post } from '@/types/post';
import styles from './ProjectList.module.css';

const CATEGORIES = ['All', 'Web & App', 'Data & ML', 'Cybersecurity', 'Infrastructure'];

export const ProjectList = ({ initialProjects }: { initialProjects: Post[] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? initialProjects 
    : initialProjects.filter(project => project.category === activeCategory);

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
      </div>

      <div className={styles.grid}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: Post, index: number) => (
            <FadeIn key={project.slug} delay={index * 0.1}>
              <Link href={`/projects/${project.slug}`} className={styles.link}>
                <Card className={styles.card}>
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
                </Card>
              </Link>
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
