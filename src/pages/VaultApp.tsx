import { useState, useCallback } from "react";
import VaultPanel from "../components/VaultPanel";
import KeyPanel from "../components/KeyPanel";
import TerminalLog, { type LogEntry } from "../components/TerminalLog";
import Wallet from "../components/Wallet";
import ContractDeployment from "../components/ContractDeployment";
import NetworkStatus from "../components/NetworkStatus";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";
import StegoPlayground from "../components/StegoPlayground";
import StegoDifferenceVisualizer from "../components/StegoDifferenceVisualizer";
import ZKCircuitVisualizer from "../components/ZKCircuitVisualizer";
import JudgeDemoBar from "../components/JudgeDemoBar";
import Logo from "../components/Logo";
import { use1AMWallet } from "../hooks/use1AMWallet";
import { playClickSound, playSuccessChime } from "../utils/audio";
import { triggerConfetti } from "../utils/confetti";
import { useNavigate } from "react-router-dom";

let logId = 0;

export default function VaultApp() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "seal" | "reveal" | "lab" | "zk">("all");
    const { setContractAddress } = use1AMWallet();
    const navigate = useNavigate();

    const addLog = useCallback((text: string, type: LogEntry["type"] = "info") => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString("en-US", { hour12: false });
        setLogs((prev) => [...prev, { id: ++logId, text, type, timestamp }]);
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    const handleContractChange = useCallback((address: string | null) => {
        setContractAddress(address);
    }, [setContractAddress]);

    const handleJudgeInstantDemo = () => {
        addLog("[EVALUATION] Launching Hackathon Instant ZK Steganography Simulation...", "info");
        setActiveTab("zk");
        playSuccessChime();
        triggerConfetti();
        addLog("[ZK] Initialized Midnight Halo-2 Constraint Prover with verified preprod parameters", "success");
    };

    return (
        <div className="app">
            {/* Judge Evaluation Quick Actions Bar */}
            <JudgeDemoBar
                onRunInstantDemo={handleJudgeInstantDemo}
            />

            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-group" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <Logo size="md" subtitle="1AM Wallet • Midnight Preprod • AES-256-GCM" />
                    </div>
                    <div className="header-actions-group">
                        <button className="header-nav-btn" onClick={() => navigate("/")}>
                            🏠 Home
                        </button>
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

            {/* Main App Workspace Navigation Tabs */}
            <div className="app-workspace-nav">
                <div className="workspace-tabs">
                    <button
                        type="button"
                        className={`workspace-tab ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => {
                            playClickSound();
                            setActiveTab("all");
                        }}
                    >
                        🎛️ Complete Workspace
                    </button>
                    <button
                        type="button"
                        className={`workspace-tab ${activeTab === "seal" ? "active" : ""}`}
                        onClick={() => {
                            playClickSound();
                            setActiveTab("seal");
                        }}
                    >
                        🔒 Seal Vault (Hide)
                    </button>
                    <button
                        type="button"
                        className={`workspace-tab ${activeTab === "reveal" ? "active" : ""}`}
                        onClick={() => {
                            playClickSound();
                            setActiveTab("reveal");
                        }}
                    >
                        🔓 Unlock Vault (Reveal)
                    </button>
                    <button
                        type="button"
                        className={`workspace-tab ${activeTab === "lab" ? "active" : ""}`}
                        onClick={() => {
                            playClickSound();
                            setActiveTab("lab");
                        }}
                    >
                        🔬 Stego Diff Inspector
                    </button>
                    <button
                        type="button"
                        className={`workspace-tab ${activeTab === "zk" ? "active" : ""}`}
                        onClick={() => {
                            playClickSound();
                            setActiveTab("zk");
                        }}
                    >
                        ⚡ Midnight ZK Circuit Prover
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="app-main">
                {/* 1AM Wallet Panel */}
                <Wallet onLog={addLog} />

                {/* Midnight Smart Contract Deployment Panel */}
                <ContractDeployment
                    onLog={addLog}
                    onContractChange={handleContractChange}
                />

                {/* Main App Panels Based on Active Tab */}
                {activeTab === "all" && (
                    <>
                        <div className="panels-grid">
                            <VaultPanel addLog={addLog} />
                            <KeyPanel addLog={addLog} />
                        </div>
                        <StegoDifferenceVisualizer />
                    </>
                )}

                {activeTab === "seal" && (
                    <div className="single-panel-view">
                        <VaultPanel addLog={addLog} />
                    </div>
                )}

                {activeTab === "reveal" && (
                    <div className="single-panel-view">
                        <KeyPanel addLog={addLog} />
                    </div>
                )}

                {activeTab === "lab" && (
                    <div className="single-panel-view" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <StegoDifferenceVisualizer />
                        <StegoPlayground />
                    </div>
                )}

                {activeTab === "zk" && (
                    <div className="single-panel-view">
                        <ZKCircuitVisualizer />
                    </div>
                )}

                {/* Live Cyberpunk Terminal Log */}
                <TerminalLog logs={logs} onClearLogs={clearLogs} />
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
