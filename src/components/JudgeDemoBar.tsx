import { useState, useEffect } from "react";
import { getSoundEnabled, setSoundEnabled, playClickSound } from "../utils/audio";

interface JudgeDemoBarProps {
  onRunInstantDemo?: () => void;
  className?: string;
}

export default function JudgeDemoBar({
  onRunInstantDemo,
  className = "",
}: JudgeDemoBarProps) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  useEffect(() => {
    setIsSoundOn(getSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText("02005a3962e7fbe2bdf55f694e9f7831f28b43820a23223019801648a43697de5c");
    setCopiedContract(true);
    playClickSound();
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <>
      <div className={`judge-demo-bar ${className}`}>
        <div className="judge-demo-left">
          <div className="judge-badge-pulse">
            <span className="judge-radar-dot" />
            <span className="judge-tag">🏆 EVALUATION MODE</span>
          </div>
          <span className="judge-demo-text">
            <strong>Midnight Hackathon:</strong> StegoVault — Steganographic ZK Cold Storage.
            Connect 1AM Wallet → Seal a PNG vault → Verify on Midnight Preprod.
          </span>
        </div>

        <div className="judge-demo-actions">
          {onRunInstantDemo && (
            <button
              type="button"
              className="judge-btn judge-btn-run"
              onClick={() => {
                playClickSound();
                onRunInstantDemo();
              }}
              title="Jump to ZK Circuit Prover visualization"
            >
              <span className="btn-icon">⚡</span>
              <span>ZK Circuit Prover</span>
            </button>
          )}

          <button
            type="button"
            className="judge-btn judge-btn-sheet"
            onClick={() => {
              playClickSound();
              setShowJudgeModal(true);
            }}
          >
            <span className="btn-icon">📋</span>
            <span>Why StegoVault Wins</span>
          </button>

          <button
            type="button"
            className={`judge-sound-toggle ${isSoundOn ? "sound-active" : ""}`}
            onClick={toggleSound}
            title={isSoundOn ? "Mute Cyber Audio FX" : "Enable Cyber Audio FX"}
          >
            {isSoundOn ? "🔊 SFX ON" : "🔇 SFX OFF"}
          </button>
        </div>
      </div>

      {/* Judge Architecture & Value Proposition Sheet */}
      {showJudgeModal && (
        <div className="modal-overlay" onClick={() => setShowJudgeModal(false)}>
          <div className="modal-card judge-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-icon">🏆</span>
                <div>
                  <h2 className="modal-title">StegoVault — Architecture & Value</h2>
                  <p className="modal-subtitle">Midnight Network Hackathon · Full-Stack ZK Application</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowJudgeModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="judge-modal-body">
              {/* Problem → Solution */}
              <div className="judge-prop-grid">
                <div className="judge-prop-card">
                  <div className="judge-prop-icon">😰</div>
                  <h4>The Problem</h4>
                  <p>
                    Hardware wallets, paper seeds, and metal backups are visible targets. Border confiscation,
                    physical coercion ("$5 wrench attacks"), and home burglary can expose crypto holdings
                    just by finding the backup medium.
                  </p>
                </div>

                <div className="judge-prop-card highlight">
                  <div className="judge-prop-icon">👁️‍🗨️</div>
                  <h4>Our Solution: Plausible Deniability</h4>
                  <p>
                    StegoVault hides seed phrases inside ordinary PNG images using AES-256-GCM + LSB steganography.
                    The carrier image looks like any photo. No one can even <em>prove</em> a secret exists.
                  </p>
                </div>

                <div className="judge-prop-card">
                  <div className="judge-prop-icon">🌙</div>
                  <h4>Midnight ZK Layer</h4>
                  <p>
                    A Compact smart contract on Midnight Preprod anchors a tamper-proof SHA-256 commitment
                    of the encrypted payload. Verification is ZK — identity and contents stay private.
                  </p>
                </div>
              </div>

              {/* Technical Stack */}
              <div className="judge-tech-box">
                <h4 className="tech-box-title">⚡ Full Technical Stack</h4>
                <div className="tech-badge-row">
                  <span className="tech-pill">Midnight Compact 0.2.0</span>
                  <span className="tech-pill">1AM Web3 Wallet</span>
                  <span className="tech-pill">AES-256-GCM (Auth Enc)</span>
                  <span className="tech-pill">PBKDF2-SHA512 · 100k ops</span>
                  <span className="tech-pill">LSB Blue-Channel Steganography</span>
                  <span className="tech-pill">PRNG Fisher-Yates Dispersion</span>
                  <span className="tech-pill">100% Client-Side · Zero Servers</span>
                  <span className="tech-pill">React + TypeScript + Vite</span>
                </div>
                <div className="contract-copy-row">
                  <span className="contract-label">Compact Contract Address:</span>
                  <code className="contract-code">02005a3962e7fbe2bdf55f694e9f7831f28b43820a23223019801648a43697de5c</code>
                  <button type="button" className="copy-btn-mini" onClick={handleCopyContract}>
                    {copiedContract ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Security Architecture */}
              <div className="judge-audit-summary">
                <div className="audit-item">
                  <span className="audit-check">✅</span>
                  <span><strong>Cryptographic Integrity:</strong> 128-bit GCM authentication tag — any pixel tampering immediately causes decryption failure.</span>
                </div>
                <div className="audit-item">
                  <span className="audit-check">✅</span>
                  <span><strong>Statistical Stealth:</strong> PRNG-dispersed LSB embedding; steganalysis tools cannot detect payload presence without the key.</span>
                </div>
                <div className="audit-item">
                  <span className="audit-check">✅</span>
                  <span><strong>On-Chain Commitment:</strong> SHA-256 hash of ciphertext anchored on Midnight Preprod — tamper-evident without revealing secrets.</span>
                </div>
                <div className="audit-item">
                  <span className="audit-check">✅</span>
                  <span><strong>Zero Network Dependency:</strong> Encryption/decryption runs entirely in browser Web Crypto API. No backend, no telemetry, no tracking.</span>
                </div>
              </div>

              {/* How to Test */}
              <div className="judge-test-guide">
                <h4 className="test-guide-title">🚀 How to Test (60 seconds)</h4>
                <ol className="test-guide-steps">
                  <li>Install & connect <strong>1AM Wallet</strong> browser extension (Midnight Preprod).</li>
                  <li>Go to <strong>Seal Vault</strong> tab → Upload any lossless PNG image.</li>
                  <li>Enter your seed phrase/secret, set a strong password, and click <strong>Seal the Vault</strong>.</li>
                  <li>Wallet will prompt for on-chain authorization → download <code>stegovault_secure.zip</code>.</li>
                  <li>Go to <strong>Unlock Vault</strong> tab → Upload the stego PNG → Enter password → Click Unlock.</li>
                  <li>Your secret is revealed locally — never left your browser.</li>
                </ol>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowJudgeModal(false)}
              >
                Close
              </button>
              <a
                href="https://github.com/payalbabar/moonlight4"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                📂 View Source Code
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
