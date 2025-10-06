import Link from 'next/link';

export default function SignUpPage() {
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
          <form className="auth-card__form">
            <div className="auth-card__field">
              <label className="auth-card__label" htmlFor="signup-name">
                Full name
              </label>
              <input
                className="auth-card__input"
                id="signup-name"
                name="name"
                type="text"
                placeholder="Jordan Carter"
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
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <label className="auth-card__checkbox-group">
              <input className="auth-card__checkbox" type="checkbox" name="terms" required />
              <span>
                I agree to the <Link className="auth-card__link" href="#">Terms</Link> and{' '}
                <Link className="auth-card__link" href="#">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="auth-card__submit">
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
