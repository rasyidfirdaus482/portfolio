'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#0f172a',
            color: '#f8fafc'
        }}>
            <div style={{
                backgroundColor: '#1e293b',
                padding: '3rem',
                borderRadius: '12px',
                border: '1px solid #334155',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#ef4444'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#f1f5f9'
                }}>Something went wrong!</h2>
                
                <p style={{
                    color: '#94a3b8',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                }}>
                    We encountered an unexpected error while processing your request. Most likely, the connection to the database timed out. Let's try that again.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: '#e2e8f0',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
