import { useInView } from "../../hooks/useInView";

export default function ProblemSection() {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      ref={sectionRef}
      className={`sv-section sv-problem-section ${isInView ? "sv-in-view" : ""}`}
      id="problem"
      aria-label="The Backup Problem"
    >
      <div className="sv-container sv-problem-grid">
        {/* Left Column */}
        <div className="sv-problem-left">
          <h2 className="sv-h2">A backup is a target.</h2>
          <p className="sv-lead">
            Seed phrases on paper, in notes apps or in cloud folders announce what they are. Anyone
            who finds the file finds the wallet.
          </p>
        </div>

        {/* Right Column: 4 rows with monospace filenames and animated redaction blocks */}
        <div className="sv-problem-right">
          <div className="sv-file-row">
            <span className="sv-file-name">notes.txt</span>
            <div className="sv-file-content">
              <span className="sv-file-prefix">seed:&nbsp;</span>
              <span className="sv-redaction-wrapper">
                <span className="sv-redacted-text">abandon abandon abandon abandon</span>
                <span
                  className={`sv-redaction-bar ${isInView ? "sv-redaction-active" : ""}`}
                  style={{ transitionDelay: "200ms" }}
                />
              </span>
            </div>
          </div>

          <div className="sv-file-row">
            <span className="sv-file-name">backup.pdf</span>
            <div className="sv-file-content">
              <span className="sv-file-prefix">key:&nbsp;</span>
              <span className="sv-redaction-wrapper">
                <span className="sv-redacted-text">0x4c0883a69102934a6efb930129</span>
                <span
                  className={`sv-redaction-bar ${isInView ? "sv-redaction-active" : ""}`}
                  style={{ transitionDelay: "450ms" }}
                />
              </span>
            </div>
          </div>

          <div className="sv-file-row">
            <span className="sv-file-name">cloud/wallet</span>
            <div className="sv-file-content">
              <span className="sv-file-prefix">12 words,&nbsp;</span>
              <span className="sv-redaction-wrapper">
                <span className="sv-redacted-text">mnemonic backup v2 secret</span>
                <span
                  className={`sv-redaction-bar ${isInView ? "sv-redaction-active" : ""}`}
                  style={{ transitionDelay: "700ms" }}
                />
              </span>
            </div>
          </div>

          <div className="sv-file-row sv-file-row-clean">
            <span className="sv-file-name sv-file-highlight">photo.png</span>
            <div className="sv-file-content">
              <span className="sv-file-clean-text">Nothing visible. Nothing to steal.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
