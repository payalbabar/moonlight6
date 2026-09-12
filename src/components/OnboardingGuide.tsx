import { useState } from "react";

interface OnboardingGuideProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenFeedback?: () => void;
}

const ONBOARDING_STEPS = [
    {
        number: "01",
        title: "Setup 1AM Wallet on Midnight Preprod",
        icon: "⚡",
        badge: "Prerequisite",
        content: (
            <div>
                <p>
                    StegoVault operates on <strong>Midnight Preprod</strong>. You need the official <strong>1AM Wallet browser extension</strong> to sign transactions and bind cryptographic vault commitments.
                </p>
                <div className="guide-bullet-list">
                    <div className="guide-bullet">
                        <span className="bullet-num">1</span>
                        <span>Install 1AM Wallet from <a href="https://1am.xyz" target="_blank" rel="noreferrer" className="guide-link">1am.xyz</a></span>
                    </div>
                    <div className="guide-bullet">
                        <span className="bullet-num">2</span>
                        <span>Switch wallet network selector to <strong>Midnight Preprod</strong></span>
                    </div>
                    <div className="guide-bullet">
                        <span className="bullet-num">3</span>
                        <span>Click <strong>⚡ CONNECT 1AM WALLET</strong> in the StegoVault header</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: "02",
        title: "Prepare a Lossless PNG Cover Image",
        icon: "🖼️",
        badge: "Steganography Rule",
        content: (
            <div>
                <p>
                    LSB steganography embeds encrypted bits into pixel data. To prevent data corruption, StegoVault enforces strict rules:
                </p>
                <div className="guide-tip-box">
                    <strong>⚠️ Lossless PNG Required:</strong> Never use JPG or WebP images, as lossy compression destroys the least significant bits. StegoVault automatically rejects lossy files.
                </div>
                <div className="guide-bullet-list">
                    <div className="guide-bullet">
                        <span className="bullet-num">✓</span>
                        <span>A standard 1920×1080 PNG image holds up to <strong>~259 KB</strong> of encrypted secret data.</span>
                    </div>
                    <div className="guide-bullet">
                        <span className="bullet-num">✓</span>
                        <span>StegoVault packages your sealed image inside an uncompressed <code>stegovault_secure.zip</code> bundle.</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: "03",
        title: "Client-Side AES-256-GCM & ZK Proofs",
        icon: "🔐",
        badge: "Zero-Knowledge",
        content: (
            <div>
                <p>
                    StegoVault guarantees zero sensitive data leaks with a strict privacy boundary:
                </p>
                <div className="guide-privacy-table">
                    <div className="privacy-col privacy-local">
                        <div className="privacy-header">🛡️ 100% In Browser Memory</div>
                        <ul>
                            <li>Plaintext seed phrases &amp; keys</li>
                            <li>PBKDF2 symmetric keys (100,000 iter)</li>
                            <li>AES-256-GCM initialization vectors</li>
                            <li>Uncompressed pixel buffers</li>
                        </ul>
                    </div>
                    <div className="privacy-col privacy-onchain">
                        <div className="privacy-header">📜 On Midnight Ledger</div>
                        <ul>
                            <li>32-byte non-sensitive <code>vault_id</code></li>
                            <li>32-byte ciphertext SHA-256 commitment</li>
                            <li>1AM Wallet identity proof</li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: "04",
        title: "Seal & Recover Your Vault",
        icon: "🔄",
        badge: "Full Workflow",
        content: (
            <div>
                <p>Experience the complete cold-storage lifecycle:</p>
                <div className="guide-workflow-steps">
                    <div className="workflow-step">
                        <strong>1. Seal (The Vault):</strong> Enter your secret, password, and PNG image. Approve the 1AM popup to generate your on-chain commitment and download your <code>stegovault_secure.zip</code>.
                    </div>
                    <div className="workflow-step">
                        <strong>2. Unlock (The Key):</strong> Drop the <code>vault.png</code> from your zip bundle, enter your password, and verify your 1AM wallet identity.
                    </div>
                    <div className="workflow-step">
                        <strong>3. Copy &amp; Clean:</strong> Your secret is safely decrypted into browser memory.
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: "05",
        title: "Provide Feedback & Complete Preprod Loop",
        icon: "💬",
        badge: "Community & Loop",
        content: (
            <div>
                <p>
                    As part of the Level 5 Full Moon evaluation, your feedback directly drives upcoming releases.
                </p>
                <div className="guide-bullet-list">
                    <div className="guide-bullet">
                        <span className="bullet-num">✓</span>
                        <span>Click the <strong>💬 FEEDBACK LOOP</strong> button in the header anytime</span>
                    </div>
                    <div className="guide-bullet">
                        <span className="bullet-num">✓</span>
                        <span>Report UX impressions, contract interaction latency, or feature requests</span>
                    </div>
                    <div className="guide-bullet">
                        <span className="bullet-num">✓</span>
                        <span>All submissions are logged with your Preprod wallet address into the feedback cycle</span>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function OnboardingGuide({ isOpen, onClose, onOpenFeedback }: OnboardingGuideProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    if (!isOpen) return null;

    const currentStep = ONBOARDING_STEPS[currentStepIndex];

    const handleNext = () => {
        if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container onboarding-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className="modal-icon">{currentStep.icon}</span>
                        <div>
                            <div className="onboarding-step-indicator">
                                STEP {currentStep.number} OF {String(ONBOARDING_STEPS.length).padStart(2, "0")} · {currentStep.badge}
                            </div>
                            <h3 className="modal-title">{currentStep.title}</h3>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Progress bar */}
                <div className="onboarding-progress-track">
                    <div
                        className="onboarding-progress-fill"
                        style={{ width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="modal-body onboarding-body">
                    {currentStep.content}
                </div>

                {/* Footer Navigation */}
                <div className="modal-footer onboarding-footer">
                    <button
                        className="btn-secondary"
                        onClick={handlePrev}
                        disabled={currentStepIndex === 0}
                    >
                        ← Back
                    </button>

                    <div className="step-dots">
                        {ONBOARDING_STEPS.map((_, idx) => (
                            <span
                                key={idx}
                                className={`step-dot ${idx === currentStepIndex ? "active" : ""}`}
                                onClick={() => setCurrentStepIndex(idx)}
                            />
                        ))}
                    </div>

                    <div className="footer-action-group">
                        {currentStepIndex === ONBOARDING_STEPS.length - 1 && onOpenFeedback && (
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    onClose();
                                    onOpenFeedback();
                                }}
                            >
                                💬 Open Feedback
                            </button>
                        )}
                        <button className="btn-primary" onClick={handleNext}>
                            {currentStepIndex === ONBOARDING_STEPS.length - 1 ? "Get Started 🚀" : "Next →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
