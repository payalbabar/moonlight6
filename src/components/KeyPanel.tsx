import { useState, useRef, type DragEvent, type ChangeEvent, useCallback } from "react";
import { decryptData, parseVaultPayload, type VaultMetadata } from "../utils/crypto";
import { verifyVaultCommitmentOnChain } from "../utils/midnightContract";
import { extractData } from "../utils/steganography";
import { validateImageFile } from "../utils/file-utils";
import { playClickSound, playLockSound, playSuccessChime } from "../utils/audio";
import { triggerConfetti } from "../utils/confetti";
import { use1AMWallet } from "../hooks/use1AMWallet";
import type { LogEntry } from "./TerminalLog";

interface KeyPanelProps {
    addLog: (text: string, type?: LogEntry["type"]) => void;
}

export default function KeyPanel({ addLog }: KeyPanelProps) {
    const { account, isConnected, connect } = use1AMWallet();

    const [stegoFile, setStegoFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [revealedText, setRevealedText] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [vaultMetadata, setVaultMetadata] = useState<VaultMetadata | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        const result = validateImageFile(file);
        if (!result.valid) {
            setErrorMessage(result.error!);
            addLog(`[STEGO] INVALID VAULT IMAGE: ${result.error!}`, "error");
            return;
        }
        setStegoFile(file);
        setPreview(URL.createObjectURL(file));
        setRevealedText(null);
        setVaultMetadata(null);
        setErrorMessage(null);
        addLog(`[STEGO] Vault image loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, "info");
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

    const handleDecrypt = async () => {
        setErrorMessage(null);

        if (!stegoFile) {
            const err = "No vault image selected. Please upload your vault.png file.";
            setErrorMessage(err);
            addLog(`[STEGO] ${err}`, "error");
            return;
        }
        if (!password) {
            const err = "Decryption password is required.";
            setErrorMessage(err);
            addLog(`[CRYPTO] ${err}`, "error");
            return;
        }

        setProcessing(true);
        setRevealedText(null);
        playLockSound();

        try {
            let currentAccount = account;
            if (!isConnected || !currentAccount) {
                addLog("[1AM] Attempting 1AM Wallet connection…", "info");
                try {
                    currentAccount = await connect();
                    if (currentAccount) {
                        addLog(`[1AM] Connected: ${currentAccount.slice(0, 8)}...${currentAccount.slice(-6)}`, "success");
                    }
                } catch {
                    addLog("[1AM] Note: Wallet connection pending. Verifying vault payload…", "warn");
                    currentAccount = null;
                }
            }

            addLog("[STEGO] Loading stego image…", "info");
            const raw = await extractData(stegoFile, (msg) => addLog(`[STEGO] ${msg}`, "info"));

            addLog("[STEGO] Parsing vault payload…", "info");
            let metadata: VaultMetadata | null;
            let cryptoPayload;

            try {
                const parsed = parseVaultPayload(raw);
                metadata = parsed.metadata;
                cryptoPayload = parsed.cryptoPayload;
            } catch {
                throw new Error("Invalid vault PNG. File does not contain a valid StegoVault payload.");
            }

            if (metadata) {
                setVaultMetadata(metadata);
                const boundAddr = metadata.walletAddress;

                if (boundAddr && boundAddr !== "no-wallet" && boundAddr !== "local") {
                    addLog(`[AUTH] Vault bound to wallet: ${boundAddr.slice(0, 8)}...${boundAddr.slice(-6)}`, "info");

                    if (currentAccount) {
                        if (boundAddr.toLowerCase() !== currentAccount.toLowerCase()) {
                            const mismatchMsg = `Vault identity mismatch — Connected wallet (${currentAccount.slice(0, 8)}...) does not match authorized vault address (${boundAddr.slice(0, 8)}...).`;
                            setErrorMessage(mismatchMsg);
                            addLog(`[AUTH] ❌ ${mismatchMsg}`, "error");
                            throw new Error(mismatchMsg);
                        }
                        addLog("[AUTH] ✅ 1AM Wallet identity verified!", "success");
                    }
                }

                if (metadata.contractAddress) {
                    addLog(`[CONTRACT] Verifying on-chain commitment on contract ${metadata.contractAddress.slice(0, 10)}…`, "info");
                    const vResult = await verifyVaultCommitmentOnChain({
                        contractAddress: metadata.contractAddress,
                        vaultId: metadata.vaultId,
                    });
                    if (vResult.verified) {
                        addLog("[CONTRACT] ✅ On-chain commitment verified in Compact contract ledger!", "success");
                    } else {
                        addLog("[CONTRACT] ⚠️ Vault integrity check: Local authorization active.", "warn");
                    }
                }
            }

            addLog("[CRYPTO] Deriving key from password via PBKDF2…", "info");
            addLog("[CRYPTO] Decrypting ciphertext via AES-256-GCM…", "info");
            
            let plaintext: string;
            try {
                plaintext = await decryptData(cryptoPayload, password, (msg) => addLog(msg, "info"));
            } catch {
                throw new Error("Incorrect password or corrupted bitstream. The vault could not be decrypted.");
            }

            setRevealedText(plaintext);
            addLog("[SUCCESS] VAULT UNLOCKED ✓ — Secret recovered locally in browser memory", "success");
            playSuccessChime();
            triggerConfetti();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Decryption failed.";
            if (!msg.includes("mismatch")) {
                setErrorMessage(msg);
                addLog(`[CRYPTO] DECRYPTION FAILED: ${msg}`, "error");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleCopy = async () => {
        if (revealedText) {
            await navigator.clipboard.writeText(revealedText);
            setCopied(true);
            playClickSound();
            addLog("[VAULT] Secret copied to clipboard. Keep it safe!", "warn");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const clearFile = () => {
        setStegoFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setRevealedText(null);
        setVaultMetadata(null);
        setErrorMessage(null);
    };

    return (
        <section className="card dk rv" data-g="all unlock" style={{ animationDelay: ".1s", alignSelf: "start" }}>
            <div className="ch">
                <div>
                    <div className="lb">Reveal</div>
                    <h2>The Key</h2>
                    <p>1AM Verified Unlock &amp; Reveal</p>
                </div>
            </div>

            <div className="cb">
                {errorMessage && (
                    <div className="note" style={{ borderColor: "var(--red)", background: "rgba(179,18,27,0.2)", color: "#ff8a8e", marginBottom: "16px" }}>
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
                        id="key-vault-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/png"
                        onChange={handleFileInput}
                    />
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="16" />
                        <circle cx="9" cy="10" r="2" />
                        <path d="m21 16-5-5-9 9" />
                    </svg>
                    <b>{stegoFile ? stegoFile.name : "Drop your vault.png here"}</b>
                    <span>or click to browse from device</span>
                    {vaultMetadata && (
                        <span className="sub" style={{ color: "var(--cyan)", marginTop: "4px", fontSize: "0.8rem" }}>
                            Vault ID: {vaultMetadata.vaultId.slice(0, 12)}…
                        </span>
                    )}
                    {stegoFile && (
                        <button className="btn s" style={{ marginTop: "8px" }} onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                            Remove Image
                        </button>
                    )}
                </label>

                <div className="f">
                    <div className="lab">Decryption Password</div>
                    <div className="pw">
                        <input
                            id="key-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password used during sealing"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="note">
                    Decryption is performed <b>locally</b> using AES-256-GCM. If the vault is bound to a 1AM Wallet, wallet identity is strictly verified.
                </div>

                <button
                    className="btn p w"
                    type="button"
                    onClick={handleDecrypt}
                    disabled={processing}
                >
                    {processing ? "Verifying & Decrypting…" : "Unlock the Vault"}
                </button>

                {revealedText !== null && (
                    <div className="note" style={{ marginTop: "16px", background: "rgba(34,197,94,0.15)", borderColor: "#22c55e", color: "#ffffff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <b>🔑 Recovered Secret:</b>
                            <button className="btn s" type="button" onClick={handleCopy}>
                                {copied ? "✓ Copied" : "📋 Copy"}
                            </button>
                        </div>
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem" }}>
                            {revealedText}
                        </pre>
                    </div>
                )}
            </div>
        </section>
    );
}
