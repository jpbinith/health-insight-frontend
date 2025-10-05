import type { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'success';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClassMap: Record<BadgeVariant, string> = {
  primary: '',
  success: 'c-badge--success',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variantClass = variantClassMap[variant];
  const composedClassName = ['c-badge', variantClass, className]
    .filter(Boolean)
    .join(' ');

  return <span className={composedClassName}>{children}</span>;
}
