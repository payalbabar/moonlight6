import { useState, useRef, type DragEvent, type ChangeEvent, useCallback } from "react";
import { encryptData, buildStegoVaultPayloadString, generateSecureMnemonic, generateSecurePassword, type VaultMetadata } from "../utils/crypto";
import { computeSHA256 } from "../utils/midnightContract";
import { hideData } from "../utils/steganography";
import { validateImageFile, createZipBundle, downloadBlob } from "../utils/file-utils";
import { generateDemoCarrierFile } from "../utils/demo-generator";
import { playClickSound, playLockSound, playSuccessChime } from "../utils/audio";
import { triggerConfetti } from "../utils/confetti";
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const calculatedStep = () => {
        if (!isConnected || !account) return 1;
        if (!coverFile || !seedPhrase || !password) return 2;
        if (processing && currentStep > 2) return currentStep;
        return 2;
    };

    const activeStepNum = calculatedStep();

    const handleGenerateSeed = () => {
        playClickSound();
        const mnemonic = generateSecureMnemonic(12);
        setSeedPhrase(mnemonic);
        addLog("[CRYPTO] Generated 12-word BIP-39 seed phrase from native Web Crypto entropy ✓", "info");
    };

    const handleGeneratePassword = () => {
        playClickSound();
        const pwd = generateSecurePassword();
        setPassword(pwd);
        setConfirmPassword(pwd);
        setShowPassword(true);
        setShowConfirmPassword(true);
        addLog("[CRYPTO] Generated 20-char high-entropy AES encryption key ✓", "info");
    };

    const handleGenerateCarrierCanvas = async () => {
        try {
            playClickSound();
            addLog("[CANVAS] Rendering high-resolution procedural cyber carrier image...", "info");
            const canvasFile = await generateDemoCarrierFile("cyber-vault");
            handleFile(canvasFile);
            addLog("[CANVAS] ✅ Procedural PNG carrier image ready for steganographic encoding", "success");
            playSuccessChime();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            addLog(`[CANVAS] ❌ Failed to render carrier: ${msg}`, "error");
        }
    };

    const handleEncrypt = async () => {
        setErrorMessage(null);

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
        playLockSound();

        try {
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

            setCurrentStep(5);
            addLog("[ZIP] Creating secure uncompressed bundle…", "info");
            const zipBlob = await createZipBundle(stegoBlob);
            downloadBlob(zipBlob, "stegovault_secure.zip");

            addLog("[SUCCESS] VAULT SEALED ✓ — 1AM Wallet authorized. stegovault_secure.zip downloaded!", "success");
            playSuccessChime();
            triggerConfetti();

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
        <section className="card rv" data-g="all seal">
            <div className="ch">
                <div>
                    <div className="lb">Hide</div>
                    <h2>The Vault</h2>
                    <p>AES-256-GCM · LSB Steganography · Midnight Authorized</p>
                </div>
                <button type="button" className="btn s" onClick={handleGenerateCarrierCanvas}>
                    Create Carrier PNG
                </button>
            </div>

            <div className="cb">
                <div className="steps">
                    <div className={activeStepNum >= 1 ? "step-active" : ""}><b>1</b>Connect</div>
                    <div className={activeStepNum >= 2 ? "step-active" : ""}><b>2</b>Protect</div>
                    <div className={activeStepNum >= 3 ? "step-active" : ""}><b>3</b>Commit</div>
                    <div className={activeStepNum >= 4 ? "step-active" : ""}><b>4</b>Embed</div>
                    <div className={activeStepNum >= 5 ? "step-active" : ""}><b>5</b>Save</div>
                </div>

                {errorMessage && (
                    <div className="note" style={{ borderColor: "var(--red)", background: "rgba(179,18,27,0.15)", color: "var(--red)", marginBottom: "16px" }}>
                        <b>⚠️ Error:</b> {errorMessage}
                    </div>
                )}

                <label
                    className={`drop ${dragActive ? "drag-over" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        id="vault-cover-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/png"
                        onChange={handleFileInput}
                    />
                    <svg viewBox="0 0 24 24">
                        <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v4h16v-4" />
                    </svg>
                    <b>{coverFile ? coverFile.name : "Drop a lossless PNG image here"}</b>
                    <span>{coverFile ? `${imageDimensions?.width ?? 0}×${imageDimensions?.height ?? 0} px · Click to change` : "or click to browse from device"}</span>
                    {coverFile && (
                        <button className="btn s" style={{ marginTop: "8px" }} onClick={(e) => { e.stopPropagation(); clearCover(); }}>
                            Remove Image
                        </button>
                    )}
                </label>

                <div className="f">
                    <div className="lab">
                        Seed Phrase / Private Key / Secret
                        <button type="button" className="btn s" onClick={handleGenerateSeed}>
                            Generate 12-Word Seed
                        </button>
                    </div>
                    <textarea
                        id="vault-secret"
                        placeholder="Enter confidential seed phrase or secret key (kept 100% local)"
                        value={seedPhrase}
                        onChange={(e) => setSeedPhrase(e.target.value)}
                    />
                </div>

                <div className="f">
                    <div className="lab">
                        AES Encryption Password
                        <button type="button" className="btn s" onClick={handleGeneratePassword}>
                            Generate Key
                        </button>
                    </div>
                    <div className="pw">
                        <input
                            id="vault-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="f">
                    <div className="lab">Confirm Password</div>
                    <div className="pw">
                        <input
                            id="vault-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="note">
                    Encryption is <b>100% local</b> (AES-256-GCM in your browser). Your <b>1AM Wallet</b> will sign an on-chain commitment before vault creation.
                </div>

                <button
                    className="btn p w"
                    type="button"
                    onClick={handleEncrypt}
                    disabled={processing}
                >
                    {processing ? (currentStep === 3 ? "Approving in 1AM Wallet…" : "Authorizing & Encrypting…") : "Seal the Vault"}
                </button>
            </div>
        </section>
    );
}
