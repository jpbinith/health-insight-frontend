import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Card } from '../components/Card/Card';
import { FeatureStep } from '../components/FeatureStep/FeatureStep';

const skinHealthItems = [
  {
    title: 'Capture clearly',
    description: 'Follow simple lighting, focus, and framing tips for the sharpest results.',
  },
  {
    title: 'Get categorized',
    description: 'Receive likely groupings with confidence cues to discuss with a clinician.',
  },
  {
    title: 'Act with guidance',
    description: 'Know when to self-monitor versus when to seek clinical attention.',
  },
  {
    title: 'Export & share',
    description: 'Download an insight summary to take to your next appointment.',
  },
];

const eyeInsightsItems = [
  {
    title: 'What happens',
    description: 'Images convert into non-identifying iris features inside an encrypted workflow.',
  },
  {
    title: 'Why it matters',
    description: 'Contributions improve fairness and accuracy across diverse populations.',
  },
  {
    title: 'Your privacy',
    description: 'Data remains encrypted, anonymized, and removable at any time.',
  },
  {
    title: 'Transparent process',
    description: 'You control consent before anything is stored or shared.',
  },
];

function TouchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2a4 4 0 0 0-4 4v5.2c0 .44-.36.8-.8.8-.88 0-1.6.72-1.6 1.6 0 2.88 2.4 5.4 6.4 5.4s6.4-2.52 6.4-5.4V10a4 4 0 0 0-4-4" />
      <path d="M12 12V6" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 4h16v3H4z" />
      <path d="M4 10h16v10H4z" />
      <path d="M9 14h6" />
      <path d="M9 17h3" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h5" />
      <path d="M8 16h6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="o-page">
      <Header />

      <main>
        <section className="o-section o-section--hero">
          <div className="o-container c-hero">
            <h1 className="c-hero__title">Your Health, Illuminated</h1>
            <p className="c-hero__copy">
              Leverage AI to gain valuable insights into your skin and contribute to groundbreaking eye
              health research. Simple, secure, and insightful.
            </p>
          </div>
        </section>

        <section className="o-section o-section--muted">
          <div className="o-container o-stack o-stack--gap-lg">
            <div className="o-grid o-grid--two-column">
              <Card
                badgeLabel="Skin Health"
                badgeTone="primary"
                title="AI-assisted skin insights"
                description="Get a quick read on visible skin changes. We highlight patterns, risk flags, and next steps you can discuss with a clinician."
                items={skinHealthItems}
                ctaLabel="Start Skin Health"
                ctaHref="#"
              />
              <Card
                badgeLabel="Eye Insights"
                badgeTone="success"
                title="Help us improve eye-health insights"
                description="Your participation refines how iris patterns relate to health. We handle every contribution with transparency and strict privacy."
                items={eyeInsightsItems}
                ctaLabel="Contribute to Eye Insights"
                ctaHref="#"
                ctaVariant="success"
              />
            </div>
            <p className="c-note">Informational only — not a diagnosis.</p>
          </div>
        </section>

        <section className="o-section">
          <div className="o-container o-stack o-stack--gap-xl o-stack--center">
            <div className="c-hero c-hero--compact">
              <h2 className="c-hero__title c-hero__title--medium">How it works</h2>
              <p className="c-hero__copy c-hero__copy--small">
                A simple and transparent process to get you started.
              </p>
            </div>
            <div className="o-grid o-grid--three-column">
              <FeatureStep
                icon={<TouchIcon />}
                title="1. Pick your side"
                description="Choose Skin Health for immediate insights, or Eye Insights to support research."
              />
              <FeatureStep
                icon={<GuideIcon />}
                title="2. Follow guidance"
                description="Review capture best practices, privacy options, and what we collect in clear terms."
              />
              <FeatureStep
                icon={<SummaryIcon />}
                title="3. See results / contribute"
                description="Get an actionable Skin summary — or submit anonymized iris data for Eye insights."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
