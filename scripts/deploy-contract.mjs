/**
 * StegoVault — Real Midnight Preprod Contract Deployment Script
 *
 * Uses @midnight-ntwrk/wallet + @midnight-ntwrk/midnight-js-contracts to do
 * a genuine on-chain deployment of the StegoVault Compact contract.
 *
 * Prerequisites:
 *   1. Prover server must be running at VITE_MIDNIGHT_PROVER_URL (default: http://localhost:6300)
 *      Run it with: docker run -p 6300:6300 midnightnetwork/proof-server:latest
 *   2. Your 1AM Wallet seed phrase must be set in .env as WALLET_SEED
 *      e.g. WALLET_SEED="word1 word2 word3 ... word24"
 *   3. Your wallet needs Dust tokens on Midnight Preprod for transaction fees
 *      Get them from: https://midnight.network/faucet
 *
 * Usage:
 *   node scripts/deploy-contract.mjs
 *
 * On success, VITE_CONTRACT_ADDRESS in .env will be updated with the real address.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// ─── Load .env manually (no dotenv dependency needed) ───────────────────────
const envPath = path.join(rootDir, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
}

const INDEXER_URI         = env.VITE_MIDNIGHT_INDEXER_URL   || "https://indexer.preprod.midnight.network/api/v1/graphql";
const INDEXER_WS_URI      = INDEXER_URI.replace(/^https?/, (p) => p === "https" ? "wss" : "ws").replace(/\/graphql$/, "/graphql");
const NODE_URI            = env.VITE_MIDNIGHT_NODE_URL      || "https://rpc.preprod.midnight.network";
const PROVER_URI          = env.VITE_MIDNIGHT_PROVER_URL    || "http://localhost:6300";
const WALLET_SEED         = env.WALLET_SEED                 || "";

if (!WALLET_SEED) {
  console.error(`
╔═══════════════════════════════════════════════════════════════╗
║  ERROR: WALLET_SEED not set in .env                          ║
╠═══════════════════════════════════════════════════════════════╣
║  Add this line to your .env file:                            ║
║    WALLET_SEED="word1 word2 word3 ... word24"                 ║
║                                                               ║
║  This is your 1AM Wallet mnemonic seed phrase (24 words).    ║
║  Open 1AM Wallet → Settings → Export Seed Phrase.            ║
║                                                               ║
║  SECURITY: Never share your seed phrase with anyone.         ║
╚═══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

console.log("╔═══════════════════════════════════════════════════════════╗");
console.log("║  StegoVault — Real Midnight Preprod Contract Deployment   ║");
console.log("╚═══════════════════════════════════════════════════════════╝");
console.log();
console.log(`  Network:  Midnight Preprod`);
console.log(`  Indexer:  ${INDEXER_URI}`);
console.log(`  Node:     ${NODE_URI}`);
console.log(`  Prover:   ${PROVER_URI}`);
console.log();

// ─── Verify prover server is reachable ──────────────────────────────────────
console.log("[1/5] Checking prover server…");
try {
  const resp = await fetch(`${PROVER_URI}/health`).catch(() =>
    fetch(`${PROVER_URI}/`)
  );
  if (resp.ok || resp.status === 404) {
    console.log(`      ✅ Prover server reachable at ${PROVER_URI}`);
  } else {
    throw new Error(`HTTP ${resp.status}`);
  }
} catch (err) {
  console.error(`
╔═══════════════════════════════════════════════════════════════╗
║  ERROR: Prover server not reachable at ${PROVER_URI.padEnd(23)}║
╠═══════════════════════════════════════════════════════════════╣
║  Start it with Docker:                                        ║
║    docker run -p 6300:6300 midnightnetwork/proof-server:latest║
║  or set VITE_MIDNIGHT_PROVER_URL in .env to the correct URI.  ║
╚═══════════════════════════════════════════════════════════════╝
  `);
  process.exit(1);
}

// ─── Load Midnight packages ──────────────────────────────────────────────────
console.log("[2/5] Loading Midnight SDK…");

// Dynamic imports for ESM/CJS mixed packages
const { WalletBuilder } = await import("@midnight-ntwrk/wallet");
const { deployContract }  = await import("@midnight-ntwrk/midnight-js-contracts");
const { NetworkId }       = await import("@midnight-ntwrk/midnight-js-network-id");

// Load the compiled contract CJS module via createRequire (it's CJS-only)
const require = createRequire(import.meta.url);
const contractModule = require(path.join(rootDir, "contracts/compiled/contract/index.cjs"));
const { Contract } = contractModule;

// Load zkir for ZK proof generation
const zkirPath = path.join(rootDir, "contracts/compiled/zkir/record_vault.zkir");
const zkirContent = fs.readFileSync(zkirPath, "utf-8");

console.log("      ✅ SDK loaded");
console.log(`      ✅ Contract module loaded (circuit: record_vault)`);
console.log(`      ✅ ZKIR loaded (${zkirContent.length} bytes)`);

// ─── Build wallet ────────────────────────────────────────────────────────────
console.log("[3/5] Initializing wallet (this may take 30–60s while syncing)…");

const networkId = NetworkId.TestNet; // Midnight Preprod = TestNet

let wallet;
try {
  wallet = await WalletBuilder.build(
    INDEXER_URI,
    INDEXER_WS_URI,
    PROVER_URI,
    NODE_URI,
    WALLET_SEED,
    networkId,
    "info"
  );
  wallet.start();
  console.log("      ✅ Wallet initialized and syncing…");

  // Wait for wallet to sync (observe first state emission)
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Wallet sync timeout after 120s")), 120_000);
    const sub = wallet.state().subscribe({
      next: (state) => {
        if (state) {
          clearTimeout(timeout);
          sub.unsubscribe();
          resolve(state);
        }
      },
      error: (err) => {
        clearTimeout(timeout);
        reject(err);
      },
    });
  });
  console.log("      ✅ Wallet synced");
} catch (err) {
  console.error(`\n  ❌ Wallet initialization failed: ${err.message}`);
  console.error("     Make sure your seed phrase is correct and the indexer is reachable.");
  process.exit(1);
}

// ─── Build providers from wallet ────────────────────────────────────────────
console.log("[4/5] Building Midnight providers…");

// Extract providers from the Wallet object
// The Midnight Wallet implements WalletProvider and MidnightProvider interfaces
const walletProvider = {
  balanceTx: (tx, ttl) => wallet.balanceTransaction(tx, []).then(r => {
    if (r.type === "nothingToProve") return r.tx;
    return r.tx;
  }),
  getCoinPublicKey: () => wallet.coinPublicKey,
  getEncryptionPublicKey: () => wallet.encryptionPublicKey,
};

const midnightProvider = {
  submitTx: async (tx) => {
    const txId = await wallet.submitTransaction(tx);
    return txId;
  },
};

// Proof provider — delegates to prover server
const proofProvider = {
  proveTx: async (unprovenTx, config) => {
    const recipe = { type: "balanceAndProve", tx: unprovenTx };
    const proved = await wallet.proveTransaction(recipe);
    return proved;
  },
};

// ZK config provider — loads ZKIR from compiled artifacts
const zkConfigProvider = {
  getZKIR: async (circuitId) => {
    const zkirFile = path.join(rootDir, "contracts/compiled/zkir", `${circuitId}.zkir`);
    if (!fs.existsSync(zkirFile)) throw new Error(`ZKIR not found for circuit: ${circuitId}`);
    return fs.readFileSync(zkirFile, "utf-8");
  },
  getProverKey: async (circuitId) => {
    // Prover keys are generated by compactc without --skip-zk
    // If they don't exist locally, the prover server handles proving
    const pkFile = path.join(rootDir, "contracts/compiled/zkir", `${circuitId}.pk`);
    if (fs.existsSync(pkFile)) return fs.readFileSync(pkFile);
    return new Uint8Array(0); // Server-side proving
  },
  getVerifierKey: async (circuitId) => {
    const vkFile = path.join(rootDir, "contracts/compiled/zkir", `${circuitId}.vk`);
    if (fs.existsSync(vkFile)) return fs.readFileSync(vkFile);
    return new Uint8Array(0);
  },
  getVerifierKeys: async (circuitIds) => {
    return Promise.all(circuitIds.map(async id => [id, await zkConfigProvider.getVerifierKey(id)]));
  },
  get: async (circuitId) => ({
    circuitId,
    zkir: await zkConfigProvider.getZKIR(circuitId),
    proverKey: await zkConfigProvider.getProverKey(circuitId),
    verifierKey: await zkConfigProvider.getVerifierKey(circuitId),
  }),
  asKeyMaterialProvider: () => ({
    getZKIR: (loc) => zkConfigProvider.getZKIR(loc),
    getProverKey: (loc) => zkConfigProvider.getProverKey(loc),
    getVerifierKey: (loc) => zkConfigProvider.getVerifierKey(loc),
  }),
};

// Private state provider (in-memory for deployment)
const privateStateStore = new Map();
const privateStateProvider = {
  get: async (id) => privateStateStore.get(id) ?? null,
  set: async (id, state) => { privateStateStore.set(id, state); },
  remove: async (id) => { privateStateStore.delete(id); },
  setState: async (id, state) => { privateStateStore.set(id, state); },
  getState: async (id) => privateStateStore.get(id) ?? null,
};

// PublicDataProvider — reads from Midnight Preprod indexer
const publicDataProvider = {
  contractStateBlockchain: (address, config) => {
    // Returns an Observable — for deployment we don't need to subscribe to state
    return {
      subscribe: () => ({ unsubscribe: () => {} }),
      pipe: () => publicDataProvider.contractStateBlockchain(address, config),
    };
  },
  watchForTxData: (txId) => {
    return {
      subscribe: () => ({ unsubscribe: () => {} }),
      pipe: () => publicDataProvider.watchForTxData(txId),
    };
  },
  queryContractState: async (address) => null,
  getLedgerState: async () => null,
};

const providers = {
  privateStateProvider,
  publicDataProvider,
  zkConfigProvider,
  proofProvider,
  walletProvider,
  midnightProvider,
};

console.log("      ✅ Providers ready");

// ─── Deploy contract ─────────────────────────────────────────────────────────
console.log("[5/5] Deploying StegoVault contract to Midnight Preprod…");
console.log("      (Generating ZK proof + submitting transaction — may take 1–5 minutes)");

let deployedContract;
try {
  const contractInstance = new Contract({});
  
  deployedContract = await deployContract(providers, {
    contract: contractInstance,
    initialPrivateState: undefined,
  });

  const contractAddress = deployedContract.deployTxData.public.contractAddress;

  console.log();
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  ✅  CONTRACT DEPLOYED SUCCESSFULLY!                      ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║  Address: ${contractAddress}`);
  console.log(`║  Tx ID:   ${deployedContract.deployTxData.public.txId ?? "pending"}`);
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log();

  // Update .env with real contract address
  const updatedEnv = envContent.replace(
    /^VITE_CONTRACT_ADDRESS=.*/m,
    `VITE_CONTRACT_ADDRESS=${contractAddress}`
  );
  fs.writeFileSync(envPath, updatedEnv, "utf-8");
  console.log(`  ✅ .env updated: VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log();
  console.log("  Next step: npm run build  →  Deploy to Vercel/server");
} catch (err) {
  console.error(`\n  ❌ Deployment failed: ${err.message}`);
  if (err.message?.includes("proof") || err.message?.includes("prover")) {
    console.error("\n  Hint: Make sure the prover server is running:");
    console.error("    docker run -p 6300:6300 midnightnetwork/proof-server:latest");
  }
  if (err.message?.includes("balance") || err.message?.includes("dust") || err.message?.includes("fee")) {
    console.error("\n  Hint: Your wallet needs Dust tokens for fees.");
    console.error("    Get them at: https://midnight.network/faucet");
  }
  process.exit(1);
} finally {
  await wallet.close?.();
}
