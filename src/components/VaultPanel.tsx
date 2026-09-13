import { useState, useRef, type DragEvent, type ChangeEvent, useCallback } from "react";
import { encryptData, buildStegoVaultPayloadString, type VaultMetadata } from "../utils/crypto";
import { computeSHA256 } from "../utils/midnightContract";
import { hideData } from "../utils/steganography";
import { validateImageFile, createZipBundle, downloadBlob } from "../utils/file-utils";
import { use1AMWallet } from "../hooks/use1AMWallet";
import type { LogEntry } from "./TerminalLog";

interface VaultPanelProps {
    addLog: (text: string, type?: LogEntry["type"]) => void;
}

export default function VaultPanel({ addLog }: VaultPanelProps) {
    const { account, chainId, contractAddress, isConnected, connect, sendOnChainAuthorization } = use1AMWallet();

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [seedPhrase, setSeedPhrase] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [processing, setProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; maxBytes: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        const result = validateImageFile(file);
        if (!result.valid) {
            setErrorMessage(result.error!);
            addLog(`[STEGO] INVALID COVER IMAGE: ${result.error!}`, "error");
            return;
        }
        setErrorMessage(null);
        setCoverFile(file);
        const objUrl = URL.createObjectURL(file);
        setPreview(objUrl);

        // Compute capacity metrics
        const img = new Image();
        img.onload = () => {
            const maxBytes = Math.max(0, Math.floor((img.width * img.height) / 8) - 4);
            setImageDimensions({ width: img.width, height: img.height, maxBytes });
            addLog(`[STEGO] Cover image loaded: ${file.name} (${img.width}×${img.height} px, max stego payload: ${(maxBytes / 1024).toFixed(1)} KB)`, "info");
        };
        img.src = objUrl;
    }, [addLog]);

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };
    const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = () => setDragActive(false);
    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    // Estimated payload size
    const estimatedPayloadBytes = seedPhrase ? new TextEncoder().encode(seedPhrase).length + 350 : 0;
    const capacityPercentage = imageDimensions?.maxBytes
        ? Math.min(100, (estimatedPayloadBytes / imageDimensions.maxBytes) * 100)
        : 0;

    // Active Workflow Step Calculator based on application state
    const calculatedStep = () => {
        if (!isConnected || !account) return 1;
        if (!coverFile || !seedPhrase || !password) return 2;
        if (processing && currentStep > 2) return currentStep;
        return 2;
    };

    const activeStepNum = calculatedStep();

    const handleEncrypt = async () => {
        setErrorMessage(null);

        // ── Input validation with clear, actionable error messages ──────
        if (!coverFile) {
            const err = "Invalid cover image. StegoVault requires a lossless PNG image.";
            setErrorMessage(err);
            addLog(`[STEGO] ${err}`, "error");
            return;
        }
        if (!seedPhrase.trim()) {
            const err = "Secret data is empty. Please enter your seed phrase or private key.";
            setErrorMessage(err);
            addLog(`[VAULT] ${err}`, "error");
            return;
        }
        if (!password) {
            const err = "AES encryption password is required.";
            setErrorMessage(err);
            addLog(`[CRYPTO] ${err}`, "error");
            return;
        }
        if (password.length < 8) {
            const err = "Password must be at least 8 characters.";
            setErrorMessage(err);
            addLog(`[CRYPTO] ${err}`, "warn");
            return;
        }
        if (password !== confirmPassword) {
            const err = "Passwords do not match. Please re-verify your encryption password.";
            setErrorMessage(err);
            addLog(`[CRYPTO] ${err}`, "error");
            return;
        }

        setProcessing(true);

        try {
            // ── Step 1: Connect 1AM Wallet ──────
            setCurrentStep(1);
            let currentAccount = account;
            let txHash: string | undefined;
            let authorizationType: VaultMetadata["authorizationType"] = "local";

            if (!isConnected || !currentAccount) {
                addLog("[1AM] 1AM Wallet connection required. Prompting wallet…", "info");
                try {
                    currentAccount = await connect();
                    if (currentAccount) {
                        addLog("[1AM] 1AM Wallet connected ✓", "info");
                    }
                } catch (cErr: unknown) {
                    const msg = cErr instanceof Error ? cErr.message : "1AM Wallet connection failed.";
                    addLog(`[1AM] ❌ Connection failed: ${msg}`, "error");
                    throw new Error(`Wallet connection required: ${msg}`);
                }
            }

            // ── Step 2: Protect Secret (Local AES Encryption) ───────────────────
            setCurrentStep(2);
            const vaultId = typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `vault-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            addLog(`[VAULT] Vault ID: ${vaultId}`, "info");
            addLog("[CRYPTO] Deriving key via PBKDF2 (100,000 iterations)…", "info");
            addLog("[CRYPTO] Encrypting secret via AES-256-GCM…", "info");

            const cryptoPayload = await encryptData(seedPhrase, password);
            const contentHash = await computeSHA256(cryptoPayload.ciphertext);
            addLog(`[HASH] Content commitment hash: ${contentHash.slice(0, 32)}…`, "info");

            // ── Step 3: Create Commitment (Midnight Preprod) ───────────────────
            setCurrentStep(3);
            addLog("[MIDNIGHT] Submitting vault commitment to Midnight Preprod…", "info");
            addLog("[1AM] ⏳ Approve the transaction in your 1AM Wallet popup…", "warn");

            try {
                const onChainResult = await sendOnChainAuthorization(vaultId, contentHash);
                txHash = onChainResult.txHash;
                authorizationType = "onchain";
                addLog("[MIDNIGHT] ✅ Vault commitment confirmed!", "success");
            } catch (authErr: unknown) {
                const msg = authErr instanceof Error ? authErr.message : "Transaction authorization failed.";
                addLog(`[MIDNIGHT] ❌ ${msg}`, "error");
                throw new Error(`Transaction failed. Please try again: ${msg}`);
            }

            // ── Step 4: Generate Vault (PNG LSB Steganography) ─────────────────
            setCurrentStep(4);
            const metadata: VaultMetadata = {
                version: 1,
                walletAddress: currentAccount ?? "no-wallet",
                chainId: chainId || "preprod",
                vaultId,
                createdAt: new Date().toISOString(),
                authorizationType,
                txHash,
                contractAddress: contractAddress ?? undefined,
            };

            const payloadStr = buildStegoVaultPayloadString(cryptoPayload, metadata);
            addLog("[STEGO] Injecting encrypted payload into blue-channel LSBs…", "info");
            const stegoBlob = await hideData(coverFile, payloadStr);

            // ── Step 5: Save Vault (ZIP Download) ─────────────────────────────
            setCurrentStep(5);
            addLog("[ZIP] Creating secure uncompressed bundle…", "info");
            const zipBlob = await createZipBundle(stegoBlob);
            downloadBlob(zipBlob, "stegovault_secure.zip");

            addLog("[SUCCESS] VAULT SEALED ✓ — 1AM Wallet authorized. stegovault_secure.zip downloaded!", "success");

        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Encryption failed.";
            setErrorMessage(msg);
            addLog(`[ERROR] ${msg}`, "error");
        } finally {
            setProcessing(false);
        }
    };

    const clearCover = () => {
        setCoverFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setImageDimensions(null);
        setErrorMessage(null);
    };

    return (
        <div className="panel vault-panel">
            <div className="panel-header">
                <div className="panel-icon">🔒</div>
                <div>
                    <h2 className="panel-title">THE VAULT</h2>
                    <p className="panel-subtitle">AES-256-GCM · LSB Steganography · Midnight Authorized</p>
                </div>
            </div>

            {/* 5-Step Visual Workflow Progress Indicator */}
            <div className="workflow-progress-tracker" aria-label="Vault Creation Steps">
                <div className="workflow-steps-list">
                    <div className={`workflow-step-pill ${activeStepNum >= 1 ? "step-active" : ""}`}>
                        <span className="step-num">1</span>
                        <span className="step-label">Connect</span>
                    </div>
                    <div className={`workflow-step-pill ${activeStepNum >= 2 ? "step-active" : ""}`}>
                        <span className="step-num">2</span>
                        <span className="step-label">Protect</span>
                    </div>
                    <div className={`workflow-step-pill ${activeStepNum >= 3 ? "step-active" : ""}`}>
                        <span className="step-num">3</span>
                        <span className="step-label">Commit</span>
                    </div>
                    <div className={`workflow-step-pill ${activeStepNum >= 4 ? "step-active" : ""}`}>
                        <span className="step-num">4</span>
                        <span className="step-label">Embed</span>
                    </div>
                    <div className={`workflow-step-pill ${activeStepNum >= 5 ? "step-active" : ""}`}>
                        <span className="step-num">5</span>
                        <span className="step-label">Save</span>
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
                <div className="error-banner" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{errorMessage}</span>
                </div>
            )}

            {/* Drop Zone */}
            <div
                className={`drop-zone ${dragActive ? "drop-zone-active" : ""} ${coverFile ? "drop-zone-loaded" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload Cover Image PNG"
            >
                <input
                    id="vault-cover-image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png"
                    className="hidden"
                    onChange={handleFileInput}
                />
                {coverFile ? (
                    <div className="drop-zone-preview">
                        {preview && <img src={preview} alt="Cover Preview" className="preview-img" />}
                        <div className="preview-info">
                            <span className="preview-name">{coverFile.name}</span>
                            {imageDimensions && (
                                <span className="preview-dimensions">
                                    {imageDimensions.width}×{imageDimensions.height} px · {(imageDimensions.maxBytes / 1024).toFixed(1)} KB Max Capacity
                                </span>
                            )}
                            <button className="btn-clear" onClick={(e) => { e.stopPropagation(); clearCover(); }}>
                                ✕ Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="drop-zone-empty">
                        <div className="drop-icon">📁</div>
                        <p className="drop-text">Drop a <strong>lossless PNG</strong> image here</p>
                        <p className="drop-subtext">or click to browse</p>
                    </div>
                )}
            </div>

            {/* Capacity meter if image is loaded */}
            {imageDimensions && (
                <div className="capacity-bar-container">
                    <div className="capacity-bar-header">
                        <span className="capacity-label">Stego Payload Capacity:</span>
                        <span className="capacity-value">
                            {estimatedPayloadBytes} B / {imageDimensions.maxBytes} B ({capacityPercentage.toFixed(1)}%)
                        </span>
                    </div>
                    <div className="capacity-track">
                        <div
                            className={`capacity-fill ${capacityPercentage > 90 ? "critical" : capacityPercentage > 70 ? "warning" : "good"}`}
                            style={{ width: `${Math.max(2, capacityPercentage)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Secret Data Input */}
            <div className="input-group">
                <label className="input-label" htmlFor="vault-secret">
                    <span className="label-icon">🔑</span> Seed Phrase / Private Key / Secret
                </label>
                <textarea
                    id="vault-secret"
                    className="input-textarea"
                    placeholder="Enter confidential seed phrase or secret key (kept 100% local in browser memory)…"
                    value={seedPhrase}
                    onChange={(e) => setSeedPhrase(e.target.value)}
                    rows={3}
                />
            </div>

            {/* Password */}
            <div className="input-group">
                <label className="input-label" htmlFor="vault-password">
                    <span className="label-icon">🛡️</span> AES Encryption Password
                </label>
                <input
                    id="vault-password"
                    type="password"
                    className="input-field"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Confirm Password */}
            <div className="input-group">
                <label className="input-label" htmlFor="vault-confirm-password">
                    <span className="label-icon">🔄</span> Confirm Password
                </label>
                <input
                    id="vault-confirm-password"
                    type="password"
                    className="input-field"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            {/* Info note */}
            <div className="auth-info-note">
                <span className="auth-note-icon">⚡</span>
                <span>
                    Encryption is <strong>100% local</strong> (AES-256-GCM in your browser).
                    Your <strong>1AM Wallet</strong> will sign an on-chain commitment before vault creation.
                </span>
            </div>

            {/* Seal Button */}
            <button
                className="btn-primary btn-encrypt"
                onClick={handleEncrypt}
                disabled={processing}
            >
                {processing ? (
                    <span className="btn-loading">
                        <span className="spinner" /> {currentStep === 3 ? "Approving in 1AM Wallet…" : "Authorizing & Encrypting…"}
                    </span>
                ) : (
                    <span>🔐 SEAL THE VAULT</span>
                )}
            </button>
        </div>
    );
}
