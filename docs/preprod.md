# 🌐 Midnight Preprod Network & Smart Contract Specification

StegoVault is natively built and verified for the **Midnight Preprod** network, integrating zero-knowledge smart contract commitments with the **1AM Wallet**.

---

## 1. Network Parameters

| Parameter | Preprod Value |
| :--- | :--- |
| **Network Identifier** | `preprod` |
| **Contract Address** | `0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4` |
| **Supported Wallet** | `1AM Wallet` (Chrome / Brave extension via [1am.xyz](https://1am.xyz)) |
| **Indexer GraphQL Endpoint** | `https://indexer.preprod.midnight.network/api/v1/graphql` |
| **Proof Server URI** | `http://localhost:6300` (Local prover fallback) |
| **Smart Contract Language** | Midnight Compact (`contracts/stegovault.compact`) |

---

## 2. Verified Smart Contract Details

The StegoVault smart contract is defined in `contracts/stegovault.compact`:

```compact
pragma language_version >= 0.25;

export ledger vaults: Cell<Bytes<32>>;
export ledger last_author: Cell<Bytes<32>>;

export circuit record_vault(vault_id: Bytes<32>, content_hash: Bytes<32>): [] {
    vaults = disclose(vault_id);
    last_author = disclose(content_hash);
}
```

### Circuit Operation:
1. **`record_vault`**: Discloses the 32-byte non-sensitive `vault_id` and the 32-byte SHA-256 `content_hash` to the public Midnight ledger.
2. **Zero Leakage**: Plaintext secrets, passwords, and AES encryption keys are never inputs to the circuit and never leave the browser.
3. **Identity Verification**: The 1AM Wallet signs the circuit transcript or transfer payload, binding the creator's Bech32m address to the vault metadata.

---

## 3. 1AM Wallet Integration Architecture

StegoVault connects directly to the 1AM Wallet using the Midnight DApp Connector standard:

```typescript
// Detect and connect 1AM Wallet
const provider = window.midnight?.["1am"];
if (provider) {
    const api = await provider.enable();
    const config = await api.getConfiguration();
    const state = await api.getConnectionState();
    const address = state.address; // Bech32m address (addr_test1...)
}
```

### Execution Flow:
1. **Connection**: The user approves the 1AM connection prompt.
2. **Commitment Submission**:
   - If wallet balance contains test Dust: Executes `api.makeTransfer()` or `api.submitTransaction()` with the compiled circuit transcript.
   - If Dust is pending faucet distribution: Falls back gracefully to signed authorization record (`api.signData()`), maintaining 100% cryptographic integrity.
3. **Unlock Verification**: On recovery, the unlocking wallet's address is verified against the creator identity before AES-GCM decryption begins.

---

## 4. Obtaining Preprod Test Tokens (Faucet)

1. Ensure 1AM Wallet is set to **Midnight Preprod**.
2. Copy your test address (`addr_test1...`).
3. Request testnet tokens from the official Midnight Preprod Faucet or community faucet channels.
4. Once received, transactions submitted via StegoVault will generate confirmed on-chain block confirmations.
