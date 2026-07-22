'use client';

import React from 'react';
import Image from 'next/image';
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

interface HeroProps {
    avatarUrl?: string;
    name?: string;
}

export const Hero: React.FC<HeroProps> = ({ avatarUrl, name }) => {
    const displayName = name || 'Rasyid Firdaus Harmaini';
    const imgSrc = avatarUrl || '/avatar.png';
    const isExternal = imgSrc.startsWith('http');

    return (
        <section className={styles.hero}>
            <div className={styles.heroGrid}>
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
                            <Button href="/projects" variant="primary" size="lg">Explore My Work</Button>
                            <Button href="/about" variant="secondary" size="lg">About Me</Button>
                        </div>
                    </FadeIn>
                </div>

                <FadeIn delay={0.25}>
                    <div className={styles.visual}>
                        <div className={styles.portraitFrame}>
                            {isExternal ? (
                                <img
                                    src={imgSrc}
                                    alt={displayName}
                                    width={360}
                                    height={360}
                                    className={styles.portrait}
                                />
                            ) : (
                                <Image
                                    src={imgSrc}
                                    alt={displayName}
                                    width={360}
                                    height={360}
                                    className={styles.portrait}
                                    priority
                                />
                            )}
                        </div>
                        <div className={styles.signalPanel}>
                            <span className={styles.signalDot} />
                            <span>available for Work</span>
                        </div>
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
