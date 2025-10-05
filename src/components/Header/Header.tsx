import Link from 'next/link';
import { Button } from '../Button/Button';

export function Header() {
  const navItems = [
    { label: 'Skin Health', href: '#' },
    { label: 'Eye Health', href: '/eye-insights' },
  ];

  return (
    <header className="c-header">
      <div className="c-header__inner">
        <Link href="/" className="c-header__brand">
          HealthSight
        </Link>
        <nav className="c-header__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.label} className="c-header__nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
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
