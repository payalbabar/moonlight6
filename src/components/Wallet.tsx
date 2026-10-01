import { useState } from "react";
import { use1AMWallet } from "../hooks/use1AMWallet";

interface WalletProps {
  onLog?: (msg: string, type?: "info" | "success" | "error" | "warn") => void;
}

export default function Wallet({ onLog }: WalletProps) {
  const { account, chainId, isConnected, isConnecting, connect, disconnect } =
    use1AMWallet();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    onLog?.("[1AM] Detecting 1AM Wallet…", "info");
    try {
      const addr = await connect();
      if (addr) {
        onLog?.("[1AM] 1AM Wallet detected ✓", "info");
        onLog?.(
          `[1AM] Connected 1AM Wallet: ${addr.slice(0, 8)}...${addr.slice(-6)}`,
          "success"
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      onLog?.(`[1AM] Connection failed: ${msg}`, "error");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onLog?.("[1AM] 1AM Wallet disconnected.", "warn");
  };

  const handleCopyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      onLog?.(`[1AM] Wallet address copied: ${account}`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="card rv" data-g="all zk">
      <div className="ch">
        <div>
          <div className="lb">Wallet</div>
          <h2>1AM Wallet</h2>
        </div>
        <span className={`pill ${isConnected ? "" : "bad"}`}>
          <i className="dot" />
          {isConnected ? "Connected" : "Not connected"}
        </span>
      </div>

      <div className="cb">
        {!isConnected ? (
          <>
            <p style={{ color: "var(--mut)", marginBottom: "24px" }}>
              Connect your 1AM Wallet to authorize steganographic operations on Midnight Preprod.
            </p>
            <button
              className="btn p w"
              id="connect-wallet"
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              aria-label="Connect 1AM Wallet"
            >
              {isConnecting ? "Connecting 1AM Wallet…" : "Connect 1AM Wallet"}
            </button>
          </>
        ) : (
          <div className="il">
            <div>
              <span>Address</span>
              <span className="mono">{account ? `${account.slice(0, 8)}...${account.slice(-6)}` : ""}</span>
            </div>
            <div>
              <span>Network</span>
              <span className="pill">{chainId === "preprod" || !chainId ? "Midnight Preprod" : chainId.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button type="button" className="btn s" onClick={handleCopyAddress}>
                {copied ? "✓ Copied" : "Copy Address"}
              </button>
              <button type="button" className="btn s" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
