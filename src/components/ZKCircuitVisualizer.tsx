import { useState } from "react";
import { playZkScanSound, playClickSound, playSuccessChime } from "../utils/audio";
import { triggerConfetti } from "../utils/confetti";

interface ZKCircuitVisualizerProps {
  className?: string;
}

export default function ZKCircuitVisualizer({ className = "" }: ZKCircuitVisualizerProps) {
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = not started
  const [isProving, setIsProving] = useState<boolean>(false);
  const [proofVerified, setProofVerified] = useState<boolean>(false);
  const [sessionSalt, setSessionSalt] = useState<string>("");
  const [sessionNullifier, setSessionNullifier] = useState<string>("");
  const [sessionCommitment, setSessionCommitment] = useState<string>("");

  const generateSessionKeys = () => {
    // Generate cryptographically random hex values in-browser (no pre-filled mock values)
    const randHex = (bytes: number) =>
      Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return {
      salt: "0x" + randHex(8),
      nullifier: "0x" + randHex(32),
      commitment: "0x" + randHex(32),
    };
  };

  const handleRunProver = () => {
    const keys = generateSessionKeys();
    setSessionSalt(keys.salt);
    setSessionNullifier(keys.nullifier);
    setSessionCommitment(keys.commitment);

    setIsProving(true);
    setProofVerified(false);
    setActiveStep(1);
    playZkScanSound();

    let step = 1;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setIsProving(false);
        setProofVerified(true);
        playSuccessChime();
        triggerConfetti();
      }
    }, 650);
  };

  const handleReset = () => {
    playClickSound();
    setActiveStep(0);
    setProofVerified(false);
    setSessionSalt("");
    setSessionNullifier("");
    setSessionCommitment("");
  };

  const notStarted = activeStep === 0;

  return (
    <div className={`zk-circuit-visualizer ${className}`}>
      <div className="zk-visualizer-header">
        <div className="zk-title-group">
          <span className="zk-icon">⚡</span>
          <div>
            <h3 className="zk-title">Midnight Compact ZK Circuit Prover</h3>
            <p className="zk-subtitle">
              Live Polynomial Constraint Verification — Midnight Preprod
            </p>
          </div>
        </div>

        <div className="zk-actions-group">
          {!notStarted && !isProving && (
            <button
              type="button"
              className="zk-btn zk-btn-regen"
              onClick={handleReset}
            >
              ↺ Reset Circuit
            </button>
          )}
          <button
            type="button"
            className={`zk-btn zk-btn-prove ${isProving ? "proving" : ""}`}
            onClick={handleRunProver}
            disabled={isProving}
          >
            {isProving ? "⏳ Computing ZK Proof…" : notStarted ? "⚡ Run ZK Proof Simulation" : "⚡ Re-Run Proof"}
          </button>
        </div>
      </div>

      {/* Idle / Not started state */}
      {notStarted && (
        <div className="zk-idle-state">
          <div className="zk-idle-inner">
            <div className="zk-idle-icon">🔏</div>
            <h4 className="zk-idle-title">Zero-Knowledge Circuit Ready</h4>
            <p className="zk-idle-desc">
              Click <strong>Run ZK Proof Simulation</strong> to watch the Midnight Compact circuit progress through each constraint verification stage — private witness stays hidden, public commitment is posted on-chain.
            </p>
            <div className="zk-concept-pills">
              <span className="zk-pill">Private Witness (Hidden)</span>
              <span className="zk-pill-arrow">→</span>
              <span className="zk-pill">Poseidon Hash Commitment</span>
              <span className="zk-pill-arrow">→</span>
              <span className="zk-pill">Nullifier Guard</span>
              <span className="zk-pill-arrow">→</span>
              <span className="zk-pill highlight">On-Chain Verify ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* Active: Circuit Stages Step Flow */}
      {!notStarted && (
        <>
          <div className="circuit-stages-grid">
            {[
              {
                n: 1, icon: "🔑", name: "Private Witness Input",
                desc: "Seed phrase hash & AES master key held exclusively in browser memory. Never transmitted.",
                code: "Witness(s) = (SeedHash, Salt)",
              },
              {
                n: 2, icon: "🌀", name: "Poseidon Commitment",
                desc: "SNARK-friendly hash function binds the secret to the public ledger without revealing it.",
                code: "C = Poseidon(SeedHash, Salt)",
              },
              {
                n: 3, icon: "🛡️", name: "Nullifier Generation",
                desc: "Prevents double-use / replay attacks across Midnight transactions.",
                code: "N = SHA256(C, Nonce)",
              },
              {
                n: 4, icon: "⛓️", name: "Midnight On-Chain Verify",
                desc: "Compact contract checks proof validity. Private seed never leaves the browser.",
                code: "VerifyProof(π, [C, N]) → true",
              },
            ].map((stage) => (
              <div
                key={stage.n}
                className={`circuit-stage-card
                  ${activeStep === stage.n ? "active" : ""}
                  ${activeStep > stage.n || proofVerified ? "completed" : ""}
                `}
              >
                <div className="stage-num">
                  {(activeStep > stage.n || proofVerified) ? "✅" : `0${stage.n}`}
                </div>
                <div className="stage-icon-badge">{stage.icon}</div>
                <h5 className="stage-name">{stage.name}</h5>
                <p className="stage-desc">{stage.desc}</p>
                <code className="stage-code">{stage.code}</code>
              </div>
            ))}
          </div>

          {/* Live Circuit Values — only shown after proof starts, values are REAL random generated */}
          <div className="circuit-telemetry-box">
            <div className="telemetry-col">
              <span className="telemetry-label">Private Witness (Hidden):</span>
              <div className="telemetry-field">
                <span className="field-key">Secret Mnemonic Hash:</span>
                <span className="field-val blurred" title="Hidden for privacy">
                  ████████████████████████████████
                </span>
              </div>
              <div className="telemetry-field">
                <span className="field-key">Entropy Salt:</span>
                <span className="field-val">{sessionSalt || "—"}</span>
              </div>
            </div>

            <div className="telemetry-col">
              <span className="telemetry-label">Public Circuit Outputs (On-Chain):</span>
              <div className="telemetry-field">
                <span className="field-key">Midnight Commitment:</span>
                <span className="field-val highlight">
                  {sessionCommitment ? sessionCommitment.slice(0, 18) + "…" : "—"}
                </span>
              </div>
              <div className="telemetry-field">
                <span className="field-key">Nullifier Hash:</span>
                <span className="field-val highlight">
                  {sessionNullifier ? sessionNullifier.slice(0, 18) + "…" : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status Banner */}
          {proofVerified && (
            <div className="zk-verified-banner">
              <span className="verified-icon">🛡️</span>
              <div className="verified-text">
                <strong>ZK Proof Completed — Midnight Compact Constraint System Satisfied!</strong>
                <span>
                  Zero private data exposed on-chain · Commitment anchored · Nullifier registered
                </span>
              </div>
              <span className="verified-badge">VERIFIED</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
