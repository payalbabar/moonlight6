import { useState } from "react";
import { playClickSound } from "../utils/audio";

interface JudgeDemoBarProps {
  onRunInstantDemo?: () => void;
  className?: string;
}

export default function JudgeDemoBar({
  onRunInstantDemo,
  className = "",
}: JudgeDemoBarProps) {
  const [showJudgeModal, setShowJudgeModal] = useState(false);

  return (
    <>
      <div className={`eval rv ${className}`}>
        <span className="tagx">
          <i className="dot" />
          EVALUATION MODE
        </span>
        <span className="evt">
          <b>Midnight Hackathon:</b> StegoVault — Steganographic ZK Cold Storage. Connect 1AM Wallet → Seal a PNG vault → Verify on Midnight Preprod.
        </span>
        <div className="evb">
          {onRunInstantDemo && (
            <button
              type="button"
              className="btn s p"
              onClick={() => {
                playClickSound();
                onRunInstantDemo();
              }}
              title="Jump to ZK Circuit Prover visualization"
            >
              ZK Circuit Prover
            </button>
          )}

          <button
            type="button"
            className="btn s"
            onClick={() => {
              playClickSound();
              setShowJudgeModal(true);
            }}
          >
            Why StegoVault Wins
          </button>
        </div>
      </div>

      {/* Judge Sheet */}
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
              <div className="judge-prop-grid">
                <div className="judge-prop-card">
                  <h4>The Problem</h4>
                  <p>
                    Hardware wallets, paper seeds, and metal backups are visible targets. Border confiscation,
                    physical coercion, and home burglary expose crypto holdings.
                  </p>
                </div>
                <div className="judge-prop-card highlight">
                  <h4>The StegoVault Solution</h4>
                  <p>
                    Hides AES-256-GCM encrypted secrets inside harmless PNG digital artwork using LSB steganography,
                    authorized on-chain via Midnight ZK proofs &amp; 1AM Wallet.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowJudgeModal(false)}>
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
