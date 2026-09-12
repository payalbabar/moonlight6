import { useState, useCallback } from "react";
import VaultPanel from "../components/VaultPanel";
import KeyPanel from "../components/KeyPanel";
import TerminalLog, { type LogEntry } from "../components/TerminalLog";
import Wallet from "../components/Wallet";
import ContractDeployment from "../components/ContractDeployment";
import NetworkStatus from "../components/NetworkStatus";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";
import { use1AMWallet } from "../hooks/use1AMWallet";
import { useNavigate } from "react-router-dom";

let logId = 0;

export default function VaultApp() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const { setContractAddress } = use1AMWallet();
    const navigate = useNavigate();

    const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString("en-US", { hour12: false });
        setLogs((prev) => [...prev, { id: ++logId, text, type, timestamp }]);
    }, []);

    const handleContractChange = useCallback((address: string | null) => {
        setContractAddress(address);
    }, [setContractAddress]);

    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-group" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <div className="logo-icon">
                            <svg viewBox="0 0 40 40" fill="none" className="logo-svg">
                                <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" />
                                <rect x="10" y="16" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
                                <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M14 16V12a6 6 0 0 1 12 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="app-title">STEGOVAULT</h1>
                            <p className="app-tagline">1AM Wallet • Midnight Preprod • AES-256-GCM • LSB Steganography</p>
                        </div>
                    </div>
                    <div className="header-actions-group">
                        <button className="header-nav-btn" onClick={() => setIsGuideOpen(true)}>
                            📖 Onboarding Guide
                        </button>
                        <button className="header-nav-btn feedback-nav-btn" onClick={() => setIsFeedbackOpen(true)}>
                            💬 Feedback Loop
                        </button>
                        <div className="header-badge">
                            <span className="badge-dot" />
                            <span>100% Client-Side Encryption</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Network Diagnostic & Quick Actions Bar */}
            <NetworkStatus
                onOpenGuide={() => setIsGuideOpen(true)}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
            />

            {/* Main Content */}
            <main className="app-main">
                {/* 1AM Wallet Panel */}
                <Wallet onLog={addLog} />

                {/* Midnight Smart Contract Deployment Panel */}
                <ContractDeployment
                    onLog={addLog}
                    onContractChange={handleContractChange}
                />

                {/* Main App Panels: The Vault & The Key */}
                <div className="panels-grid">
                    <VaultPanel addLog={addLog} />
                    <KeyPanel addLog={addLog} />
                </div>

                {/* Live Cyberpunk Terminal Log */}
                <TerminalLog logs={logs} />
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-links-row">
                    <button className="footer-link-btn" onClick={() => setIsGuideOpen(true)}>📖 User Guide</button>
                    <span className="footer-sep">•</span>
                    <button className="footer-link-btn" onClick={() => setIsFeedbackOpen(true)}>💬 Feedback Loop</button>
                    <span className="footer-sep">•</span>
                    <a href="https://github.com/payalbabar/moonlight4" target="_blank" rel="noreferrer" className="footer-link-btn">GitHub Repo</a>
                    <span className="footer-sep">•</span>
                    <a href="https://x.com/StegoVaultWeb3" target="_blank" rel="noreferrer" className="footer-link-btn">Product X Profile</a>
                </div>
                <p className="footer-disclaimer">
                    StegoVault encrypts and protects your secrets locally in browser memory via AES-256-GCM.
                    <span className="footer-sep">|</span>
                    Midnight Network &amp; 1AM Wallet authorize non-sensitive commitments with Zero Knowledge.
                </p>
            </footer>

            {/* Interactive Modals */}
            <OnboardingGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
            />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                onFeedbackSubmitted={(fb) => addLog(`[FEEDBACK] Recorded user feedback ${fb.id} (${fb.category})`, "success")}
            />
        </div>
    );
}
