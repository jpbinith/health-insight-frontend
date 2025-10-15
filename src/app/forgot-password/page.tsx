'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

import { requestPasswordReset } from 'web/lib/api/auth';
import { ApiError, ConfigurationError } from 'web/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSent, setHasSent] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    if (hasSent) {
      setHasSent(false);
      setSuccessMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setErrorMessage('Please provide the email associated with your account.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setHasSent(false);
    setIsSubmitting(true);

    try {
      await requestPasswordReset({ email: email.trim() });
      setSuccessMessage(
        'If an account exists for this email, a reset link has been sent. Please check your inbox.'
      );
      setHasSent(true);
    } catch (error) {
      if (error instanceof ConfigurationError) {
        setErrorMessage('Password reset service is not configured. Please contact support.');
        return;
      }

      if (error instanceof ApiError) {
        const status = error.status;
        if (status >= 500) {
          setErrorMessage('Our servers are currently busy. Please try again shortly.');
        } else if (status === 404 || status === 400) {
          setSuccessMessage(
            'If an account exists for this email, a reset link has been sent. Please check your inbox.'
          );
          setHasSent(true);
        } else {
          setErrorMessage('We could not process your request right now. Please try again in a moment.');
        }
        return;
      }

      setErrorMessage('We could not process your request right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__inner">
        <header className="auth-page__intro">
          <h1 className="auth-page__title">Forgot your password?</h1>
          <p className="auth-page__subtitle">
            Enter the email address you used to create your account and we&rsquo;ll send you a link to reset your password.
          </p>
        </header>

        <div className="auth-card">
          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="forgot-email">
                Email address
              </label>
              <input
                className="auth-card__input"
                id="forgot-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-card__messages" aria-live="polite">
              {errorMessage ? <p className="auth-card__error">{errorMessage}</p> : null}
              {successMessage ? <p className="auth-card__success">{successMessage}</p> : null}
            </div>

            <button
              type="submit"
              className="auth-card__submit"
              disabled={isSubmitting || hasSent}
            >
              {isSubmitting ? 'Sending...' : hasSent ? 'Link sent' : 'Send reset link'}
            </button>
          </form>

          <p className="auth-card__alt">
            Remembered your password? <Link href="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
