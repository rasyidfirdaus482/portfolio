import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

interface BaseButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children: React.ReactNode;
}

type ButtonAsButtonProps = BaseButtonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
    };

type ButtonAsLinkProps = BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
        href: string;
    };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) => {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    if ('href' in props && props.href) {
        const { href, target, rel, ...anchorProps } = props as ButtonAsLinkProps;
        const safeRel = target === '_blank' ? rel ?? 'noopener noreferrer' : rel;
        const isExternal = /^(https?:|mailto:|tel:)/.test(href);

        if (isExternal || target) {
            return (
                <a className={classes} href={href} target={target} rel={safeRel} {...anchorProps}>
                    {children}
                </a>
            );
        }

        return (
            <Link className={classes} href={href} {...anchorProps}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...(props as ButtonAsButtonProps)}>
            {children}
        </button>
    );
};
