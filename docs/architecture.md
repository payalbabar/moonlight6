# StegoVault Architecture & Technical Specification

> Note: Detailed architecture specification is available in [`docs/architecture.md`](docs/architecture.md).

StegoVault is a privacy-preserving, client-side steganographic cold-storage application that binds encrypted data to on-chain identity via the **Midnight Network** and **1AM Wallet**.

```
                       ┌──────────────────────────────┐
                       │          1AM Wallet          │
                       │   (Midnight DApp Connector)  │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │       Midnight Preprod       │
                       │   Compact Smart Contract     │
                       │ (Non-sensitive Commitments)  │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │     Local Cryptography       │
                       │   PBKDF2 (100k) + AES-256    │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │    PNG LSB Steganography     │
                       │   (Lossless Pixel Storage)   │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │    Encrypted Cold Storage    │
                       │    (stegovault_secure.zip)   │
                       └──────────────────────────────┘
```

---

## Technical Layers

1. **Layer 1 (Midnight Network & 1AM Wallet):**
   Zero-knowledge authorization and timestamped commitment binding on the Midnight Preprod ledger via Compact smart contract (`contracts/stegovault.compact`). No sensitive data is transmitted on-chain.
2. **Layer 2 (Local Cryptography):**
   Hardware-accelerated PBKDF2 (100,000 iterations) + AES-256-GCM authenticated encryption executing 100% locally in volatile browser memory.
3. **Layer 3 (PNG LSB Steganography):**
   Sequential bit injection into the least significant bits of the Blue pixel channel, packaged into uncompressed `STORE` mode ZIP bundles.

For full architectural breakdown and circuit definitions, see [`docs/architecture.md`](docs/architecture.md).
