import { useState, useEffect } from "react";
import { use1AMWallet } from "../hooks/use1AMWallet";

export interface UserFeedback {
    id: string;
    date: string;
    walletAddress: string;
    userType: "Developer" | "Crypto User" | "Security Researcher" | "Validator" | "Tester";
    feature: "Vault Sealing" | "Key Unlock" | "Smart Contract" | "1AM Wallet" | "UI / Performance" | "Documentation";
    category: "Bug" | "UX" | "Feature Request" | "Performance" | "Documentation" | "Smart Contract";
    severity: "Critical" | "High" | "Medium" | "Low";
    expected: string;
    actual: string;
    improvement: string;
    status: "Implemented" | "Under Review" | "Planned";
    resolution?: string;
}

const INITIAL_FEEDBACK_DATA: UserFeedback[] = [
    {
        id: "FB-001",
        date: "2026-09-08",
        walletAddress: "addr_test1qre388v78c2e6d...",
        userType: "Security Researcher",
        feature: "Vault Sealing",
        category: "UX",
        severity: "Medium",
        expected: "Clear warning if image format is lossy (e.g. JPEG) to prevent corruption",
        actual: "Silent failure or corrupted decryption if user uploaded JPG",
        improvement: "Add strict PNG-only MIME and binary header validation plus automatic ZIP packaging to preserve lossless bits",
        status: "Implemented",
        resolution: "Implemented validateImageFile() and JSZip STORE bundling in file-utils.ts (Commit bdc2a41)",
    },
    {
        id: "FB-002",
        date: "2026-09-09",
        walletAddress: "addr_test1qpk299v44f1a8c...",
        userType: "Tester",
        feature: "1AM Wallet",
        category: "Smart Contract",
        severity: "High",
        expected: "Visual feedback when 1AM Wallet is awaiting approval on Midnight Preprod",
        actual: "User was unaware popup was waiting in extension",
        improvement: "Add pulsing terminal warning and deployment state machine with 'WAITING FOR 1AM WALLET' badge",
        status: "Implemented",
        resolution: "Implemented live state machine in ContractDeployment.tsx and TerminalLog warning alerts",
    },
    {
        id: "FB-003",
        date: "2026-09-10",
        walletAddress: "addr_test1qzj550m11k3d7e...",
        userType: "Developer",
        feature: "UI / Performance",
        category: "Feature Request",
        severity: "Low",
        expected: "Capacity calculation before embedding payload into image",
        actual: "User had to guess if cover image was large enough for their secret data",
        improvement: "Add real-time capacity calculator showing max payload bytes for selected PNG dimensions",
        status: "Implemented",
        resolution: "Added bit capacity metrics and visual indicators in VaultPanel",
    },
    {
        id: "FB-004",
        date: "2026-09-11",
        walletAddress: "addr_test1qxm778v99g2c4d...",
        userType: "Crypto User",
        feature: "Key Unlock",
        category: "UX",
        severity: "Medium",
        expected: "Clear error message when wrong password is used for decryption",
        actual: "Generic decryption error without clear guidance",
        improvement: "Differentiate between wallet mismatch vs AES-GCM MAC tag validation failure",
        status: "Implemented",
        resolution: "Added distinct error handling for authentication tag mismatches vs wallet address mismatch in KeyPanel.tsx",
    }
];

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFeedbackSubmitted?: (feedback: UserFeedback) => void;
}

