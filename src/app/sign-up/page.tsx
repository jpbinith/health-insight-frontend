'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { ApiError, ConfigurationError } from 'web/lib/api/client';
import { createUser } from 'web/lib/api/users';

type SignUpFormState = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function SignUpPage() {
  const router = useRouter();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [formState, setFormState] = useState<SignUpFormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const updateFormState = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.currentTarget;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!formState.acceptTerms) {
      setErrorMessage('You must accept the terms to create an account.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await createUser({
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        password: formState.password,
      });

      setSuccessMessage('Account created successfully. Redirecting you to log in...');
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      if (error instanceof ConfigurationError) {
        setErrorMessage('Signup service is not configured. Please contact support.');
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      const fallbackMessage = 'Unexpected error occurred. Please retry in a moment.';
      setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__inner">
        <header className="auth-page__intro">
          <h1 className="auth-page__title">Create your account</h1>
          <p className="auth-page__subtitle">
            Join HealthSight to explore personalised skin and eye insights with full control over your data.
          </p>
        </header>

        <div className="auth-card">
          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="signup-name">
                Full name
              </label>
              <input
                className="auth-card__input"
                id="signup-name"
                name="fullName"
                type="text"
                placeholder="Jordan Carter"
                autoComplete="name"
                value={formState.fullName}
                onChange={updateFormState}
                required
              />
            </div>

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="signup-email">
                Email
              </label>
              <input
                className="auth-card__input"
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={updateFormState}
                required
              />
            </div>

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="signup-password">
                Password
              </label>
              <input
                className="auth-card__input"
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Choose a secure password"
                value={formState.password}
                onChange={updateFormState}
                minLength={8}
                required
              />
            </div>

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="signup-confirm">
                Confirm password
              </label>
              <input
                className="auth-card__input"
                id="signup-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={formState.confirmPassword}
                onChange={updateFormState}
                required
              />
            </div>

            <label className="auth-card__checkbox-group">
              <input
                className="auth-card__checkbox"
                type="checkbox"
                name="acceptTerms"
                checked={formState.acceptTerms}
                onChange={updateFormState}
                required
              />
              <span>
                I agree to the <Link className="auth-card__link" href="#">Terms</Link> and{' '}
                <Link className="auth-card__link" href="#">Privacy Policy</Link>
              </span>
            </label>

            <div className="auth-card__messages" aria-live="polite">
              {errorMessage ? <p className="auth-card__error">{errorMessage}</p> : null}
              {successMessage ? <p className="auth-card__success">{successMessage}</p> : null}
            </div>

            <button type="submit" className="auth-card__submit" disabled={isSubmitting}>
              Sign up
            </button>
          </form>

          <p className="auth-card__alt">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
