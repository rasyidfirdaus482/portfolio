import { Container } from "@/components/layout/Container/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "./page.module.css";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { ContactForm } from "@/components/ui/ContactForm/ContactForm";
import type { Metadata } from "next";
import { getAboutProfile } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About - Rasyid Firdaus Harmaini",
  description: "About Rasyid Firdaus Harmaini, a multidisciplinary engineer working across web development, data, AI, infrastructure, and security.",
  openGraph: {
    title: "About - Rasyid Firdaus Harmaini",
    description: "A multidisciplinary engineer working across web development, data, AI, infrastructure, and security.",
  },
};

const softwareSkills = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js"];
const dataSkills = ["Python", "Machine Learning", "Data Science", "Pandas", "Scikit-learn"];
const securitySkills = ["Ubuntu Server", "Networking", "Penetration Testing", "Security Audit"];

export default async function AboutPage() {
  const profile = await getAboutProfile();

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'About' }]} />
      <div className={styles.content}>
        <div className={styles.heroIntro}>
          <FadeIn>
            <div className={styles.avatarWrapper}>
              <img
                src={profile.avatarUrl || '/avatar.png'}
                alt={profile.name}
                width={160}
                height={160}
                className={styles.avatar}
              />
              <div className={styles.avatarGlow} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className={styles.title}>{profile.name}</h1>
            <p className={styles.tagline}>{profile.tagline}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className={styles.socialLinks}>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="GitHub">
                GitHub
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href={profile.email} className={styles.socialBtn} aria-label="Email">
                Email
              </a>
            </div>
          </FadeIn>
        </div>

        <div className={styles.prose}>
          <FadeIn delay={0.3}>
            <p>{profile.intro1}</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p>{profile.intro2}</p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <h2>Engineering Pillars</h2>

            <div className={styles.pillarSection}>
                <div className={styles.pillarIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <h3>Software Engineering</h3>
                <div className={styles.skills}>
                {softwareSkills.map((skill, index) => (
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
                {dataSkills.map((skill, index) => (
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
                {securitySkills.map((skill, index) => (
                    <FadeIn key={skill} delay={0.7 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.8}>
            <h2>Experience Focus</h2>
            <div className={styles.experienceList}>
              <div className={styles.experienceItem}>
                <span className={styles.experienceDate}>Current</span>
                <div>
                  <h3>Portfolio, Web Apps, and Content Systems</h3>
                  <p>Building Next.js applications with MDX content, admin workflows, reusable UI components, and SEO-ready publishing.</p>
                </div>
              </div>
              <div className={styles.experienceItem}>
                <span className={styles.experienceDate}>Focus</span>
                <div>
                  <h3>Infrastructure and Security Practice</h3>
                  <p>Working with Linux servers, networking fundamentals, security audits, and practical hardening workflows.</p>
                </div>
              </div>
              <div className={styles.experienceItem}>
                <span className={styles.experienceDate}>Focus</span>
                <div>
                  <h3>Data and Machine Learning</h3>
                  <p>Exploring applied data analysis and machine learning workflows using Python, Pandas, and Scikit-learn.</p>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.9}>
            <h2>Let's Connect</h2>
            <p style={{ marginBottom: '2rem' }}>
              Whether you need to build a scalable web app, analyze complex datasets, or secure your server infrastructure, I&apos;m here to help.
              Fill out the form below or find me on <a href={profile.githubUrl}>GitHub</a>.
            </p>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}
