'use client';

import Link from 'next/link';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';

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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastKnownUserRef = useRef<typeof user>(null);

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
        <nav className="c-header__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.label} className="c-header__nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="c-header__actions">
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
      </div>
    </header>
  );
}
