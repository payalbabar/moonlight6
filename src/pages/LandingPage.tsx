import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { use1AMWallet } from "../hooks/use1AMWallet";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isConnected, account, isConnecting, connect, disconnect } = use1AMWallet();
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleLaunch = () => {
        navigate("/app");
    };

    const handleConnect = async () => {
        try {
            await connect();
        } catch {
            // error handled in context
        }
    };

    const scrollToHowItWorks = () => {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="landing-page">
            {/* Top Navigation */}
            <nav className="landing-nav" aria-label="Main Navigation">
                <div className="landing-nav-content">
                    <div className="landing-nav-logo" onClick={() => navigate("/")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && navigate("/")}>
                        <svg viewBox="0 0 40 40" className="nav-logo-icon" aria-hidden="true">
                            <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" fill="none" />
                            <rect x="10" y="16" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M14 16V12a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                        <span className="nav-logo-text">STEGOVAULT</span>
                    </div>

                    <div className="landing-nav-links">
                        <button className="nav-link-btn" onClick={() => setIsGuideOpen(true)}>
                            📖 Quick Start
                        </button>
                        <button className="nav-link-btn nav-link-feedback" onClick={() => setIsFeedbackOpen(true)}>
                            💬 Feedback
                        </button>
                        <a
                            href="https://x.com/StegoVaultWeb3"
                            target="_blank"
                            rel="noreferrer"
                            className="nav-link-btn"
                            aria-label="Product X Profile"
                        >
                            𝕏 Profile
                        </a>
                        <button className="nav-cta-btn" onClick={handleLaunch}>
                            Launch StegoVault →
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" aria-label="Introduction">
                <div className="hero-content fade-in">
                    <div className="hero-icon-wrapper">
                        <svg viewBox="0 0 100 100" className="hero-lock-icon" aria-hidden="true">
                            <rect x="10" y="30" width="80" height="60" rx="8" className="lock-body" />
                            <circle cx="50" cy="55" r="10" className="lock-keyhole" />
                            <path d="M30 30V20a20 20 0 0 1 40 0v10" className="lock-shackle" />
                            <circle cx="50" cy="50" r="45" className="glow-circle" />
                        </svg>
                    </div>

                    <h1 className="hero-title">
                        <span className="gradient-text">STEGOVAULT</span>
                    </h1>

                    <p className="hero-tagline-main">
                        Encrypt locally. Hide securely. Verify privately.
                    </p>

                    <p className="hero-subtitle">
                        Privacy-focused client-side cold storage powered by <strong>Midnight Network</strong> + <strong>1AM Wallet</strong>.
                    </p>

                    <p className="hero-description">
                        Protect seed phrases and confidential credentials using <strong>AES-256-GCM authenticated encryption</strong>,{" "}
                        <strong>lossless LSB steganography</strong>, and <strong>1AM Wallet on-chain commitments</strong>.
                        100% of sensitive data stays in your browser memory.
                    </p>

                    {/* Hero CTAs */}
                    <div className="hero-cta-group">
                        <button className="cta-button hero-primary-cta" onClick={handleLaunch}>
                            <span className="cta-text">LAUNCH STEGOVAULT</span>
                            <span className="cta-arrow">→</span>
                        </button>
                        <button className="cta-button-secondary" onClick={scrollToHowItWorks}>
                            <span>Learn How It Works ↓</span>
                        </button>
                    </div>

                    <div className="hero-badges">
                        <span className="badge-item">
                            <span className="badge-icon">⚡</span> 1AM Wallet
                        </span>
                        <span className="badge-item">
                            <span className="badge-icon">📜</span> Compact Smart Contract
                        </span>
                        <span className="badge-item">
                            <span className="badge-icon">🔐</span> AES-256-GCM
                        </span>
                        <span className="badge-item">
                            <span className="badge-icon">🖼️</span> PNG LSB Steganography
                        </span>
                        <span className="badge-item">
                            <span className="badge-icon">💻</span> 100% Client-Side
                        </span>
                    </div>

                    {/* 1AM Wallet Quick Connection Status */}
                    <div className="landing-wallet-panel">
                        {!isConnected ? (
                            <button
                                className="cta-button landing-wallet-btn"
                                onClick={handleConnect}
                                disabled={isConnecting}
                                aria-label="Connect 1AM Wallet"
                            >
                                {isConnecting ? (
                                    <span className="btn-loading">
                                        <span className="spinner" /> Connecting…
                                    </span>
                                ) : (
                                    <>
                                        <span className="wallet-btn-icon">⚡</span>
                                        <span className="cta-text">CONNECT 1AM WALLET</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="landing-wallet-connected">
                                <div className="landing-connected-info">
                                    <span className="landing-status-dot" />
                                    <span className="landing-connected-label">Wallet Connected</span>
                                    <span className="landing-address">
                                        {account?.slice(0, 8)}...{account?.slice(-6)}
                                    </span>
                                </div>
                                <div className="landing-wallet-actions">
                                    <button className="cta-button" onClick={handleLaunch}>
                                        <span className="cta-text">LAUNCH STEGOVAULT</span>
                                        <span className="cta-arrow">→</span>
                                    </button>
                                    <button className="landing-disconnect-btn" onClick={disconnect}>
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}
                        {!isConnected && (
                            <p className="landing-wallet-note">
                                Built exclusively for <strong>1AM Wallet</strong> on Midnight Preprod.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works (Simple 6-Step Flow) */}
            <section id="how-it-works" className="how-it-works" aria-label="How StegoVault Works">
                <h2 className="section-title">
                    <span className="title-line"></span>
                    HOW IT WORKS
                    <span className="title-line"></span>
                </h2>

                <div className="steps-grid steps-grid-6">
                    <div className="step-card">
                        <div className="step-number">01</div>
                        <div className="step-icon">⚡</div>
                        <h3 className="step-title">Connect 1AM Wallet</h3>
                        <p className="step-description">
                            Connect your <strong>1AM Wallet</strong> extension to authenticate your Midnight Preprod identity safely.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>
                        <div className="step-icon">🔐</div>
                        <h3 className="step-title">Encrypt Secret Locally</h3>
                        <p className="step-description">
                            Your seed phrase is encrypted in browser memory via <strong>PBKDF2</strong> (100k iterations) and <strong>AES-256-GCM</strong>.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>
                        <div className="step-icon">📜</div>
                        <h3 className="step-title">Create Commitment</h3>
                        <p className="step-description">
                            A non-sensitive commitment digest is recorded on the <strong>Compact smart contract</strong> using 1AM Wallet.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">04</div>
                        <div className="step-icon">🎨</div>
                        <h3 className="step-title">Hide Inside PNG</h3>
                        <p className="step-description">
                            The encrypted ciphertext is embedded into the <strong>blue-channel LSBs</strong> of an ordinary cover PNG image.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">05</div>
                        <div className="step-icon">📦</div>
                        <h3 className="step-title">Store Vault Securely</h3>
                        <p className="step-description">
                            Download the uncompressed <strong>`stegovault_secure.zip`</strong> archive for offline, air-gapped cold storage.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">06</div>
                        <div className="step-icon">🔓</div>
                        <h3 className="step-title">Recover When Needed</h3>
                        <p className="step-description">
                            Upload `vault.png`, verify 1AM Wallet identity, enter your password, and recover your secret locally.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy / Security Guarantees */}
            <section className="features-section" aria-label="Privacy and Security Guarantees">
                <h2 className="section-title">
                    <span className="title-line"></span>
                    PRIVACY &amp; SECURITY GUARANTEES
                    <span className="title-line"></span>
                </h2>

                <div className="features-grid three-layers-grid">
                    <div className="feature-card layer-card layer-wallet">
                        <div className="layer-badge">LOCAL PRIVACY</div>
                        <div className="feature-icon">💻</div>
                        <h3 className="feature-title">Secrets Stay Client-Side</h3>
                        <p className="feature-text">
                            Plaintext seed phrases, passwords, and encryption keys never leave browser memory. Zero cloud databases or external APIs.
                        </p>
                    </div>

                    <div className="feature-card layer-card layer-crypto">
                        <div className="layer-badge">BLOCKCHAIN IDENTITY</div>
                        <div className="feature-icon">📜</div>
                        <h3 className="feature-title">Midnight Commitments</h3>
                        <p className="feature-text">
                            Midnight Compact contracts handle only non-sensitive 32-byte content hashes and vault IDs. No sensitive payload goes on-chain.
                        </p>
                    </div>

                    <div className="feature-card layer-card layer-stego">
                        <div className="layer-badge">STEGANOGRAPHY</div>
                        <div className="feature-icon">🖼️</div>
                        <h3 className="feature-title">Lossless PNG Storage</h3>
                        <p className="feature-text">
                            Lossless PNG pixel storage guarantees exact bitstream preservation. Lossy formats (JPEG/WebP) are strictly rejected.
                        </p>
                    </div>
                </div>

                <div className="security-note">
                    <span className="security-note-icon">ℹ️</span>
                    StegoVault encrypts your secrets locally in browser volatile memory.
                    Midnight Network &amp; 1AM Wallet authorize non-sensitive cryptographic commitments without exposing your private payload.
                </div>
            </section>

            {/* Technology Stack Grid */}
            <section className="features-section features-section-secondary" aria-label="Technology Stack">
                <h2 className="section-title">
                    <span className="title-line"></span>
                    TECHNOLOGY STACK
                    <span className="title-line"></span>
                </h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">1AM Wallet</h3>
                        <p className="feature-text">
                            Native DApp connector integration (`window.midnight["1am"]`) for Bech32m identity authorization.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📜</div>
                        <h3 className="feature-title">Midnight Network</h3>
                        <p className="feature-text">
                            Privacy-first ledger providing zero-knowledge authorization and timestamped commitment registries.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🧠</div>
                        <h3 className="feature-title">Compact Smart Contract</h3>
                        <p className="feature-text">
                            Native `stegovault.compact` contract storing immutable `vault_id` and `content_hash` pairs on-chain.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3 className="feature-title">AES-256-GCM</h3>
                        <p className="feature-text">
                            NIST SP 800-38D authenticated encryption preventing bit-flipping and tampering attacks.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔑</div>
                        <h3 className="feature-title">PBKDF2 Key Derivation</h3>
                        <p className="feature-text">
                            100,000 iterations of HMAC-SHA256 with 16-byte random salt to protect against dictionary attacks.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">👁️</div>
                        <h3 className="feature-title">PNG LSB Steganography</h3>
                        <p className="feature-text">
                            Blue-channel least significant bit injection with 32-bit uint32 length header validation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="cta-section" aria-label="Get Started Call to Action">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Create Your Vault?</h2>
                    <p className="cta-subtitle">
                        Connect your 1AM Wallet and experience privacy-focused cold storage on Midnight Preprod today.
                        No signups. No central servers. Pure client-side cryptography.
                    </p>
                    <button className="cta-button cta-button-large" onClick={handleLaunch}>
                        <span className="cta-text">CREATE YOUR VAULT NOW</span>
                        <span className="cta-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer" role="contentinfo">
                <div className="footer-content">
                    <div className="footer-logo">
                        <svg viewBox="0 0 40 40" className="footer-icon" aria-hidden="true">
                            <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" fill="none" />
                            <rect x="10" y="16" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M14 16V12a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                        <span>STEGOVAULT</span>
                    </div>
                    <div className="footer-links-row">
                        <button className="footer-link-btn" onClick={() => setIsGuideOpen(true)}>📖 Quick Start</button>
                        <span className="footer-sep">•</span>
                        <button className="footer-link-btn" onClick={() => setIsFeedbackOpen(true)}>💬 Feedback Loop</button>
                        <span className="footer-sep">•</span>
                        <a href="https://github.com/payalbabar/moonlight4" target="_blank" rel="noreferrer" className="footer-link-btn">GitHub Repo</a>
                        <span className="footer-sep">•</span>
                        <a href="https://x.com/StegoVaultWeb3" target="_blank" rel="noreferrer" className="footer-link-btn">Product X Profile</a>
                    </div>
                    <p className="footer-text">
                        Your secrets, your 1AM Wallet, your control.
                    </p>
                    <p className="footer-copyright">
                        © 2026 StegoVault. Open Source. Client-Side Cryptography. Midnight Network &amp; 1AM Wallet Exclusive.
                    </p>
                </div>
            </footer>

            {/* Modals */}
            <OnboardingGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
            />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </div>
    );
}
