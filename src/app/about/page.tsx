import { Container } from "@/components/layout/Container/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "./page.module.css";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { ContactForm } from "@/components/ui/ContactForm/ContactForm";
import Image from "next/image";

export default function AboutPage() {
  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'About' }]} />
      <div className={styles.content}>

        {/* Hero Intro */}
        <div className={styles.heroIntro}>
          <FadeIn>
            <div className={styles.avatarWrapper}>
              <Image
                src="/avatar.png"
                alt="Rasyid Firdaus Harmaini"
                width={160}
                height={160}
                className={styles.avatar}
                priority
              />
              <div className={styles.avatarGlow} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className={styles.title}>Rasyid Firdaus Harmaini</h1>
            <p className={styles.tagline}>Multidisciplinary Engineer</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className={styles.socialLinks}>
              <a href="https://github.com/rasyidfirdaus482" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/rasyidfirdaus" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a href="mailto:rasyidfirdaus53@gmail.com" className={styles.socialBtn} aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email
              </a>
            </div>
          </FadeIn>
        </div>

        <div className={styles.prose}>
          <FadeIn delay={0.3}>
            <p>
              Hello! I'm Rasyid Firdaus Harmaini, a multidisciplinary engineer who thrives at the intersection of software development, artificial intelligence, and cybersecurity.
              My journey didn't just stop at building responsive web applications; it evolved into securing the underlying infrastructure and crunching data to train machine learning models.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p>
              I believe that a truly robust system requires a holistic understanding—from designing intuitive frontends with React to configuring secure Ubuntu Servers, and running penetration testing to fortify digital perimeters.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <h2>Engineering Pillars</h2>

            <div className={styles.pillarSection}>
                <div className={styles.pillarIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <h3>Software Engineering</h3>
                <div className={styles.skills}>
                {["JavaScript", "TypeScript", "React", "Next.js", "Node.js"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.5 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>

            <div className={styles.pillarSection}>
                <div className={styles.pillarIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                </div>
                <h3>Data & AI</h3>
                <div className={styles.skills}>
                {["Python", "Machine Learning", "Data Science", "Pandas", "Scikit-learn"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.6 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>

            <div className={styles.pillarSection}>
                <div className={styles.pillarIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3>Infrastructure & Security</h3>
                <div className={styles.skills}>
                {["Ubuntu Server", "Networking", "Penetration Testing", "Security Audit"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.7 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.9}>
            <h2>Let's Connect</h2>
            <p style={{ marginBottom: '2rem' }}>
              Whether you need to build a scalable web app, analyze complex datasets, or secure your server infrastructure, I'm here to help.
              Fill out the form below or find me on <a href="https://github.com/rasyidfirdaus482">GitHub</a>.
            </p>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}
