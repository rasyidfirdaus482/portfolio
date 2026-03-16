'use client';

import { useEffect, useState } from 'react';
import styles from './TypeWriter.module.css';

interface TypeWriterProps {
    texts: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseDuration?: number;
}

export const TypeWriter = ({ texts, speed = 80, deleteSpeed = 40, pauseDuration = 2000 }: TypeWriterProps) => {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (charIndex < currentText.length) {
                    setDisplayText(currentText.slice(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    // Pause then start deleting
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                // Deleting
                if (charIndex > 0) {
                    setDisplayText(currentText.slice(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setTextIndex((textIndex + 1) % texts.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration]);

    return (
        <span className={styles.typewriter}>
            {displayText}
            <span className={styles.cursor}>|</span>
        </span>
    );
};
