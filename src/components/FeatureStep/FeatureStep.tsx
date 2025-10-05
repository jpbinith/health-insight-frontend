import type { ReactNode } from 'react';

type FeatureStepProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureStep({ icon, title, description }: FeatureStepProps) {
  return (
    <article className="c-feature-step">
      <div className="c-feature-step__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="c-feature-step__title">{title}</h3>
      <p className="c-feature-step__copy">{description}</p>
    </article>
  );
}
