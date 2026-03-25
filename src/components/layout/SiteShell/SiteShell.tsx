'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { BackToTop } from '@/components/ui/BackToTop/BackToTop';
import { GridBackground } from '@/components/ui/GridBackground/GridBackground';

export function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <GridBackground />
            <Navbar />
            {children}
            <Footer />
            <BackToTop />
        </>
    );
}
