import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'success' | 'link';
type ButtonIcon = 'arrow';
type ButtonSize = 'md' | 'sm';

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ButtonIcon;
  className?: string;
  size?: ButtonSize;
  isBlock?: boolean;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'c-button--primary',
  success: 'c-button--success',
  link: 'c-button--link',
};

const sizeClassMap: Record<ButtonSize, string> = {
  md: '',
  sm: 'c-button--size-sm',
};

const iconLookup: Record<ButtonIcon, JSX.Element> = {
  arrow: (
    <svg
      className="c-button__icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  ),
};

export function Button({
  href,
  children,
  variant = 'primary',
  icon,
  className,
  size = 'md',
  isBlock,
}: ButtonProps) {
  const variantClass = variantClassMap[variant];
  const sizeClass = sizeClassMap[size];
  const blockClass = isBlock ? 'c-button--block' : '';
  const composedClassName = ['c-button', variantClass, sizeClass, blockClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <a className={composedClassName} href={href}>
      <span>{children}</span>
      {icon ? iconLookup[icon] : null}
    </a>
  );
}
