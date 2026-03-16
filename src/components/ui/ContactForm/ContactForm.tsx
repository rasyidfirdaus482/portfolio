'use client';

import { useState } from 'react';
import { Button } from '../Button/Button';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call for now until Formspree URL is provided
    setTimeout(() => {
        setStatus('success');
        // e.currentTarget.reset();
    }, 1500);

    /* 
    Formspree implementation:
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("YOUR_FORMSPREE_ENDPOINT", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
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
    */
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
