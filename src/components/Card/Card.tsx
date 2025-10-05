import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

type CardTone = 'primary' | 'success';

type CardListItem = {
  title: string;
  description: string;
};

type CardProps = {
  badgeLabel: ReactNode;
  badgeTone?: CardTone;
  title: string;
  description: string;
  items: CardListItem[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant?: 'primary' | 'success';
  className?: string;
};

export function Card({
  badgeLabel,
  badgeTone = 'primary',
  title,
  description,
  items,
  ctaLabel,
  ctaHref,
  ctaVariant = 'primary',
  className,
}: CardProps) {
  const toneClass = badgeTone === 'success' ? 'c-card--success' : '';
  const composedClassName = ['c-card', toneClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={composedClassName}>
      <div className="c-card__badge">
        <Badge variant={badgeTone === 'success' ? 'success' : 'primary'}>
          {badgeLabel}
        </Badge>
      </div>
      <div>
        <h3 className="c-card__title">{title}</h3>
        <p className="c-card__description">{description}</p>
      </div>
      <ul className="c-card__list">
        {items.map((item, index) => (
          <li className="c-card__item" key={item.title}>
            <span className="c-card__index">{index + 1}</span>
            <div>
              <h4 className="c-card__item-title">{item.title}</h4>
              <p className="c-card__item-copy">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="c-card__actions">
        <Button href={ctaHref} variant={ctaVariant} icon="arrow" isBlock>
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
