import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { use1AMWallet } from "../hooks/use1AMWallet";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";
import Logo from "../components/Logo";
import StegoPlayground from "../components/StegoPlayground";
import StegoDifferenceVisualizer from "../components/StegoDifferenceVisualizer";
import ZKCircuitVisualizer from "../components/ZKCircuitVisualizer";
import JudgeDemoBar from "../components/JudgeDemoBar";
import CapacityCalculator from "../components/CapacityCalculator";
import SecuritySpecMatrix from "../components/SecuritySpecMatrix";
import { playClickSound } from "../utils/audio";

export default function LandingPage() {
    const navigate = useNavigate();
    const { isConnected, account, isConnecting, connect, disconnect } = use1AMWallet();
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleLaunch = () => {
        playClickSound();
        navigate("/app");
    };

    const handleConnect = async () => {
        playClickSound();
        try {
            await connect();
        } catch {
            // error handled in context
        }
    };

    const scrollToHowItWorks = () => {
        playClickSound();
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToPlayground = () => {
        playClickSound();
        document.getElementById("live-demo-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleFaq = (idx: number) => {
        playClickSound();
        setOpenFaq(openFaq === idx ? null : idx);
    };

    const faqs = [
        {
            q: "How does StegoVault hide data inside an ordinary PNG image?",
            a: "StegoVault uses Least Significant Bit (LSB) steganography on the blue color channel of lossless PNG images. By altering only the lowest-order bit of each pixel, the color shift (ΔE < 0.05) is completely imperceptible to human eyes and standard digital scanners, while holding 100% of encrypted payload bits."
        },
        {
            q: "What role does Midnight Network and the Compact smart contract play?",
            a: "Midnight Network provides zero-knowledge on-chain commitments. When you seal a vault, a tamper-proof 32-byte SHA-256 hash of your encrypted payload is committed to the Compact smart contract. During recovery, the contract verifies the authenticity and timestamp of your vault without ever revealing the underlying secret."
        },
        {
            q: "Are my secret seed phrases or private keys ever sent to a server?",
            a: "Never. StegoVault runs 100% client-side inside your browser memory using Web Crypto APIs (PBKDF2 with 100,000 iterations and NIST SP 800-38D AES-256-GCM). There are zero remote backend servers, databases, or tracking telemetry."
        },
        {
            q: "Why does StegoVault require lossless PNG format instead of JPEG?",
            a: "JPEG and WebP use lossy compression algorithms that quantize and discard high-frequency pixel data, destroying any embedded steganographic bits. StegoVault strictly enforces lossless PNG formatting and bundles files in uncompressed ZIP archives to preserve total bit integrity."
        },
        {
            q: "What if someone steals or finds my cover image?",
            a: "Even if an adversary finds your PNG image, it appears as an ordinary wallpaper or photo. Even if they suspect steganography, the payload is locked with authenticated AES-256-GCM encryption with a 128-bit MAC tag and PBKDF2 key stretching. Without your master password and authorized 1AM Wallet, decryption is computationally impossible."
        }
    ];

    return (
        <div className="landing-page">
            {/* Hackathon Evaluation Quick Mode */}
            <JudgeDemoBar
                onRunInstantDemo={() => {
                    navigate("/app");
                }}
            />

            {/* Top Navigation */}
            <nav className="landing-nav" aria-label="Main Navigation">
                <div className="landing-nav-inner">
                    <div
                        className="nav-logo"
                        onClick={() => navigate("/")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <Logo size="md" />
                    </div>

                    <div className="nav-actions">
                        <button className="nav-link-btn" onClick={scrollToPlayground}>
                            🔬 Live Lab
                        </button>
                        <button className="nav-link-btn" onClick={() => setIsGuideOpen(true)}>
                            📖 Quick Start
                        </button>
                        <button className="nav-link-btn" onClick={() => setIsFeedbackOpen(true)}>
                            💬 Feedback
                        </button>
                        <a
                            href="https://x.com/StegoVaultWeb3"
                            target="_blank"
                            rel="noreferrer"
                            className="nav-network-pill"
                            style={{ textDecoration: "none", color: "inherit" }}
                            aria-label="Product X Profile"
                        >
                            <span>𝕏 @StegoVaultWeb3</span>
                        </a>
                        <div className="nav-network-pill">
                            <span className="nav-dot" />
                            <span>Midnight Preprod</span>
                        </div>
                        <button className="btn-launch" onClick={handleLaunch}>
                            Launch App →
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" aria-label="Introduction">
                <div className="orb orb-1" aria-hidden="true" />
                <div className="orb orb-2" aria-hidden="true" />
                <div className="orb orb-3" aria-hidden="true" />
                <div className="orb orb-4" aria-hidden="true" />
                <div className="hero-grid-overlay" aria-hidden="true" />
                <div className="hero-scan-line" aria-hidden="true" />

                <div className="hero-content fade-in">
                    <div className="hero-eyebrow">
                        <span className="glow-dot" />
                        <span>LIVE ON MIDNIGHT PREPROD · 1AM WALLET INTEGRATED</span>
                    </div>

                    <h1 className="hero-title">
                        Conceal your crypto secrets <br />
                        <span className="hero-title-accent">inside ordinary image pixels</span>
                    </h1>

                    <p className="hero-description">
                        Military-grade <strong>AES-256-GCM authenticated encryption</strong> meets lossless <strong>LSB steganography</strong> and <strong>Midnight Zero-Knowledge</strong> smart contracts.
                        Hide seed phrases, private keys, and cold credentials in plain sight — <strong>100% client-side, zero servers</strong>.
                    </p>

                    <div className="hero-tech-row">
                        <div className="tech-badge">
                            <span className="tech-badge-icon">⚡</span>
                            <span>1AM Wallet</span>
                        </div>
                        <div className="tech-badge">
                            <span className="tech-badge-icon">📜</span>
                            <span>Compact ZK Contract</span>
                        </div>
                        <div className="tech-badge">
                            <span className="tech-badge-icon">🔐</span>
                            <span>AES-256-GCM (100k PBKDF2)</span>
                        </div>
                        <div className="tech-badge">
                            <span className="tech-badge-icon">🖼️</span>
                            <span>Lossless LSB Stego</span>
                        </div>
                        <div className="tech-badge">
                            <span className="tech-badge-icon">🌐</span>
                            <span>100% Browser Memory</span>
                        </div>
                    </div>

                    {/* Hero CTA Area */}
                    <div className="hero-cta-group">
                        <div className="hero-wallet-area">
                            {!isConnected ? (
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                                    <button
                                        className="cta-primary"
                                        onClick={handleConnect}
                                        disabled={isConnecting}
                                        aria-label="Connect 1AM Wallet"
                                    >
                                        {isConnecting ? (
                                            <span className="btn-loading">
                                                <span className="spinner" /> Connecting 1AM Wallet…
                                            </span>
                                        ) : (
                                            <span>⚡ Connect 1AM Wallet</span>
                                        )}
                                    </button>
                                    <button
                                        className="cta-secondary"
                                        onClick={handleLaunch}
                                    >
                                        Open Web App →
                                    </button>
                                </div>
                            ) : (
                                <div className="connected-wallet-card">
                                    <div className="connected-wallet-info">
                                        <span className="connected-dot" />
                                        <div>
                                            <div className="connected-label">1AM Wallet Connected</div>
                                            <div className="connected-address">
                                                {account ? `${account.slice(0, 10)}...${account.slice(-6)}` : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="connected-actions">
                                        <button className="btn-launch" onClick={handleLaunch}>
                                            Launch Workspace →
                                        </button>
                                        <button className="btn-disconnect-small" onClick={disconnect}>
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="cta-note">
                            Zero data transmitted to remote servers. Everything executes in your local browser memory.{" "}
                            <button type="button" onClick={scrollToHowItWorks} className="btn-link-reset" style={{ color: "var(--blue)", marginLeft: "0.25rem", cursor: "pointer" }}>
                                View Cryptographic Architecture ↓
                            </button>
                        </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">AES-256</span>
                            <span className="hero-stat-label">Galois/Counter Mode</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">100k</span>
                            <span className="hero-stat-label">PBKDF2-HMAC rounds</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">0 bytes</span>
                            <span className="hero-stat-label">Server telemetry</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-value">&lt; 0.05</span>
                            <span className="hero-stat-label">Perceptual color delta ΔE</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ticker Marquee Strip */}
            <div className="ticker-strip" aria-hidden="true">
                <div className="ticker-inner">
                    {[0,1].map((i) => (
                        <div key={i} style={{ display: "inline-flex", gap: "3rem", alignItems: "center" }}>
                            <span className="ticker-item"><span className="ticker-dot" />AES-256-GCM Authenticated Encryption</span>
                            <span className="ticker-item"><span className="ticker-dot" />PBKDF2-HMAC-SHA256 &middot; 100k Iterations</span>
                            <span className="ticker-item"><span className="ticker-dot" />Midnight ZK Compact v0.8.1</span>
                            <span className="ticker-item"><span className="ticker-dot" />LSB Steganography &middot; &Delta;E &lt; 0.05</span>
                            <span className="ticker-item"><span className="ticker-dot" />100% Client-Side &middot; Zero Servers</span>
                            <span className="ticker-item"><span className="ticker-dot" />1AM Wallet &middot; Midnight Preprod</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Divider */}
            <div className="section-divider" aria-hidden="true" />

            {/* Live Interactive Lab / Playground Section */}
            <section id="live-demo-section" className="lab-section" aria-label="Live Steganography Simulator">
                <div className="section-inner" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                    <div>
                        <div className="section-label">
                            <span className="section-label-line" />
                            <span>HANDS-ON SIMULATOR &amp; ZK PROVER</span>
                            <span className="section-label-line-r" />
                        </div>
                        <h2 className="section-title">Interactive Cryptography &amp; Stego Inspector</h2>
                        <p className="section-subtitle">
                            Inspect pixel-level bitplane dispersions, test live LSB steganography, and run the Midnight ZK prover.
                        </p>
                    </div>

                    <StegoDifferenceVisualizer />
                    <ZKCircuitVisualizer />
                    <StegoPlayground />
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider" aria-hidden="true" />

            {/* How It Works (4-Step Flow) */}
            <section id="how-it-works" className="how-section" aria-label="How StegoVault Works">
                <div className="section-inner">
                    <div className="section-label">
                        <span className="section-label-line" />
                        <span>THE PROTOCOL</span>
                        <span className="section-label-line-r" />
                    </div>
                    <h2 className="section-title">Four stages of air-gapped security</h2>
                    <p className="section-subtitle">
                        From client-side cryptography to immutable zero-knowledge on-chain commitments.
                    </p>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-num">STEP 01</div>
                            <div className="step-icon-wrap">⚡</div>
                            <h3 className="step-title">Connect 1AM Wallet</h3>
                            <p className="step-description">
                                Authorize your session using the official Midnight Preprod <strong>1AM Wallet</strong> browser extension.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-num">STEP 02</div>
                            <div className="step-icon-wrap">🔒</div>
                            <h3 className="step-title">Encrypt Locally</h3>
                            <p className="step-description">
                                AES-256-GCM authenticated encryption derives a key via <strong>PBKDF2</strong> (100,000 iterations).
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-num">STEP 03</div>
                            <div className="step-icon-wrap">📜</div>
                            <h3 className="step-title">Commit On-Chain</h3>
                            <p className="step-description">
                                Register an immutable 32-byte content hash on the <strong>Compact smart contract</strong>.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-num">STEP 04</div>
                            <div className="step-icon-wrap">🖼️</div>
                            <h3 className="step-title">Hide in Plain Sight</h3>
                            <p className="step-description">
                                Inject ciphertext bits into the lossless blue-channel of your cover <strong>PNG image</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider" aria-hidden="true" />

            {/* Bit Capacity & Security Gauge Calculator */}
            <section className="calc-section" aria-label="Capacity Calculator">
                <div className="section-inner">
                    <CapacityCalculator />
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider" aria-hidden="true" />

            {/* Competitive Advantage & Cryptographic Specification Matrix */}
            <section className="spec-section" aria-label="Security Specifications & Comparison">
                <div className="section-inner">
                    <SecuritySpecMatrix />
                </div>
            </section>

            {/* Built for Real Security Section */}
            <section className="why-section" aria-label="Why StegoVault">
                <div className="section-inner">
                    <div className="section-label">
                        <span className="section-label-line" />
                        <span>WHY STEGOVAULT</span>
                        <span className="section-label-line-r" />
                    </div>
                    <h2 className="section-title">Built for real security, not theater</h2>
                    <p className="section-subtitle">
                        Engineered for developers, validators, and Web3 builders who demand airgapped key protection.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrap">🌐</div>
                            <h3 className="feature-title">Zero Server Dependency</h3>
                            <p className="feature-text">
                                100% client-side execution in browser memory. No backend databases, analytics trackers, or external APIs.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrap">⚡</div>
                            <h3 className="feature-title">Wallet-Bound Vaults</h3>
                            <p className="feature-text">
                                Optional binding to your 1AM wallet Bech32m address guarantees that only your wallet can authorize recovery.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrap">🖼️</div>
                            <h3 className="feature-title">Lossless PNG-Only</h3>
                            <p className="feature-text">
                                Strict rejection of lossy JPEG/WebP formats prevents data corruption. Bundled inside uncompressed ZIP archives.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrap">📜</div>
                            <h3 className="feature-title">Compact Smart Contract</h3>
                            <p className="feature-text">
                                Native Midnight smart contract handles verification logic with zero knowledge privacy.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrap">📱</div>
                            <h3 className="feature-title">Fully Responsive</h3>
                            <p className="feature-text">
                                Seamless experience across desktop, laptop, tablet, and mobile viewport sizes without horizontal overflow.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrap">🔍</div>
                            <h3 className="feature-title">Open &amp; Auditable</h3>
                            <p className="feature-text">
                                Verifiable client-side cryptography without proprietary black boxes or closed source dependencies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider" aria-hidden="true" />

            {/* Interactive FAQ Section */}
            <section className="faq-section" aria-label="Frequently Asked Questions">
                <div className="section-inner">
                    <div className="section-label">
                        <span className="section-label-line" />
                        <span>FAQ</span>
                        <span className="section-label-line-r" />
                    </div>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <p className="section-subtitle">
                        Everything you need to know about steganography, Midnight Network, and 1AM Wallet integration.
                    </p>

                    <div className="faq-list">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`faq-item ${openFaq === idx ? "faq-open" : ""}`}
                                onClick={() => toggleFaq(idx)}
                            >
                                <div className="faq-question">
                                    <span>{faq.q}</span>
                                    <span className="faq-toggle-icon">{openFaq === idx ? "−" : "+"}</span>
                                </div>
                                {openFaq === idx && (
                                    <div className="faq-answer">
                                        <p>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="cta-section" aria-label="Get Started Call to Action">
                <div className="cta-section-inner">
                    <Logo size="lg" className="cta-logo" />
                    <h2 className="cta-section-title" style={{ marginTop: "1rem" }}>
                        Ready to seal your cold storage?
                    </h2>
                    <p className="cta-section-sub">
                        Connect your 1AM Wallet and conceal your first steganographic vault on Midnight Preprod in under two minutes.
                    </p>
                    <div className="cta-btn-wrapper">
                        <button className="cta-primary-large" onClick={handleLaunch}>
                            <span>⚡ Launch StegoVault App →</span>
                        </button>
                        <button className="cta-secondary-outline" onClick={() => setIsGuideOpen(true)}>
                            📖 Quick Start Guide
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer" role="contentinfo">
                <div className="landing-footer-inner">
                    <div className="footer-logo">
                        <Logo size="sm" />
                    </div>

                    <div className="footer-tagline">
                        Your secrets, your 1AM Wallet, your control.
                    </div>

                    <div className="footer-links-row" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center", margin: "0.75rem 0" }}>
                        <button className="btn-link-reset" onClick={() => setIsGuideOpen(true)} style={{ color: "var(--text2)", fontSize: "0.85rem", textDecoration: "none", cursor: "pointer" }}>📖 Quick Start Guide</button>
                        <span style={{ color: "var(--text3)" }}>•</span>
                        <button className="btn-link-reset" onClick={() => setIsFeedbackOpen(true)} style={{ color: "var(--text2)", fontSize: "0.85rem", textDecoration: "none", cursor: "pointer" }}>💬 Feedback Loop</button>
                        <span style={{ color: "var(--text3)" }}>•</span>
                        <a href="https://github.com/payalbabar/moonlight4" target="_blank" rel="noreferrer" style={{ color: "var(--text2)", fontSize: "0.85rem", textDecoration: "none" }}>GitHub Repository</a>
                        <span style={{ color: "var(--text3)" }}>•</span>
                        <a href="https://x.com/StegoVaultWeb3" target="_blank" rel="noreferrer" style={{ color: "var(--text2)", fontSize: "0.85rem", textDecoration: "none" }}>𝕏 @StegoVaultWeb3</a>
                    </div>

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
