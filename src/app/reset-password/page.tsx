'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { resetPassword } from 'web/lib/api/auth';
import { ApiError, ConfigurationError } from 'web/lib/api/client';

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams?.get('token') ?? '';

  const [formState, setFormState] = useState({
    token: initialToken,
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialToken) {
      setFormState((prev) => ({
        ...prev,
        token: initialToken,
      }));
    }
  }, [initialToken]);

  const isTokenProvided = useMemo(() => formState.token.trim().length > 0, [formState.token]);

  const updateField = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = () => {
    if (!formState.token.trim()) {
      return 'Reset link is missing or invalid. Please use the most recent email we sent.';
    }
    if (formState.password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (formState.password !== formState.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await resetPassword({
        token: formState.token.trim(),
        password: formState.password,
      });

      setSuccessMessage('Your password has been reset. Redirecting you to log in...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      if (error instanceof ConfigurationError) {
        setErrorMessage('Password reset service is not configured. Please contact support.');
        return;
      }

      if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 404 || error.status === 422) {
          setErrorMessage('Your reset link is invalid or has expired. Please request a new one.');
        } else {
          setErrorMessage('We could not reset your password right now. Please try again shortly.');
        }
        return;
      }

      setErrorMessage('Unexpected error occurred. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__inner">
        <header className="auth-page__intro">
          <h1 className="auth-page__title">Reset your password</h1>
          <p className="auth-page__subtitle">
            Choose a new password to secure your HealthSight account.
          </p>
        </header>

        <div className="auth-card">
          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            {!isTokenProvided ? (
              <div className="auth-card__messages" aria-live="polite">
                <p className="auth-card__error">
                  Reset link not found. Please follow the link provided in your email.
                </p>
              </div>
            ) : null}

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="reset-password">
                New password
              </label>
              <input
                className="auth-card__input"
                id="reset-password"
                name="password"
                type="password"
                placeholder="Enter a new password"
                autoComplete="new-password"
                value={formState.password}
                onChange={updateField}
                minLength={MIN_PASSWORD_LENGTH}
                required
              />
            </div>

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="reset-confirm-password">
                Confirm new password
              </label>
              <input
                className="auth-card__input"
                id="reset-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                value={formState.confirmPassword}
                onChange={updateField}
                minLength={MIN_PASSWORD_LENGTH}
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
              disabled={isSubmitting || !isTokenProvided}
            >
              {isSubmitting ? 'Resetting...' : 'Reset password'}
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
