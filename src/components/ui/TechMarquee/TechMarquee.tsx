'use client';

import styles from './TechMarquee.module.css';

const technologies = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Machine Learning', 'TensorFlow', 'Pandas',
    'Ubuntu Server', 'Networking', 'Docker', 'Git',
    'CSS', 'PostgreSQL', 'Linux', 'Kali Linux',
];

export const TechMarquee = () => {
    // Duplicate array for seamless infinite scroll
    const items = [...technologies, ...technologies];

    return (
        <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
                {items.map((tech, index) => (
                    <span key={index} className={styles.marqueeItem}>
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
};
