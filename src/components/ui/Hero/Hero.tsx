'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../Button/Button';
import { FadeIn } from '../FadeIn/FadeIn';
import { TypeWriter } from '../TypeWriter/TypeWriter';
import { TechMarquee } from '../TechMarquee/TechMarquee';
import styles from './Hero.module.css';

const roles = [
    'Web Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Penetration Tester',
    'Infrastructure Engineer',
];

export const Hero: React.FC = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <FadeIn delay={0.1}>
                    <p className={styles.greeting}>Hi, my name is</p>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <h1 className={styles.title}>
                        <span className={styles.highlight}>Rasyid Firdaus</span> Harmaini.
                    </h1>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <h2 className={styles.role}>
                        <TypeWriter texts={roles} speed={70} deleteSpeed={35} pauseDuration={2500} />
                    </h2>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <p className={styles.subtitle}>
                        Bridging Web Development, Data Science, and Infrastructure Security.
                        Building scalable solutions from the frontend to the server room.
                    </p>
                </FadeIn>
                <FadeIn delay={0.5}>
                    <div className={styles.actions}>
                        <Link href="/projects" style={{ textDecoration: 'none' }}>
                            <Button variant="primary" size="lg">Explore My Work</Button>
                        </Link>
                        <Link href="/about" style={{ textDecoration: 'none' }}>
                            <Button variant="secondary" size="lg">About Me</Button>
                        </Link>
                    </div>
                </FadeIn>
            </div>
            <FadeIn delay={0.6}>
                <div className={styles.marqueeFullWidth}>
                    <TechMarquee />
                </div>
            </FadeIn>
        </section>
    );
};
