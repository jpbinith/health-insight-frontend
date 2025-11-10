'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '../Button/Button';
import { useAppSelector } from 'web/lib/state/hooks';
import { useLogout } from 'web/lib/auth/useLogout';

type NavItem = {
  label: string;
  href: string;
};

const baseNavItems: NavItem[] = [
  { label: 'Skin Health', href: '/skin-health' },
  { label: 'Eye Health', href: '/eye-insights' },
];

const getDisplayName = (params: { fullName?: string | null; email?: string | null }) => {
  if (params.fullName) {
    const [firstName] = params.fullName.trim().split(/\s+/);
    if (firstName) {
      return firstName;
    }
  }

  if (params.email) {
    const [localPart] = params.email.split('@');
    if (localPart) {
      return localPart;
    }
  }

  return 'Account';
};

const buildInitials = (params: { fullName?: string | null; email?: string | null }) => {
  if (params.fullName) {
    const parts = params.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length > 0) {
      const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
      return initials.join('');
    }
  }

  if (params.email) {
    return params.email[0]?.toUpperCase() ?? 'U';
  }

  return 'U';
};

export function Header() {
  const logout = useLogout();
  const { token, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastKnownUserRef = useRef<typeof user>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      lastKnownUserRef.current = user;
    }
  }, [user]);

  const effectiveUser = user ?? lastKnownUserRef.current;

  const displayName = useMemo(
    () =>
      getDisplayName({
        fullName: effectiveUser?.fullName as string | undefined,
        email: effectiveUser?.email as string | undefined,
      }),
    [effectiveUser?.email, effectiveUser?.fullName]
  );

  const initials = useMemo(
    () =>
      buildInitials({
        fullName: effectiveUser?.fullName as string | undefined,
        email: effectiveUser?.email as string | undefined,
      }),
    [effectiveUser?.email, effectiveUser?.fullName]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    closeMobileNav();
  }, [closeMobileNav, pathname]);

  const navItems = useMemo(() => {
    if (token) {
      return [...baseNavItems, { label: 'History', href: '/history' }];
    }
    return baseNavItems;
  }, [token]);

  return (
    <header className="c-header">
      <div className="c-header__inner">
        <Link href="/" className="c-header__brand">
          HealthSight
        </Link>
        <button
          type="button"
          className="c-header__mobile-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMobileNavOpen}
          aria-controls="header-mobile-panel"
          onClick={toggleMobileNav}
        >
          <span className="c-header__mobile-icon" aria-hidden="true">
            <span className="c-header__mobile-bar" />
            <span className="c-header__mobile-bar" />
            <span className="c-header__mobile-bar" />
          </span>
        </button>
        <nav className="c-header__nav c-header__nav--desktop" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.label} className="c-header__nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="c-header__actions c-header__actions--desktop">
          {token ? (
            <div className="c-header__session" ref={menuRef}>
              <button
                type="button"
                className="c-header__avatar-button"
                onClick={toggleMenu}
                aria-label={`${displayName} account menu`}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
              >
                <span className="c-header__avatar" aria-hidden="true">
                  {initials}
                </span>
              </button>
              {isMenuOpen ? (
                <div className="c-header__menu" role="menu">
                  <div className="c-header__menu-header">
                    <span className="c-header__menu-name">{displayName}</span>
                    {user?.email ? (
                      <span className="c-header__menu-email">{user.email}</span>
                    ) : null}
                  </div>
                  <div className="c-header__menu-divider" role="presentation" />
                  <div className="c-header__menu-actions">
                    <button
                      type="button"
                      className="c-header__menu-item"
                      role="menuitem"
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button href="/login" variant="link" size="sm">
                Log in
              </Button>
              <Button href="/sign-up" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
        <div
          id="header-mobile-panel"
          className={`c-header__mobile-panel${isMobileNavOpen ? ' c-header__mobile-panel--open' : ''}`}
        >
          <nav className="c-header__mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.label}`}
                className="c-header__mobile-link"
                href={item.href}
                onClick={closeMobileNav}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {token ? (
            <div className="c-header__mobile-session">
              <div className="c-header__mobile-session-meta">
                <span className="c-header__mobile-name">{displayName}</span>
                {effectiveUser?.email ? (
                  <span className="c-header__mobile-email">{effectiveUser.email as string}</span>
                ) : null}
              </div>
              <Button
                as="button"
                variant="link"
                onClick={() => {
                  closeMobileNav();
                  closeMenu();
                  logout();
                }}
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="c-header__mobile-auth">
              <Button href="/login" variant="link" isBlock size="sm" onClick={closeMobileNav}>
                Log in
              </Button>
              <Button href="/sign-up" isBlock size="sm" onClick={closeMobileNav}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
