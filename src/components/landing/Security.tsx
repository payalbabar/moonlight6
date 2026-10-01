interface SecurityRow {
  title: string;
  description: string;
}

const securityRows: SecurityRow[] = [
  {
    title: "Privacy",
    description:
      "Your secret payload never touches network adapters or server logs. Execution is 100% confined to browser RAM.",
  },
  {
    title: "Integrity",
    description:
      "AES-256-GCM includes a 128-bit authentication tag; any altered or corrupted byte immediately fails decryption.",
  },
  {
    title: "Verification",
    description:
      "Compact smart contracts on Midnight enforce cryptographic ownership proofs without disclosing key materials.",
  },
  {
    title: "Concealment",
    description:
      "Altered pixel color shifts stay below human and algorithmic perceptual thresholds (ΔE < 0.05).",
  },
  {
    title: "Zero knowledge",
    description:
      "Prove to any party that you possess a verified cold storage backup without leaking a single character.",
  },
];

export default function Security() {
  return (
    <section className="sv-section sv-security-section" id="security" aria-label="Security Principles">
      <div className="sv-container">
        {/* Header */}
        <div className="sv-security-header">
          <h2 className="sv-h2">Built so there is nothing to hand over.</h2>
        </div>

        {/* 5 Giant Rows */}
        <div className="sv-security-rows">
          {securityRows.map((row) => (
            <div key={row.title} className="sv-security-row">
              <div className="sv-sec-left">
                <h3 className="sv-sec-title">{row.title}</h3>
              </div>
              <div className="sv-sec-right">
                <p className="sv-sec-desc">{row.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
