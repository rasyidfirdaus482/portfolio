'use client';

import React from 'react';
import { CopyButton } from '../CopyButton/CopyButton';
import styles from './CodeBlock.module.css';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
}

function extractCodeText(node: React.ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(extractCodeText).join('');
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return extractCodeText(node.props.children);
    }
    return '';
}

export const CodeBlock = ({ children, ...props }: CodeBlockProps) => {
    const codeText = extractCodeText(children);

    return (
        <div className={styles.codeBlockWrapper}>
            <pre {...props}>
                {children}
            </pre>
            <CopyButton text={codeText} />
        </div>
    );
};
