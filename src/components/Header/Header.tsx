import { Button } from '../Button/Button';

export function Header() {
  return (
    <header className="c-header">
      <div className="c-header__inner">
        <a href="#" className="c-header__brand">
          HealthSight
        </a>
        <div className="c-header__actions">
          <Button href="#" variant="link" size="sm">
            Log in
          </Button>
          <Button href="#" size="sm">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
