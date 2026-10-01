interface StackItem {
  name: string;
  role: string;
  description: string;
}

const stackItems: StackItem[] = [
  {
    name: "Midnight",
    role: "Zero-Knowledge L1 Network",
    description: "Provides privacy-preserving decentralized ledger state for confidential commitments.",
  },
  {
    name: "Compact",
    role: "ZK Smart Contract Language",
    description: "Compiles mathematical circuits that verify cold vault ownership without revealing payloads.",
  },
  {
    name: "1AM Wallet",
    role: "Cryptographic Key Authority",
    description: "Browser extension facilitating non-custodial transaction authorization and identity proofs.",
  },
  {
    name: "AES-256-GCM",
    role: "Authenticated Encryption",
    description: "NIST-standard symmetric cipher with PBKDF2 (100,000 rounds) key stretching and 128-bit MAC.",
  },
  {
    name: "PNG Steganography",
    role: "Concealment Engine",
    description: "Lossless Least Significant Bit (LSB) embedding algorithm keeping perceptual ΔE < 0.05.",
  },
];

export default function TechStack() {
  return (
    <section className="sv-section sv-stack-section" aria-label="Technology Stack Specifications">
      <div className="sv-container">
        {/* Header */}
        <div className="sv-stack-header">
          <span className="sv-stack-tag">UNDER THE HOOD</span>
          <h2 className="sv-h2">Technology Stack</h2>
        </div>

        {/* Table-like Stack Rows with 1.5px Bone Top Border */}
        <div className="sv-stack-table">
          {stackItems.map((item) => (
            <div key={item.name} className="sv-stack-row">
              <div className="sv-stack-col-name">
                <span className="sv-stack-name">{item.name}</span>
              </div>
              <div className="sv-stack-col-role">
                <span className="sv-stack-role">{item.role}</span>
              </div>
              <div className="sv-stack-col-desc">
                <p className="sv-stack-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
