import { useState, useEffect } from "react";
import { use1AMWallet } from "../hooks/use1AMWallet";
import {
  deployStegoVaultContract,
  getSavedContract,
  clearSavedContract,
  type DeployedContractInfo,
  type DeploymentProgress,
  type DeploymentState,
} from "../utils/midnightContract";

interface ContractDeploymentProps {
  onLog?: (msg: string, type?: "info" | "success" | "error" | "warn") => void;
  onContractChange?: (address: string | null) => void;
}

export default function ContractDeployment({
  onLog,
  onContractChange,
}: ContractDeploymentProps) {
  const {
    account,
    chainId,
    isConnected,
    isConnecting,
    connect,
    getWalletProvider,
    getMidnightProvider,
    getConnectedApi,
  } = use1AMWallet();

  const currentNetwork = chainId || "preprod";

  const [contractInfo, setContractInfo] = useState<DeployedContractInfo | null>(() => {
    return getSavedContract(currentNetwork);
  });

  const [progress, setProgress] = useState<DeploymentProgress>(() => {
    const saved = getSavedContract(currentNetwork);
    if (saved) {
      return {
        state: "deployed",
        message: "Contract loaded from verified on-chain deployment",
        contractInfo: saved,
      };
    }
    return {
      state: "idle",
      message: "Ready to deploy StegoVault contract",
    };
  });

  const [copied, setCopied] = useState(false);

  // Synchronize onContractChange when contractInfo changes
  useEffect(() => {
    onContractChange?.(contractInfo?.address ?? null);
  }, [contractInfo, onContractChange]);

  const handleDeploy = async () => {
    if (!isConnected || !account) {
      setProgress({ state: "connecting_wallet", message: "Connecting 1AM Wallet..." });
      onLog?.("[1AM] Connecting 1AM Wallet for contract deployment…", "info");
      try {
        await connect();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setProgress({ state: "failed", message: "Connection failed", error: msg });
        onLog?.(`[1AM] ❌ Connection failed: ${msg}`, "error");
        return;
      }
    }

    const walletProv = getWalletProvider();
    const midnightProv = getMidnightProvider();
    const api = getConnectedApi();

    if (!walletProv || !midnightProv || !api) {
      const err = "1AM Wallet session unavailable. Please unlock 1AM Wallet and connect.";
      setProgress({ state: "failed", message: "Deployment failed", error: err });
      onLog?.(`[CONTRACT] ❌ ${err}`, "error");
      return;
    }

    try {
      const deployed = await deployStegoVaultContract({
        walletProvider: walletProv,
        midnightProvider: midnightProv,
        connectedApi: api,
        network: currentNetwork,
        walletAddress: account || "",
        onProgress: (p) => setProgress(p),
        onLog,
      });

      setContractInfo(deployed);
      onContractChange?.(deployed.address);
      onLog?.(`[SUCCESS] StegoVault contract active on-chain at: ${deployed.address}`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setProgress({
        state: "failed",
        message: "Deployment failed",
        error: msg,
      });
      setContractInfo(null);
      onContractChange?.(null);
    }
  };

  const handleCopyAddress = async () => {
    if (contractInfo?.address) {
      await navigator.clipboard.writeText(contractInfo.address);
      setCopied(true);
      onLog?.(`[CONTRACT] Address copied: ${contractInfo.address}`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    clearSavedContract(currentNetwork);
    setContractInfo(null);
    onContractChange?.(null);
    setProgress({
      state: "idle",
      message: "Ready to deploy StegoVault contract",
    });
    onLog?.("[CONTRACT] Contract reference reset.", "info");
  };

  const isDeploying = [
    "connecting_wallet",
    "building",
    "awaiting_wallet",
    "signed",
    "submitting",
    "confirming",
  ].includes(progress.state);

  const getStepClass = (targetState: DeploymentState) => {
    const statesOrder: DeploymentState[] = [
      "connecting_wallet",
      "building",
      "awaiting_wallet",
      "signed",
      "submitting",
      "confirming",
      "deployed",
    ];
    const currentIndex = statesOrder.indexOf(progress.state);
    const targetIndex = statesOrder.indexOf(targetState);

    if (progress.state === targetState) return "step-current";
    if (currentIndex > targetIndex || progress.state === "deployed") return "step-done";
    return "step-pending";
  };

  return (
    <div className="panel contract-panel">
      <div className="panel-header">
        <div className="panel-icon">📜</div>
        <div>
          <h2 className="panel-title">STEGOVAULT SMART CONTRACT</h2>
          <p className="panel-subtitle">Midnight Preprod • Zero-Knowledge Compact Deployment</p>
        </div>
      </div>

      <div className="contract-status-card">
        <div className="contract-grid">
          <div className="contract-field">
            <span className="field-label">Network:</span>
            <span className="field-value chain-badge">MIDNIGHT PREPROD</span>
          </div>

          <div className="contract-field">
            <span className="field-label">Wallet:</span>
            <span className="field-value account-address" title={account || "Not connected"}>
              {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "NOT CONNECTED"}
            </span>
          </div>

          <div className="contract-field">
            <span className="field-label">Status:</span>
            <span className="field-value">
              <span
                className={`status-dot ${
                  contractInfo ? "status-connected" : isDeploying ? "status-pending" : "status-disconnected"
                }`}
              />
              {contractInfo
                ? "DEPLOYED & CONFIRMED"
                : isDeploying
                ? progress.state.toUpperCase().replace(/_/g, " ")
                : "NOT DEPLOYED"}
            </span>
          </div>
        </div>

        {/* State Machine Progress Display */}
        {isDeploying && (
          <div className="deployment-progress-box">
            <div className="progress-spinner-row">
              <span className="spinner" />
              <span className="progress-step-text">{progress.message}</span>
            </div>
            <div className="progress-steps-list">
              <div className={`step-item ${getStepClass("connecting_wallet")}`}>
                1. CONNECTING 1AM WALLET…
              </div>
              <div className={`step-item ${getStepClass("building")}`}>
                2. BUILDING REAL CONTRACT DEPLOYMENT…
              </div>
              <div className={`step-item ${getStepClass("awaiting_wallet")}`}>
                3. APPROVE DEPLOYMENT IN 1AM WALLET…
              </div>
              <div className={`step-item ${getStepClass("signed")}`}>
                4. TRANSACTION SIGNED. PREPARING SUBMISSION…
              </div>
              <div className={`step-item ${getStepClass("submitting")}`}>
                5. SUBMITTING TRANSACTION TO MIDNIGHT PREPROD…
              </div>
              <div className={`step-item ${getStepClass("confirming")}`}>
                6. WAITING FOR MIDNIGHT PREPROD CONFIRMATION…
              </div>
            </div>
          </div>
        )}

        {/* Real Error Display */}
        {progress.state === "failed" && progress.error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Deployment failed</strong>
              <div className="error-text">{progress.error}</div>
            </div>
          </div>
        )}

        {/* Real Confirmed On-Chain Deployment Result */}
        {contractInfo && (
          <div className="deployed-info-box">
            <div className="deployed-header">
              <span className="deployed-check">✓</span>
              <span className="deployed-title">REAL ON-CHAIN DEPLOYMENT</span>
              <span className="onchain-badge">🔗 CONFIRMED ON MIDNIGHT PREPROD</span>
            </div>

            <div className="deployed-details">
              <div className="deployed-row">
                <span className="deployed-label">Network:</span>
                <span className="deployed-value">Midnight Preprod</span>
              </div>

              <div className="deployed-row">
                <span className="deployed-label">Contract Address:</span>
                <span className="deployed-value contract-addr" title={contractInfo.address}>
                  {contractInfo.address}
                </span>
                <button
                  type="button"
                  className="btn-copy-contract"
                  onClick={handleCopyAddress}
                  title="Copy contract address"
                >
                  {copied ? "✓ Copied" : "📋 Copy Address"}
                </button>
              </div>

              <div className="deployed-row">
                <span className="deployed-label">Transaction ID:</span>
                <span className="deployed-value tx-id" title={contractInfo.txId}>
                  {contractInfo.txId}
                </span>
              </div>

              {contractInfo.blockHeight && (
                <div className="deployed-row">
                  <span className="deployed-label">Block Height:</span>
                  <span className="deployed-value block-height">
                    #{contractInfo.blockHeight}
                  </span>
                </div>
              )}

              {contractInfo.indexerUri && (
                <div className="deployed-row">
                  <span className="deployed-label">Midnight Indexer:</span>
                  <span className="deployed-value indexer-uri">
                    {contractInfo.indexerUri}
                  </span>
                </div>
              )}
            </div>

            <div className="deployed-actions">
              <button
                type="button"
                className="btn-link-reset"
                onClick={handleReset}
              >
                Deploy New Contract Instance
              </button>
            </div>
          </div>
        )}

        {/* Main Action Button */}
        {!contractInfo && !isDeploying && (
          <div className="deployment-actions">
            <button
              className="btn-primary btn-deploy"
              onClick={handleDeploy}
              disabled={isConnecting}
            >
              🚀 DEPLOY CONTRACT TO MIDNIGHT PREPROD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
