'use client';

import React from 'react';
import { Button } from '../Button/Button';
import { trackEvent } from '@/lib/analytics';

type TrackedButtonProps = React.ComponentProps<typeof Button> & {
    eventName: string;
    eventProperties?: Record<string, string | number | boolean>;
};

export function TrackedButton({
    eventName,
    eventProperties,
    onClick,
    children,
    ...props
}: TrackedButtonProps) {
    const buttonProps = props as React.ComponentProps<typeof Button>;

    return (
        <Button
            {...buttonProps}
            onClick={(event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
                trackEvent(eventName, eventProperties);
                (onClick as ((event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | undefined)?.(event);
            }}
        >
            {children}
        </Button>
    );
}
