import { Container } from "@/components/layout/Container/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "./page.module.css";
import { Badge } from "@/components/ui/Badge/Badge";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import { ContactForm } from "@/components/ui/ContactForm/ContactForm";

export default function AboutPage() {
  const skills = ["JavaScript", "TypeScript", "React", "Next.js", "CSS Modules", "Node.js", "Git", "UI/UX Design"];

  return (
    <Container className={styles.container}>
      <Breadcrumbs items={[{ label: 'About' }]} />
      <div className={styles.content}>
        <FadeIn>
          <h1 className={styles.title}>About Me</h1>
        </FadeIn>
        
        <div className={styles.prose}>
          <FadeIn delay={0.2}>
            <p>
              Hello! I'm Rasyid Firdaus Harmaini, a multidisciplinary engineer who thrives at the intersection of software development, artificial intelligence, and cybersecurity. 
              My journey didn't just stop at building responsive web applications; it evolved into securing the underlying infrastructure and crunching data to train machine learning models.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p>
              I believe that a truly robust system requires a holistic understanding—from designing intuitive frontends with React to configuring secure Ubuntu Servers, and running penetration testing to fortify digital perimeters.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <h2>Engineering Pillars</h2>
            
            <div className={styles.pillarSection}>
                <h3>Software Engineering</h3>
                <div className={styles.skills}>
                {["JavaScript", "TypeScript", "React", "Next.js", "Node.js"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.4 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>

            <div className={styles.pillarSection}>
                <h3>Data & AI</h3>
                <div className={styles.skills}>
                {["Python", "Machine Learning", "Data Science", "Pandas", "Scikit"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.5 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>

            <div className={styles.pillarSection}>
                <h3>Infrastructure & Security</h3>
                <div className={styles.skills}>
                {["Ubuntu Server", "Networking", "Penetration Testing", "Security"].map((skill, index) => (
                    <FadeIn key={skill} delay={0.6 + (index * 0.05)} direction="left">
                    <Badge className={styles.skillBadge}>{skill}</Badge>
                    </FadeIn>
                ))}
                </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.8}>
            <h2>Let's Connect</h2>
            <p style={{ marginBottom: '2rem' }}>
              Whether you need to build a scalable web app, analyze complex datasets, or secure your server infrastructure, I'm here to help. 
              Fill out the form below or find me on <a href="https://github.com/rasyid">GitHub</a>.
            </p>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}
