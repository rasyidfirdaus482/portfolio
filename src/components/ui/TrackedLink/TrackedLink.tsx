'use client';

import React from 'react';
import { trackEvent } from '@/lib/analytics';

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    eventName: string;
    eventProperties?: Record<string, string | number | boolean>;
};

export function TrackedLink({
    eventName,
    eventProperties,
    onClick,
    children,
    ...props
}: TrackedLinkProps) {
    return (
        <a
            {...props}
            onClick={(event) => {
                trackEvent(eventName, eventProperties);
                onClick?.(event);
            }}
        >
            {children}
        </a>
    );
}
