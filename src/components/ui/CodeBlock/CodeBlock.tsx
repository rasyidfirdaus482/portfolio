'use client';

import { useRef } from 'react';
import { CopyButton } from '../CopyButton/CopyButton';
import styles from './CodeBlock.module.css';

export const CodeBlock = ({ children, ...props }: any) => {
    const preRef = useRef<HTMLPreElement>(null);

    const getCodeText = (): string => {
        if (preRef.current) {
            return preRef.current.textContent || '';
        }
        return '';
    };

    return (
        <div className={styles.codeBlockWrapper}>
            <pre ref={preRef} {...props}>
                {children}
            </pre>
            <CopyButton text={getCodeText()} />
        </div>
    );
};
