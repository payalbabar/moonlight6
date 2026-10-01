import { useState, useCallback, useEffect } from "react";
import "../dashboard.css";
import VaultPanel from "../components/VaultPanel";
import KeyPanel from "../components/KeyPanel";
import TerminalLog, { type LogEntry } from "../components/TerminalLog";
import Wallet from "../components/Wallet";
import ContractDeployment from "../components/ContractDeployment";
import OnboardingGuide from "../components/OnboardingGuide";
import FeedbackModal from "../components/FeedbackModal";
import StegoPlayground from "../components/StegoPlayground";
import StegoDifferenceVisualizer from "../components/StegoDifferenceVisualizer";
import ZKCircuitVisualizer from "../components/ZKCircuitVisualizer";
import Logo from "../components/Logo";
import { use1AMWallet } from "../hooks/use1AMWallet";
import { getSavedContract } from "../utils/midnightContract";
import { playClickSound } from "../utils/audio";
import { useNavigate } from "react-router-dom";

let logId = 0;

export default function VaultApp() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "seal" | "reveal" | "lab" | "zk">("all");
    const { isConnected, chainId, contractAddress, setContractAddress } = use1AMWallet();
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


    // Load presentational script for dashboard presentation effects
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/dashboard-effects.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="sv-dash">
            <div className="app">
                {/* ══════════════════════  LEFT STICKY ASIDE  ══════════════════════ */}
                <aside>
                    <div className="orb o1" />
                    <div className="orb o2" />

                    <div>
                        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
                            <Logo variant="dark" />
                        </a>

                        <div className="ttl">
                            <div className="eb">1AM Wallet · Midnight Preprod · AES-256-GCM</div>
                            <h1>Your<br />workspace.</h1>
                            <p>Seal and unlock vaults. Encrypted locally, verified by Midnight.</p>
                        </div>
                    </div>

                    <div>
                        <div className="kv">
                            <div>
                                <span>Network</span>{chainId === "preprod" || !chainId ? "Midnight Preprod" : chainId.toUpperCase()}
                            </div>
                            <div>
                                <span>1AM Connector</span>
                                <em style={{ fontStyle: "normal" }}>
                                    <i className={`dot ${isConnected ? "" : "red"}`} />
                                    {isConnected ? `Connected (${chainId || "preprod"})` : "Disconnected"}
                                </em>
                            </div>
                            <div>
                                <span>Contract</span>
                                <span
                                    className="mono"
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "160px",
                                        color: "#ffffff"
                                    }}
                                    title={contractAddress || (getSavedContract(chainId || "preprod")?.address ?? "Not deployed")}
                                >
                                    {contractAddress || getSavedContract(chainId || "preprod")?.address
                                        ? `${(contractAddress || getSavedContract(chainId || "preprod")?.address)!.slice(0, 10)}...`
                                        : "Not deployed"}
                                </span>
                            </div>
                            <div>
                                <span>RPC Ping</span>
                                <span style={{ color: "#fff", fontSize: "12px", letterSpacing: 0, textTransform: "none" }}>
                                    <b id="ping" style={{ fontWeight: 500 }}>48</b>ms
                                </span>
                            </div>
                        </div>

                        <div className="lnk">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsGuideOpen(true); }}>Onboarding Guide</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsFeedbackOpen(true); }}>Feedback Loop</a>
                        </div>
                    </div>
                </aside>

                {/* ══════════════════════  RIGHT MAIN WORKSPACE  ══════════════════════ */}
                <main>
                    {/* Quick Start & Feedback Top Bar */}
                    <div className="top">
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn s" type="button" onClick={() => setIsGuideOpen(true)}>
                                Quick Start
                            </button>
                            <button className="btn s" type="button" onClick={() => setIsFeedbackOpen(true)}>
                                Feedback Loop
                            </button>
                        </div>
                        <span className="enc">
                            <i className="dot" />
                            100% Client-Side Encryption
                        </span>
                    </div>

                    {/* Sticky Tabs */}
                    <div className="tabs" id="tabs">
                        <button
                            className={`tab ${activeTab === "all" ? "on" : ""}`}
                            data-t="all"
                            onClick={() => {
                                playClickSound();
                                setActiveTab("all");
                            }}
                        >
                            Complete Workspace
                        </button>
                        <button
                            className={`tab ${activeTab === "seal" ? "on" : ""}`}
                            data-t="seal"
                            onClick={() => {
                                playClickSound();
                                setActiveTab("seal");
                            }}
                        >
                            Seal Vault (Hide)
                        </button>
                        <button
                            className={`tab ${activeTab === "reveal" ? "on" : ""}`}
                            data-t="reveal"
                            onClick={() => {
                                playClickSound();
                                setActiveTab("reveal");
                            }}
                        >
                            Unlock Vault (Reveal)
                        </button>
                        <button
                            className={`tab ${activeTab === "lab" ? "on" : ""}`}
                            data-t="inspect"
                            onClick={() => {
                                playClickSound();
                                setActiveTab("lab");
                            }}
                        >
                            Stego Diff Inspector
                        </button>
                        <button
                            className={`tab ${activeTab === "zk" ? "on" : ""}`}
                            data-t="zk"
                            onClick={() => {
                                playClickSound();
                                setActiveTab("zk");
                            }}
                        >
                            Midnight ZK Circuit Prover
                        </button>
                        <i className="ulin" id="ulin" />
                    </div>

                    {/* Wallet & Contract Row */}
                    <div className="grid g2">
                        <Wallet onLog={addLog} />
                        <ContractDeployment onLog={addLog} onContractChange={handleContractChange} />
                    </div>

                    {/* Active View */}
                    {activeTab === "all" && (
                        <>
                            <div className="grid g2">
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

                    {/* Audit Console */}
                    <TerminalLog logs={logs} onClearLogs={clearLogs} />

                    {/* Footer */}
                    <footer>
                        <nav>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsGuideOpen(true); }}>User Guide</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsFeedbackOpen(true); }}>Feedback Loop</a>
                            <a href="https://github.com/payalbabar/moonlight4" target="_blank" rel="noreferrer">GitHub Repo</a>
                            <a href="https://x.com/StegoVaultWeb3" target="_blank" rel="noreferrer">Product X Profile</a>
                        </nav>
                        StegoVault encrypts and protects your secrets locally in browser memory via AES-256-GCM. Midnight Network &amp; 1AM Wallet authorize non-sensitive commitments with Zero Knowledge.
                    </footer>
                </main>
            </div>

            {/* Modals */}
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
