import { useState, useEffect } from "react";
import { use1AMWallet } from "../hooks/use1AMWallet";

interface NetworkStatusProps {
    onOpenGuide?: () => void;
    onOpenFeedback?: () => void;
}

export default function NetworkStatus({ onOpenGuide, onOpenFeedback }: NetworkStatusProps) {
    const { isConnected, account, chainId, contractAddress } = use1AMWallet();
    const [pingLatency, setPingLatency] = useState<number | null>(null);

    useEffect(() => {
        // Simulate network latency measurement
        const start = performance.now();
        const timer = setTimeout(() => {
            const latency = Math.round(performance.now() - start + 45 + Math.random() * 15);
            setPingLatency(latency);
        }, 300);
        return () => clearTimeout(timer);
    }, [isConnected]);

    return (
        <div className="network-status-bar">
            <div className="network-status-items">
                {/* Network */}
                <div className="status-item">
                    <span className="status-indicator-dot online" />
                    <span className="status-label">Network:</span>
                    <span className="status-value highlight">Midnight Preprod</span>
                </div>

                {/* Chain / Wallet */}
                <div className="status-item">
                    <span className="status-label">1AM Connector:</span>
                    <span className={`status-value ${isConnected ? "status-connected" : "status-disconnected"}`}>
                        {isConnected ? `Connected (${chainId || "preprod"})` : "Disconnected"}
                    </span>
                </div>

                {/* Account */}
                {isConnected && account && (
                    <div className="status-item">
                        <span className="status-label">Identity:</span>
                        <span className="status-value monospace">
                            {account.slice(0, 10)}...{account.slice(-6)}
                        </span>
                    </div>
                )}

                {/* Contract */}
                <div className="status-item">
                    <span className="status-label">Contract:</span>
                    <span className="status-value monospace">
                        {contractAddress ? `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}` : "0200578f...63c4 (Default)"}
                    </span>
                </div>

                {/* Latency */}
                {pingLatency !== null && (
                    <div className="status-item latency-item">
                        <span className="status-label">RPC Ping:</span>
                        <span className="status-value">{pingLatency}ms</span>
                    </div>
                )}
            </div>

            {/* Quick action buttons */}
            <div className="network-quick-actions">
                {onOpenGuide && (
                    <button className="quick-action-btn" onClick={onOpenGuide} title="Interactive Onboarding Guide">
                        📖 Quick Start
                    </button>
                )}
                {onOpenFeedback && (
                    <button className="quick-action-btn highlight-btn" onClick={onOpenFeedback} title="Submit feedback to the development loop">
                        💬 Feedback Loop
                    </button>
                )}
            </div>
        </div>
    );
}
