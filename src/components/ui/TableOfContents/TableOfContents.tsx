'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = () => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('h2, h3'))
            .filter(element => element.id);

        const headingElements: Heading[] = elements.map((element) => ({
            id: element.id,
            text: element.textContent || '',
            level: Number(element.tagName.charAt(1)),
        }));

        setHeadings(headingElements);

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: '0px 0px -80% 0px',
        });

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className={styles.toc}>
            <h4 className={styles.tocTitle}>Table of Contents</h4>
            <ul className={styles.tocList}>
                {headings.map((heading) => (
                    <li 
                        key={heading.id} 
                        className={styles.tocItem}
                        style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                    >
                        <a 
                            href={`#${heading.id}`}
                            className={`${styles.tocLink} ${activeId === heading.id ? styles.active : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
