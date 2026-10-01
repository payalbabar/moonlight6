import { useState, useEffect } from "react";
import { use1AMWallet } from "../hooks/use1AMWallet";
import {
  deployStegoVaultContract,
  getSavedContract,
  type DeployedContractInfo,
  type DeploymentProgress,
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
      setProgress({ state: "failed", message: "Deployment failed", error: msg });
      onLog?.(`[CONTRACT] ❌ ${msg}`, "error");
    }
  };

  return (
    <section className="card rv" data-g="all zk" style={{ animationDelay: ".1s" }}>
      <div className="ch">
        <div>
          <div className="lb">Smart contract</div>
          <h2>StegoVault Contract</h2>
          <p>Midnight Preprod · Zero-Knowledge Compact Deployment</p>
        </div>
      </div>
      <div className="cb">
        <div className="il">
          <div>
            <span>Network</span>
            <span className="pill">Midnight Preprod</span>
          </div>
          <div>
            <span>Wallet</span>
            <span className={`pill ${isConnected ? "" : "bad"}`}>
              {isConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <div>
            <span>Status</span>
            <span className={`pill ${contractInfo ? "" : "bad"}`}>
              <i className="dot" />
              {contractInfo ? "Deployed" : "Not deployed"}
            </span>
          </div>
          {contractInfo && (
            <div>
              <span>Address</span>
              <span className="mono">{`${contractInfo.address.slice(0, 10)}...${contractInfo.address.slice(-6)}`}</span>
            </div>
          )}
        </div>

        <button
          className="btn w"
          style={{ marginTop: "20px" }}
          type="button"
          onClick={handleDeploy}
          disabled={
            progress.state !== "idle" &&
            progress.state !== "deployed" &&
            progress.state !== "failed"
          }
        >
          {progress.state === "idle" || progress.state === "failed" || progress.state === "deployed"
            ? "Deploy contract to Midnight Preprod"
            : progress.message}
        </button>
      </div>
    </section>
  );
}