export default function FeedbackModal({ isOpen, onClose, onFeedbackSubmitted }: FeedbackModalProps) {
    const { account } = use1AMWallet();
    const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
    const [feedbackList, setFeedbackList] = useState<UserFeedback[]>(() => {
        const saved = localStorage.getItem("stegovault_feedbacks");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return INITIAL_FEEDBACK_DATA;
            }
        }
        return INITIAL_FEEDBACK_DATA;
    });

    const [userType, setUserType] = useState<UserFeedback["userType"]>("Crypto User");
    const [feature, setFeature] = useState<UserFeedback["feature"]>("Vault Sealing");
    const [category, setCategory] = useState<UserFeedback["category"]>("UX");
    const [severity, setSeverity] = useState<UserFeedback["severity"]>("Medium");
    const [expected, setExpected] = useState("");
    const [actual, setActual] = useState("");
    const [improvement, setImprovement] = useState("");
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    useEffect(() => {
        localStorage.setItem("stegovault_feedbacks", JSON.stringify(feedbackList));
    }, [feedbackList]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expected.trim() || !actual.trim() || !improvement.trim()) return;

        const newEntry: UserFeedback = {
            id: `FB-${String(feedbackList.length + 1).padStart(3, "0")}`,
            date: new Date().toISOString().split("T")[0],
            walletAddress: account || "addr_test1anonymous_guest",
            userType,
            feature,
            category,
            severity,
            expected,
            actual,
            improvement,
            status: "Under Review",
        };

        const updated = [newEntry, ...feedbackList];
        setFeedbackList(updated);
        if (onFeedbackSubmitted) onFeedbackSubmitted(newEntry);

        setSubmittedSuccess(true);
        setTimeout(() => {
            setSubmittedSuccess(false);
            setExpected("");
            setActual("");
            setImprovement("");
            setActiveTab("history");
        }, 1500);
    };

    const exportFeedbackJSON = () => {
        const blob = new Blob([JSON.stringify(feedbackList, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stegovault-feedback-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container feedback-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className="modal-icon">💬</span>
                        <div>
                            <h3 className="modal-title">StegoVault Feedback Loop</h3>
                            <p className="modal-subtitle">Direct User-to-Developer Improvement System</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === "submit" ? "active" : ""}`}
                        onClick={() => setActiveTab("submit")}
                    >
                        📝 Submit Feedback
                    </button>
                    <button
                        className={`modal-tab ${activeTab === "history" ? "active" : ""}`}
                        onClick={() => setActiveTab("history")}
                    >
                        📊 Feedback History &amp; Status ({feedbackList.length})
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {activeTab === "submit" ? (
                        <form onSubmit={handleSubmit} className="feedback-form">
                            {submittedSuccess ? (
                                <div className="feedback-success-banner">
                                    <span className="success-icon">✅</span>
                                    <p>Thank you! Your feedback has been recorded in the local loop and queued for resolution.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="form-row form-row-2">
                                        <div className="input-group">
                                            <label className="input-label">User Role</label>
                                            <select
                                                className="input-field"
                                                value={userType}
                                                onChange={(e) => setUserType(e.target.value as UserFeedback["userType"])}
                                            >
                                                <option value="Crypto User">Crypto User</option>
                                                <option value="Developer">Developer</option>
                                                <option value="Security Researcher">Security Researcher</option>
                                                <option value="Validator">Validator</option>
                                                <option value="Tester">Tester</option>
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">Feature Tested</label>
                                            <select
                                                className="input-field"
                                                value={feature}
                                                onChange={(e) => setFeature(e.target.value as UserFeedback["feature"])}
                                            >
                                                <option value="Vault Sealing">Vault Sealing (LSB + AES)</option>
                                                <option value="Key Unlock">Key Unlock &amp; Recovery</option>
                                                <option value="Smart Contract">Midnight Compact Contract</option>
                                                <option value="1AM Wallet">1AM Wallet DApp Connector</option>
                                                <option value="UI / Performance">UI / Performance</option>
                                                <option value="Documentation">Documentation &amp; Guides</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row form-row-2">
                                        <div className="input-group">
                                            <label className="input-label">Category</label>
                                            <select
                                                className="input-field"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value as UserFeedback["category"])}
                                            >
                                                <option value="UX">UX / Usability</option>
                                                <option value="Bug">Bug Report</option>
                                                <option value="Feature Request">Feature Request</option>
                                                <option value="Performance">Performance</option>
                                                <option value="Smart Contract">Smart Contract / ZK</option>
                                                <option value="Documentation">Documentation</option>
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">Severity</label>
                                            <select
                                                className="input-field"
                                                value={severity}
                                                onChange={(e) => setSeverity(e.target.value as UserFeedback["severity"])}
                                            >
                                                <option value="Low">Low (Suggestion)</option>
                                                <option value="Medium">Medium (Affects UX)</option>
                                                <option value="High">High (Impairs workflow)</option>
                                                <option value="Critical">Critical (Security / Blocker)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">What did you expect?</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., Automatic detection of blue channel capacity..."
                                            value={expected}
                                            onChange={(e) => setExpected(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">What actually happened?</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., No indicator of image capacity was displayed..."
                                            value={actual}
                                            onChange={(e) => setActual(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Suggested Improvement</label>
                                        <textarea
                                            className="input-textarea"
                                            rows={3}
                                            placeholder="Describe how we can make this better..."
                                            value={improvement}
                                            onChange={(e) => setImprovement(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="feedback-wallet-note">
                                        <span>🔗 Associated Wallet: </span>
                                        <strong>{account ? `${account.slice(0, 10)}...${account.slice(-6)}` : "Guest (Connect 1AM Wallet to sign)"}</strong>
                                    </div>

                                    <button type="submit" className="btn-primary btn-submit-feedback">
                                        🚀 SUBMIT FEEDBACK TO DEVELOPER LOOP
                                    </button>
                                </>
                            )}
                        </form>
                    ) : (
                        <div className="feedback-history-pane">
                            <div className="feedback-history-header">
                                <span className="history-count">Tracking {feedbackList.length} user reviews</span>
                                <button className="btn-secondary btn-sm" onClick={exportFeedbackJSON}>
                                    📥 Export JSON
                                </button>
                            </div>

                            <div className="feedback-cards-list">
                                {feedbackList.map((item) => (
                                    <div key={item.id} className={`feedback-card severity-${item.severity.toLowerCase()}`}>
                                        <div className="feedback-card-top">
                                            <span className="feedback-id">{item.id}</span>
                                            <span className="feedback-date">{item.date}</span>
                                            <span className={`feedback-tag tag-${item.category.toLowerCase().replace(/\s+/g, "-")}`}>
                                                {item.category}
                                            </span>
                                            <span className={`feedback-status status-${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="feedback-card-title">
                                            <strong>{item.feature}:</strong> {item.improvement}
                                        </div>
                                        <div className="feedback-card-meta">
                                            <span>Expected: {item.expected}</span>
                                            <span>Actual: {item.actual}</span>
                                        </div>
                                        {item.resolution && (
                                            <div className="feedback-resolution">
                                                <span className="res-icon">💡</span>
                                                <span><strong>Resolution:</strong> {item.resolution}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
