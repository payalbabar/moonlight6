import Button from "./Button";

interface FinalCTAProps {
  onLaunch: () => void;
}

export default function FinalCTA({ onLaunch }: FinalCTAProps) {
  return (
    <section className="sv-final-cta-section" aria-label="Call to Action">
      {/* Dark Red Quarter-Circle in Bottom-Right Corner */}
      <div className="sv-cta-shape-corner" aria-hidden="true" />

      <div className="sv-container sv-final-cta-container">
        <div className="sv-cta-content">
          <h2 className="sv-cta-h2">
            Your data can stay hidden.
            <br />
            Its proof doesn&apos;t have to.
          </h2>

          <div className="sv-cta-actions">
            <Button variant="ink" size="lg" onClick={onLaunch}>
              Create your first vault
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
