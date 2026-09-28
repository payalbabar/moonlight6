export default function SecuritySpecMatrix() {
  const comparisonData = [
    {
      feature: "Physical Search & Seizure Defense",
      stegoVault: "Inconspicuous ordinary PNG family/wallpaper image",
      hardwareWallet: "Identifiable physical USB dongle / device",
      metalPlate: "Laser-etched metal block, instantly recognizable",
      cloudPassword: "Vulnerable to subpoena, leak, or server breach",
    },
    {
      feature: "On-Chain Timestamp & Integrity Proof",
      stegoVault: "Midnight Compact Smart Contract (32-byte hash)",
      hardwareWallet: "None (Airgapped / Local only)",
      metalPlate: "None (Manual physical check)",
      cloudPassword: "Centralized server log",
    },
    {
      feature: "Wallet-Bound Authorization",
      stegoVault: "1AM Wallet Bech32m Address Binding",
      hardwareWallet: "PIN code on device only",
      metalPlate: "None (Anyone who reads can use)",
      cloudPassword: "2FA / Master Password",
    },
    {
      feature: "Decentralized Airgap Resilience",
      stegoVault: "100% Client-side JS / Browser Memory",
      hardwareWallet: "Requires vendor firmware updates",
      metalPlate: "Fireproof, but vulnerable to physical theft",
      cloudPassword: "Zero airgap (Always online server)",
    },
    {
      feature: "Steganographic Camouflage",
      stegoVault: "Lossless Blue-Channel LSB (ΔE < 0.05)",
      hardwareWallet: "Zero camouflage",
      metalPlate: "Zero camouflage",
      cloudPassword: "Zero camouflage",
    },
  ];

  return (
    <div className="security-spec-container">
      <div className="section-label">
        <span className="section-label-line" />
        <span>COMPETITIVE ADVANTAGE</span>
        <span className="section-label-line-r" />
      </div>
      <h2 className="section-title">Why StegoVault leads modern Web3 cold storage</h2>
      <p className="section-subtitle">
        StegoVault bridges cryptographic zero-knowledge commitments on Midnight Network with undetectable steganography.
      </p>

      {/* Comparison Table */}
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="th-feature">Security Dimension</th>
              <th className="th-stego">
                <span className="th-badge">★ WINNER</span>
                <span className="th-title">StegoVault</span>
              </th>
              <th>Hardware Wallet</th>
              <th>Steel Backup Plate</th>
              <th>Cloud Manager</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr key={idx}>
                <td className="td-feature">
                  <strong>{row.feature}</strong>
                </td>
                <td className="td-stego">
                  <span className="check-icon">✓</span> {row.stegoVault}
                </td>
                <td className="td-other">{row.hardwareWallet}</td>
                <td className="td-other">{row.metalPlate}</td>
                <td className="td-other">{row.cloudPassword}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cryptographic Standards Verification Grid */}
      <div className="standards-grid">
        <div className="standard-card">
          <div className="standard-badge">AUTHENTICATED CIPHER</div>
          <div className="standard-icon">🔒</div>
          <h4 className="standard-name">AES-256-GCM</h4>
          <p className="standard-detail">
            NIST SP 800-38D authenticated Galois/Counter Mode with 96-bit cryptographic nonce and 128-bit integrity authentication tag.
          </p>
        </div>

        <div className="standard-card">
          <div className="standard-badge">KEY STRETCHING</div>
          <div className="standard-icon">🛡️</div>
          <h4 className="standard-name">PBKDF2-HMAC-SHA256</h4>
          <p className="standard-detail">
            100,000 iterations over user passphrase with cryptographically secure 16-byte random salt, rendering brute-force attacks computationally infeasible.
          </p>
        </div>

        <div className="standard-card">
          <div className="standard-badge">ON-CHAIN VERIFICATION</div>
          <div className="standard-icon">📜</div>
          <h4 className="standard-name">Midnight Compact v0.8.1</h4>
          <p className="standard-detail">
            Zero-knowledge smart contract registers tamper-proof 32-byte SHA-256 commitments on Midnight Preprod testnet.
          </p>
        </div>

        <div className="standard-card">
          <div className="standard-badge">ZERO SERVER CONTACT</div>
          <div className="standard-icon">🌐</div>
          <h4 className="standard-name">Client-Side Isolation</h4>
          <p className="standard-detail">
            All encryption, stego injection, and extraction happen entirely in browser memory. No backend endpoints, databases, or cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
