'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './GridBackground.module.css';

export const GridBackground = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const scrollRef = useRef(0);
    const rafRef = useRef<number>(0);
    const touchActiveRef = useRef(false);

    const updateMask = useCallback(() => {
        if (!gridRef.current) return;

        const mx = mouseRef.current.x;
        const offsetY = window.innerHeight * 0.5;
        const parallax = scrollRef.current * 0.15;
        const my = mouseRef.current.y + offsetY - parallax;

        gridRef.current.style.maskImage =
            `radial-gradient(circle 650px at ${mx}px ${my}px, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)`;
        gridRef.current.style.webkitMaskImage =
            `radial-gradient(circle 650px at ${mx}px ${my}px, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)`;
        gridRef.current.style.transform = `translateY(${parallax}px)`;
    }, []);

    const hideMask = useCallback(() => {
        if (!gridRef.current) return;
        const parallax = scrollRef.current * 0.15;
        mouseRef.current = { x: -1000, y: -1000 };
        gridRef.current.style.maskImage =
            `radial-gradient(circle 650px at -1000px -1000px, transparent, transparent)`;
        gridRef.current.style.webkitMaskImage =
            `radial-gradient(circle 650px at -1000px -1000px, transparent, transparent)`;
        gridRef.current.style.transform = `translateY(${parallax}px)`;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateMask);
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchActiveRef.current = true;
            const touch = e.touches[0];
            if (touch) {
                mouseRef.current = { x: touch.clientX, y: touch.clientY };
                cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(updateMask);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchActiveRef.current = true;
            const touch = e.touches[0];
            if (touch) {
                mouseRef.current = { x: touch.clientX, y: touch.clientY };
                cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(updateMask);
            }
        };

        const handleTouchEnd = () => {
            touchActiveRef.current = false;
            // Small delay to let any trailing scroll events pass
            setTimeout(() => {
                if (!touchActiveRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = requestAnimationFrame(hideMask);
                }
            }, 100);
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
            // Only update mask if there's an active pointer (mouse or touch)
            if (mouseRef.current.x > -500) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(updateMask);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [updateMask, hideMask]);

    return (
        <div className={styles.gridWrapper} aria-hidden="true">
            <div ref={gridRef} className={styles.grid} />
        </div>
    );
};
