import Link from 'next/link';

export default function LoginPage() {
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
          <form className="auth-card__form">
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
                required
              />
            </div>

            <div className="auth-card__options">
              <label className="auth-card__checkbox-group">
                <input className="auth-card__checkbox" type="checkbox" name="remember" />
                <span>Keep me signed in</span>
              </label>
              <Link className="auth-card__link" href="#">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-card__submit">
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
