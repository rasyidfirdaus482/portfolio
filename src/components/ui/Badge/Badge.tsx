import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
    return (
        <span className={`${styles.badge} ${className}`.trim()}>
            {children}
        </span>
    );
};
