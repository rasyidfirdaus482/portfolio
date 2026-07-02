'use client';

import { useState } from 'react';
import { Button } from '../Button/Button';
import { trackEvent } from '@/lib/analytics';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackEvent('contact_submit');
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className={styles.input}
            placeholder="John Doe"
            disabled={status === 'submitting'}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Email Address</label>
        <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className={styles.input}
            placeholder="john@example.com"
            disabled={status === 'submitting'}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea 
            id="message" 
            name="message" 
            required 
            rows={5} 
            className={styles.textarea}
            placeholder="How can I help you?"
            disabled={status === 'submitting'}
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        disabled={status === 'submitting' || status === 'success'}
        className={styles.submitButton}
      >
        {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
      </Button>

      {status === 'error' && (
        <p className={styles.errorMessage}>Oops! There was a problem submitting your form.</p>
      )}
    </form>
  );
};
