'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { login } from 'web/lib/api/auth';
import { ApiError, ConfigurationError } from 'web/lib/api/client';
import { getTokenExpiry } from 'web/lib/auth/jwt';
import { persistAuthToken } from 'web/lib/auth/tokenStorage';
import { useAppDispatch, useAppSelector } from 'web/lib/state/hooks';
import { setCredentials, setRememberPreference } from 'web/lib/state/slices/authSlice';
import type { AuthUser } from 'web/lib/state/slices/authSlice';

type LoginFormState = {
  email: string;
  password: string;
  remember: boolean;
};

const initialState: LoginFormState = {
  email: '',
  password: '',
  remember: false,
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rememberFromStore = useAppSelector((state) => state.auth.remember);
  const [formState, setFormState] = useState<LoginFormState>({
    ...initialState,
    remember: rememberFromStore,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const updateField = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.currentTarget;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const isFormValid = useMemo(
    () => formState.email.trim() !== '' && formState.password.trim().length >= 8,
    [formState.email, formState.password]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      setErrorMessage('Please provide a valid email and password (minimum 8 characters).');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email: formState.email.trim(),
        password: formState.password,
      });

      const token = response?.accessToken;
      if (!token) {
        throw new ApiError('Login response is missing an access token.', 500, response);
      }

      const expiresAt = getTokenExpiry(token);
      if (expiresAt && expiresAt <= Date.now()) {
        throw new ApiError('Session token has already expired.', 401, response);
      }

      const userProfile: AuthUser =
        response.user ?? {
          email: formState.email.trim(),
        };

      dispatch(
        setCredentials({
          token,
          user: userProfile,
          remember: formState.remember,
          expiresAt: expiresAt ?? null,
        })
      );
      dispatch(setRememberPreference(formState.remember));
      persistAuthToken(token, {
        remember: formState.remember,
        expiresAt,
        user: userProfile,
      });

      setSuccessMessage('Logged in successfully. Redirecting to your dashboard...');
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (error) {
      if (error instanceof ConfigurationError) {
        setErrorMessage('Login service is not configured. Please contact support.');
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      const fallbackMessage = 'Unable to log you in right now. Please try again shortly.';
      setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__inner">
        <header className="auth-page__intro">
          <h1 className="auth-page__title">Welcome back</h1>
          <p className="auth-page__subtitle">
            Sign in to review your insights, manage uploads, and continue your journey with HealthSight.
          </p>
        </header>

        <div className="auth-card">
          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="login-email">
                Email
              </label>
              <input
                className="auth-card__input"
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={updateField}
                required
              />
            </div>

            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="login-password">
                Password
              </label>
              <input
                className="auth-card__input"
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formState.password}
                onChange={updateField}
                minLength={8}
                required
              />
            </div>

            <div className="auth-card__options">
              <label className="auth-card__checkbox-group">
                <input
                  className="auth-card__checkbox"
                  type="checkbox"
                  name="remember"
                  checked={formState.remember}
                  onChange={updateField}
                />
                <span>Keep me signed in</span>
              </label>
              <Link className="auth-card__link" href="#">
                Forgot password?
              </Link>
            </div>

            <div className="auth-card__messages" aria-live="polite">
              {errorMessage ? <p className="auth-card__error">{errorMessage}</p> : null}
              {successMessage ? <p className="auth-card__success">{successMessage}</p> : null}
            </div>

            <button type="submit" className="auth-card__submit" disabled={isSubmitting}>
              Log in
            </button>
          </form>

          <p className="auth-card__alt">
            New to HealthSight? <Link href="/sign-up">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
