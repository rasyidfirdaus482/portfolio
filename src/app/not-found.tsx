import Link from "next/link";
import { Container } from "@/components/layout/Container/Container";
import { Button } from "@/components/ui/Button/Button";
import { FadeIn } from "@/components/ui/FadeIn/FadeIn";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <FadeIn direction="up">
          <div className={styles.content}>
            <h1 className={styles.errorCode}>404</h1>
            <h2 className={styles.title}>Page Not Found</h2>
            <p className={styles.description}>
              Oops! The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <div className={styles.actions}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">Return Home</Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
