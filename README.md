# 🔐 StegoVault — Level 5 Full Moon Edition

[![CI](https://github.com/payalbabar/moonlight4/actions/workflows/ci.yml/badge.svg)](https://github.com/payalbabar/moonlight4/actions)
[![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod-blue?logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiLz48L3N2Zz4=)](https://midnight.network)
[![1AM Wallet](https://img.shields.io/badge/Wallet-1AM%20Wallet-purple)](https://1am.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests: 34 Passed](https://img.shields.io/badge/Tests-34%20Passed-brightgreen)](docs/testing.md)
[![Preprod Users: 50](https://img.shields.io/badge/Preprod%20Users-50%20Verified-blueviolet)](docs/preprod-users.md)

> **Client-Side Steganographic Cold Storage — Powered by Midnight Network & 1AM Wallet**

StegoVault allows users to encrypt confidential credentials (seed phrases, private keys) locally in browser memory via **AES-256-GCM** authenticated encryption (derived with **PBKDF2-SHA256** at 100,000 iterations), authorize and bind cryptographic commitments on the **Midnight Network** using the **1AM Wallet** and a native **Compact smart contract**, and hide the encrypted payload within ordinary PNG pixels using **lossless LSB steganography**.

---

## 🌐 Quick Links & Preprod Contract

| Resource | Value / Link |
| :--- | :--- |
| **Midnight Network** | `Midnight Preprod` |
| **Verified Contract Address** | `0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4` |
| **GitHub Repository** | [https://github.com/payalbabar/moonlight4](https://github.com/payalbabar/moonlight4) |
| **Live Preprod Demo** | [https://stegovault.vercel.app](https://stegovault.vercel.app) |
| **Product X (Twitter) Profile** | [@StegoVaultWeb3](https://x.com/StegoVaultWeb3) |
| **Launch Announcement Post** | [View Post on X](https://x.com/StegoVaultWeb3/status/2098807487545942205?s=20) |
| **Full Demo Video (YouTube)** | [https://youtu.be/653QgyomTw4](https://youtu.be/653QgyomTw4?si=-mIOC27ZLe0DpMFu) |
| **Level 5 Submission Dossier** | [docs/level-5-submission.md](docs/level-5-submission.md) |
| **50 Preprod User Registry** | [docs/preprod-users.md](docs/preprod-users.md) |
| **Feedback Loop Specification** | [docs/feedback-loop.md](docs/feedback-loop.md) |
| **Feedback Tracking Log** | [docs/feedback.md](docs/feedback.md) |

---

## 🌕 Level 5 — Full Moon Highlights

StegoVault has advanced from its Level 4 MVP into a production-grade, user-verified application with:

1. **50 Real Preprod Users:** Documented registry of 50 testnet users who tested the application on Midnight Preprod ([`docs/preprod-users.md`](docs/preprod-users.md)).
2. **Structured Developer Feedback Loop:** In-app feedback modal, structured categorization, and 100% resolution of high/medium priority items ([`docs/feedback-loop.md`](docs/feedback-loop.md)).
3. **Interactive Onboarding Walkthrough:** 5-step quick-start guide built directly into the UI ([`docs/onboarding.md`](docs/onboarding.md)).
4. **Preprod Network Diagnostics:** Real-time status bar showing Midnight Preprod RPC latency ping and 1AM DApp connector readiness.
5. **Dynamic Stego Capacity Meter:** Live pixel resolution calculator and payload progress bar in `VaultPanel.tsx`.
6. **34 Automated Tests:** Full test suite covering crypto, stego, files, contracts, and feedback workflows ([`docs/testing.md`](docs/testing.md)).

---

## 🏗️ Architecture: The Three Security Layers

```
                        ┌──────────────────────────────┐
                        │          1AM Wallet          │
                        │  (Midnight DApp Connector)   │
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

- **Layer 1 (Midnight & 1AM Wallet):** Zero-knowledge identity authorization and timestamped commitment binding on the Midnight Preprod ledger.
- **Layer 2 (Local Cryptography):** Hardware-accelerated PBKDF2 (100,000 iterations) + AES-256-GCM authenticated encryption in browser memory.
- **Layer 3 (LSB Steganography):** Lossless blue-channel pixel bit injection packaged into uncompressed `STORE` ZIP bundles.

---

## 🔒 Privacy Model: What Stays Private vs. What is Public

| Domain | Data Element | Location / Storage | Privacy Guarantee |
| :--- | :--- | :--- | :--- |
| **100% Private** | Plaintext seed phrases & keys | Browser volatile memory | **Never leaves browser memory** |
| **100% Private** | PBKDF2 derived AES symmetric keys | Web Crypto `SubtleCrypto` | **Never written to disk or network** |
| **100% Private** | 12-byte initialization vectors (IV) | Web Crypto memory | **Ephemeral per-encryption** |
| **Public On-Chain** | 32-byte non-sensitive `vault_id` | Midnight Compact Ledger | **Non-sensitive unique identifier** |
| **Public On-Chain** | 32-byte ciphertext `content_hash` | Midnight Compact Ledger | **SHA-256 commitment digest** |
| **Public Proof** | 1AM Wallet Identity | Midnight Preprod Ledger | **Proves ownership without revealing secret** |

---

## ✨ Working Features

- **Exclusive 1AM Wallet DApp Connector:** Native integration via `window.midnight["1am"]`.
- **Native Compact Smart Contract:** `contracts/stegovault.compact` recording immutable ledger commitments.
- **Contract Deployment State Machine:** Live in-app deployment workflow (`ContractDeployment.tsx`) with zero-knowledge proof generation and confirmation tracking.
- **Client-Side Cryptography:** PBKDF2 (100k iterations) + AES-256-GCM authenticated encryption.
- **Lossless LSB Steganography:** Blue-channel pixel injection with 32-bit uint32 length header.
- **Lossy Compression Protection:** Strict validation rejecting JPEG, WebP, and lossy formats, packaging vaults into uncompressed `STORE` ZIP bundles.
- **Wallet Identity Binding:** Verifies the unlocking wallet against the creator identity before allowing decryption.
- **Stego Payload Capacity Meter:** Live image resolution detection and payload percentage indicator.
- **Network Diagnostics Bar:** Live Midnight Preprod RPC latency ping and contract status.
- **In-App Feedback Modal:** Direct user feedback submission with local storage and JSON export.
- **Interactive Onboarding Guide:** 5-step interactive walkthrough for new Preprod users.
- **Live Cyberpunk Terminal Log:** Real-time audit log daemon streaming cryptographic events.

---

## 💻 Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.9, Vite 7 |
| **Styling** | Custom Cyberpunk Design System (Vanilla CSS + Tailwind CSS tokens) |
| **Blockchain** | Midnight Network Preprod, Compact Smart Contract Language 0.25 |
| **Wallet Connector** | `@midnight-ntwrk/dapp-connector-api`, 1AM Wallet Extension |
| **Cryptography** | Web Crypto API (`crypto.subtle`), PBKDF2, AES-256-GCM, SHA-256 |
| **Packaging** | JSZip (Lossless `STORE` mode compression) |
| **Testing** | Vitest 5.0 (34 unit & integration tests) |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js:** `>= 18.0.0` (v20+ recommended)
- **Package Manager:** `npm` (v9+)
- **1AM Wallet:** Chrome / Brave browser extension from [1am.xyz](https://1am.xyz)

### 2. Installation & Run
```bash
# Clone the repository
git clone https://github.com/payalbabar/moonlight4.git
cd moonlight4

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start local development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
# Midnight Preprod Network Configuration
VITE_MIDNIGHT_NETWORK_ID=preprod
VITE_MIDNIGHT_INDEXER_URI=https://indexer.preprod.midnight.network/api/v1/graphql
VITE_MIDNIGHT_PROOF_SERVER_URI=http://localhost:6300

# Verified StegoVault Compact Contract
VITE_STEGOVAULT_CONTRACT_ADDRESS=0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4
```

---

## 🧪 Testing & Verification

StegoVault includes **34 automated unit and integration tests**:

```bash
# Run full Vitest test suite
npm test

# Run ESLint validation
npm run lint

# Run TypeScript type check & production build
npm run build
```

---

## 📁 Repository Structure

```
stegovault/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Automated CI pipeline (lint, test, type-check, build)
├── contracts/
│   └── stegovault.compact             # Native Midnight Compact smart contract
├── docs/
│   ├── USAGE.md                       # Complete user-facing usage guide & troubleshooting
│   ├── demo-script.md                 # Reviewer & recording demo script (3-minute flow)
│   ├── architecture.md                # Multi-layer technical architecture specification
│   ├── security.md                    # Security model and threat assessment
│   ├── setup.md                       # Local environment setup and development guide
│   ├── preprod.md                     # Midnight Preprod network parameters & contract specs
│   ├── onboarding.md                  # Step-by-step user onboarding guide
│   ├── preprod-users.md               # 50 verified Preprod user register
│   ├── feedback-loop.md               # Structured feedback loop specification
│   ├── feedback.md                    # Feedback tracking log with implemented resolutions
│   ├── testing.md                     # Comprehensive testing guide (34 tests)
│   ├── deployment.md                  # Preprod deployment and hosting guide
│   └── level-5-submission.md          # Master Level 5 Full Moon submission dossier
├── scripts/
│   ├── compile-contract.js            # Compact contract compiler script
│   └── build-esm-contract.js          # ESM transpilation bridge for WebAssembly
├── src/
│   ├── __tests__/
│   │   ├── crypto.test.ts             # Cryptography engine tests (PBKDF2, AES-GCM, tampering)
│   │   ├── steganography.test.ts      # Blue-channel capacity & bitstream tests
│   │   ├── file-utils.test.ts         # PNG MIME validation & ZIP bundling tests
│   │   ├── compact-contract.test.ts   # Compact runtime constructor & circuit tests
│   │   ├── contract-workflow.test.ts  # Midnight contract utility & ledger tests
│   │   └── feedback-and-onboarding.test.ts # Feedback data model & capacity math tests
│   ├── components/
│   │   ├── ContractDeployment.tsx     # Midnight contract deployment state machine
│   │   ├── VaultPanel.tsx             # Local encryption, capacity bar & LSB sealing panel
│   │   ├── KeyPanel.tsx               # On-chain verification & recovery panel
│   │   ├── TerminalLog.tsx            # Cyberpunk audit terminal daemon
│   │   ├── Wallet.tsx                 # 1AM Wallet status component
│   │   ├── NetworkStatus.tsx          # Real-time Preprod diagnostics & latency ping
│   │   ├── OnboardingGuide.tsx        # Interactive 5-step onboarding walkthrough modal
│   │   └── FeedbackModal.tsx          # In-app feedback submission & history modal
│   ├── context/
│   │   └── WalletContext.tsx          # 1AM Wallet & Midnight provider state
│   ├── hooks/
│   │   └── use1AMWallet.ts            # 1AM Wallet convenience hook
│   ├── pages/
│   │   ├── LandingPage.tsx            # Marketing overview, navigation & CTA page
│   │   └── VaultApp.tsx               # Main application dashboard
│   ├── utils/
│   │   ├── crypto.ts                  # PBKDF2 + AES-256-GCM engine
│   │   ├── midnightContract.ts        # Contract deployment, ledger query & commitment services
│   │   ├── midnightTx.ts              # Midnight DApp Connector providers
│   │   ├── file-utils.ts              # MIME validation & lossless ZIP bundling
│   │   └── steganography.ts           # PNG LSB embed / extract engine
│   ├── App.tsx                        # Application routing
│   ├── index.css                      # Cyberpunk design system
│   └── main.tsx                       # Application entry point
├── package.json                       # Project configuration and dependencies
├── tsconfig.json                      # TypeScript compiler configuration
└── README.md                          # Master project documentation
```

---

## ⚠️ Known Limitations & Future Roadmap

1. **Carrier Format Scope:** StegoVault intentionally supports **lossless PNG only**. Lossy formats (JPEG, WebP) are prohibited by design to prevent steganographic bit destruction.
2. **Payload Size vs Image Dimensions:** Stego capacity scales with pixel count (`(width × height) / 8 - 4` bytes). For multi-megabyte payloads, large 4K PNG images or multi-image split vaults (planned for Level 6) are recommended.
3. **Wallet Exclusivity:** StegoVault is built strictly for the **1AM Wallet** standard on Midnight Preprod.

---

## 📄 License

MIT License. Open source, privacy-first, and client-side verifiable.
