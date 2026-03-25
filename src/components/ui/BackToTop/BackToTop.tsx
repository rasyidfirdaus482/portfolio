'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './BackToTop.module.css';

export const BackToTop = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        if (isAdmin) return;
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [isAdmin]);

    if (isAdmin) return null;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
    );
};
