import { useState, useEffect } from "react";
import { useInView } from "../../hooks/useInView";

interface StepItem {
  number: string;
  title: string;
  desc: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Input",
    desc: "Provide your seed phrase or private key inside browser memory.",
  },
  {
    number: "02",
    title: "Encrypt",
    desc: "AES-256-GCM authenticated cipher seals payload with PBKDF2.",
  },
  {
    number: "03",
    title: "Hide",
    desc: "LSB steganography weaves ciphertext into lossless PNG pixels.",
  },
  {
    number: "04",
    title: "Prove",
    desc: "Midnight Compact ZK contract creates a non-revealing commitment.",
  },
  {
    number: "05",
    title: "Verify",
    desc: "Recover and prove ownership on Midnight without revealing secrets.",
  },
];

export default function HowItWorks() {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.25,
    triggerOnce: true,
  });

  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  useEffect(() => {
    if (!isInView) return;

    // Sequential activation: step 0 immediately or after 100ms, then next step every 520ms
    const timerIds: NodeJS.Timeout[] = [];

    steps.forEach((_, idx) => {
      const id = setTimeout(() => {
        setActiveStepIndex((prev) => Math.max(prev, idx));
      }, idx * 520);
      timerIds.push(id);
    });

    return () => {
      timerIds.forEach(clearTimeout);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className={`sv-section sv-how-section ${isInView ? "sv-in-view" : ""}`}
      id="how-it-works"
      aria-label="How StegoVault Works Protocol"
    >
      <div className="sv-container">
        <div className="sv-section-header">
          <h2 className="sv-h2">Five steps. Nothing leaves your device.</h2>
        </div>

        {/* 5-Step Pipeline */}
        <div className="sv-steps-wrapper">
          {/* Horizontal tracking line */}
          <div className="sv-steps-track">
            <div
              className={`sv-steps-progress ${isInView ? "sv-progress-animating" : ""}`}
            />
          </div>

          {/* 5 Step Columns */}
          <div className="sv-steps-grid">
            {steps.map((step, idx) => {
              const isActive = activeStepIndex >= idx;
              return (
                <div
                  key={step.number}
                  className={`sv-step-col ${isActive ? "sv-step-active" : "sv-step-inactive"}`}
                >
                  <div className="sv-step-marker-wrap">
                    <div className="sv-step-square-marker">
                      <span className="sv-step-inner-dot" />
                    </div>
                  </div>
                  <div className="sv-step-content">
                    <div className="sv-step-num-title">
                      <span className="sv-step-num">{step.number}</span>
                      <span className="sv-step-title">{step.title}</span>
                    </div>
                    <p className="sv-step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
