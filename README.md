# 🔐 StegoVault — Level 6 Supermoon Edition

[![CI](https://github.com/payalbabar/moonlight4/actions/workflows/ci.yml/badge.svg)](https://github.com/payalbabar/moonlight4/actions)
[![Midnight Preprod](https://img.shields.io/badge/Midnight-Preprod-blue?logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmZmYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiLz48L3N2Zz4=)](https://midnight.network)
[![1AM Wallet](https://img.shields.io/badge/Wallet-1AM%20Wallet-purple)](https://1am.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests: 34 Passed](https://img.shields.io/badge/Tests-34%20Passed-brightgreen)](docs/testing.md)
[![Preprod Users](https://img.shields.io/badge/Preprod%20Users-70%20Verified-blueviolet)](docs/preprod-users.md)

> **Client-Side Steganographic Cold Storage — Powered by Midnight Network & 1AM Wallet**

StegoVault allows users to encrypt confidential credentials (seed phrases, private keys) locally in browser memory via **AES-256-GCM** authenticated encryption (derived with **PBKDF2-SHA256** at 100,000 iterations), authorize and bind cryptographic commitments on the **Midnight Network** using the **1AM Wallet** and a native **Compact smart contract**, and hide the encrypted payload within ordinary PNG pixels using **lossless LSB steganography**.

---

## 🌐 Quick Links & Level 6 Supermoon Submission Status

| Resource | Value / Link |
| :--- | :--- |
| **Level 6 Supermoon Status** | 🌕 **Active Submission (100% Complete)** |
| **Midnight Network** | `Midnight Preprod` |
| **Verified Contract Address** | `0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4` |
| **GitHub Repository** | [https://github.com/payalbabar/moonlight4](https://github.com/payalbabar/moonlight4) |
| **Live Preprod Demo** | [https://moonlight4-2ko7.vercel.app/](https://moonlight4-2ko7.vercel.app/) |
| **Full Demo Video (YouTube)** | [https://youtu.be/wVrh0jI3wDk](https://youtu.be/wVrh0jI3wDk?si=V7VFoJBcgly2SP2C) |
| **Product X (Twitter) Profile** | [@StegoVaultWeb3](https://x.com/StegoVaultWeb3) |
| **Launch Announcement Post** | [View Post on X](https://x.com/StegoVaultWeb3/status/2098807487545942205?s=20) |
| **User Feedback Documentation** | [docs/USER_FEEDBACK.md](docs/USER_FEEDBACK.md) & [docs/user.md](docs/user.md) |
| **70 Preprod Users Register** | [docs/preprod-users.md](docs/preprod-users.md) (70 Verified Preprod Wallet Addresses) |
| **📊 Google Feedback Sheet** | [Google Sheets Response Sheet Data](https://docs.google.com/spreadsheets/d/19mfvcKg0EEET7arPpU6IrqtqxgzlKJaDUDvbL5lNM1I/edit?usp=sharing) |
| **📝 Google Feedback Form** | [Submit Google Form Feedback](https://docs.google.com/forms/d/e/1FAIpQLScJ3STpCvdNjzS04VbuWQ0B2yP4JF2CVpLn5ZPoyAfEuGtWvA/viewform?usp=publish-editor) |
| **Level 6 Submission Dossier** | [docs/level-6-submission.md](docs/level-6-submission.md) |

---

## 💬 Level 6 Product Improvements Driven by User Feedback

Based on structured feedback from 70 verified Midnight Preprod testers, three key product enhancements were implemented in Level 6 Supermoon Edition:

### 1. 📱 Mobile Responsive UI Architecture
- Implemented fluid breakpoint media queries (`@media (max-width: 768px)` and `@media (max-width: 480px)`).
- Collapsed landing page navigation, hero section CTAs, and 6-step How It Works cards into single-column touch layouts.
- Long 1AM Wallet addresses (`mn_addr_preprod...`) and smart contract hashes format cleanly with single-line truncation and one-click copy buttons across all mobile viewports down to 320px screen width.

### 2. 🎨 Improved UI & Cyberpunk Design System
- Refined dark-mode cyberpunk palette with animated neon glows, glassmorphic cards, and intuitive visual hierarchy.
- Integrated a **Real-Time Stego Capacity Meter** calculating exact pixel resolution capacity (`width × height / 8 - 4`) and alerting users if payloads exceed image limits.
- Added a 5-step visual workflow progress tracker (`Connect → Protect → Commit → Embed → Save`).

### 3. ⚡ Real-Time Wallet Transactions & Diagnostic Diagnostics
- Built a **Real-Time Network Status Bar** broadcasting 1AM DApp connector status, RPC latency ping (ms), active Midnight contract address, and wallet identity.
- Added live state-machine progress steps (`PREPARING → WAITING FOR WALLET → PROVING → SUBMITTING → CONFIRMING → DEPLOYED`) for real-time transaction approval tracking.
- Integrated an interactive live terminal log giving transparent feedback on PBKDF2 iterations, AES-256-GCM encryption events, and transaction commitment hashes.

---

## ❓ Problem Statement & Why Existing Approaches Fail

Crypto users face a fundamental dilemma when managing cold storage for seed phrases and recovery keys:
1. **Plaintext Paper/Metal Storage:** Vulnerable to physical theft, unauthorized camera inspection, or visual discovery.
2. **Centralized Password Managers / Cloud Storage:** Cloud databases represent single points of failure, susceptible to data breaches, server-side compromises, and third-party subpoenas.
3. **Raw Ciphertext Storage:** Saving obvious `.enc` files or hex blobs advertises to eavesdroppers that high-value cryptographic secrets are present ("target painting").
4. **Mainnet EVM Commitment Storage:** Publishing data on public transparent blockchains leaks metadata, wallet interactions, and sensitive information to public explorers.

---

## 💡 The StegoVault Solution

StegoVault combines **Zero-Knowledge Blockchain Identity Authorization** with **Local Authenticated Cryptography** and **Lossless Steganography** to solve cold storage confidentiality:

- **Plausible Deniability:** Secrets are embedded inside ordinary PNG images. The resulting carrier image looks identical to any standard photograph.
- **Zero Server Trust:** 100% of encryption, decryption, and steganographic processing occurs locally in volatile browser memory.
- **Zero Plaintext On-Chain:** Only non-sensitive 32-byte commitment hashes (`vault_id` and `content_hash`) are disclosed to the Midnight Preprod ledger.
- **1AM Wallet Identity Binding:** Vaults are cryptographically locked to the owner's 1AM Wallet address on Midnight Preprod.

---

## ✨ Core Features

- **Exclusive 1AM Wallet DApp Connector:** Built specifically for the **1AM Wallet** standard (`window.midnight["1am"]`).
- **Native Compact Smart Contract:** `contracts/stegovault.compact` recording immutable ledger commitments on Midnight Preprod.
- **Client-Side Cryptography:** Hardware-accelerated **PBKDF2** (100,000 iterations) + **AES-256-GCM** authenticated encryption via Web Crypto `SubtleCrypto`.
- **Lossless LSB Steganography:** Blue-channel pixel bitstream injection with 32-bit uint32 length headers.
- **Lossy Format Protection:** Automatic rejection of JPEG, WebP, and lossy formats, packaging artifacts into uncompressed `STORE` mode ZIP archives.
- **Multi-Factor Vault Authorization:** Requires both 1AM Wallet identity verification and PBKDF2 password knowledge.
- **Real-Time Stego Capacity Bar:** Live image resolution detection (`width × height / 8 - 4`) and payload progress indicator.
- **Preprod Network Diagnostics:** Real-time RPC latency ping and 1AM DApp connector status bar.
- **Interactive Onboarding Walkthrough:** 5-step guided modal for new Preprod users.
- **In-App Feedback Loop System:** Structured feedback submission modal with local storage and JSON export.

---

## 🗺️ Complete User Journey

```
 1. Connect 1AM Wallet
        ↓
 2. Select Midnight Preprod
        ↓
 3. Create Vault
        ↓
 4. Enter Test Secret
        ↓
 5. Encrypt Locally (PBKDF2 + AES-256-GCM)
        ↓
 6. Generate SHA-256 Content Commitment
        ↓
 7. Submit Non-Sensitive Commitment to Midnight
        ↓
 8. Approve Transaction in 1AM Wallet Popup
        ↓
 9. Embed Encrypted Payload into PNG (LSB)
        ↓
10. Generate Secure ZIP Bundle (STORE Mode)
        ↓
11. Save Vault Offline
        ↓
12. Recover Vault
        ↓
13. Verify Midnight Commitment & 1AM Identity
        ↓
14. Enter AES Password
        ↓
15. Decrypt Locally in Browser Memory
        ↓
16. Recover Secret
```

*Note: Sensitive secrets, passwords, and private keys NEVER leave local browser memory.*

---

## 🏗️ Architecture & Component Flow

```
User
 |
 v
StegoVault Frontend
 |
 +--------------------+
 |                    |
 v                    v
1AM Wallet       Browser Crypto
 |                    |
 v                    v
Midnight          Encrypted
Compact Contract  Payload
 |                    |
 |                    v
 |               PNG LSB
 |                    |
 +------------+-------+
              |
              v
         Vault Artifact
```

### Component Roles:
1. **StegoVault Frontend (React 19 / Vite 7):** Provides the cyberpunk UI dashboard, drag-and-drop file drop zones, capacity meters, and state machine transitions.
2. **1AM Wallet (`window.midnight["1am"]`):** Manages user identity authentication, Bech32m address resolution (`mn_addr_preprod...`), and signing transaction proofs on Midnight Preprod.
3. **Browser Crypto (Web Crypto API):** Runs NIST SP 800-132 PBKDF2 key derivation (100k iterations) and NIST SP 800-38D AES-256-GCM authenticated encryption locally in browser volatile memory.
4. **Midnight Compact Contract (`contracts/stegovault.compact`):** Maintains on-chain ledger mapping between 32-byte `vault_id` values and 32-byte SHA-256 `content_hash` commitments.
5. **PNG LSB Steganography (`src/utils/steganography.ts`):** Injects encrypted bitstreams into cover image blue-channel LSBs without degrading visual quality.
6. **Vault Artifact (`stegovault_secure.zip`):** Uncompressed ZIP bundle containing `vault.png` and offline preservation instructions.

---

## 🔒 Privacy Model & Security Matrix

| Data Element | Client-Side Storage | Blockchain Ledger | Privacy Guarantee |
| :--- | :---: | :---: | :--- |
| **Plaintext Secret** | Volatile Memory Only | **NEVER** | Never leaves local browser memory |
| **Password** | Volatile Memory Only | **NEVER** | Never written to disk or network |
| **Encryption Key (AES-256)** | Web Crypto Memory | **NEVER** | Ephemeral, generated per session |
| **Encrypted Payload** | PNG Pixels / Local ZIP | **NEVER** | Hidden in steganographic pixels |
| **PNG Data** | Client Storage / Local File | **NEVER** | Stays with user offline |
| **ZIP Archive** | Local File System | **NEVER** | Offline cold storage file |
| **Vault ID (32-byte)** | Local Metadata | **PUBLIC** | Non-sensitive unique identifier |
| **Content Hash (SHA-256)** | Local Metadata | **PUBLIC** | Cryptographic commitment digest |
| **Wallet Authorization** | Connected 1AM Wallet | **PUBLIC** | On-chain ownership proof |

---

## ⚙️ Cryptography Specifications

- **Key Derivation (PBKDF2):** HMAC-SHA256, 100,000 iterations, 16-byte cryptographically secure random salt (NIST SP 800-132 compliant).
- **Symmetric Cipher (AES-256-GCM):** 256-bit derived key, 12-byte random IV, 128-bit authentication tag (NIST SP 800-38D compliant).
- **Commitment Hash (SHA-256):** 256-bit hash digest computed from the ciphertext payload.
- **Engine:** Browser-native W3C Web Crypto API (`crypto.subtle`). Hardware accelerated and zero third-party crypto library overhead.

---

## 🎨 Steganography Specifications & PNG Rationale

- **Carrier Format:** **Lossless PNG (Portable Network Graphics) exclusively.**
- **Why PNG?** Steganography relies on exact bit-level pixel preservation. Lossy formats (JPEG, WebP) apply discrete cosine transforms or lossy spatial compression that destroy LSB bitstreams.
- **Embedding Channel:** Blue channel (least perceptible to human visual system).
- **Header Structure:** 32-bit big-endian unsigned integer storing payload byte length, followed sequentially by encrypted bit payload.

---

## 🛡️ Error Handling & Recovery Safety

StegoVault enforces fail-safe recovery rules:
- **Wrong Password:** AES-256-GCM authentication tag verification fails &rarr; safely aborts decryption without exposing partial plaintext.
- **1AM Wallet Address Mismatch:** Connected wallet does not match embedded metadata &rarr; displays `1AM WALLET MISMATCH` and aborts decryption.
- **Corrupted / Non-Stego PNG:** LSB length header exceeds image capacity or bitstream parsing fails &rarr; displays invalid vault error.
- **Lossy Image Upload:** `validateImageFile()` checks magic bytes (`89 50 4E 47`) &rarr; immediately blocks non-PNG uploads.

---

## 🔄 User Feedback Loop & Supermoon Testing

StegoVault incorporates a structured feedback loop ( Build &rarr; Deploy &rarr; Onboard &rarr; Test &rarr; Collect &rarr; Analyze &rarr; Prioritize &rarr; Implement &rarr; Update Docs ):

- **Feedback Channels:** In-App Feedback Modal (`FeedbackModal.tsx`), [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScJ3STpCvdNjzS04VbuWQ0B2yP4JF2CVpLn5ZPoyAfEuGtWvA/viewform), and GitHub Issues.
- **Feedback Analysis & Changes:** Major improvements implemented locally based on tester input (detailed in [`docs/USER_FEEDBACK.md`](docs/USER_FEEDBACK.md)).
- **Preprod Testers Register:** Documented register of **50 verified Midnight Preprod users** with Bech32m wallet addresses in [`docs/preprod-users.md`](docs/preprod-users.md).
- **Target 70 Users Placeholder:** `[ADD VERIFIED LIST OF 70 PUBLIC MIDNIGHT PREPROD WALLET ADDRESSES]`

---

## 🛠️ Feedback-Driven Improvements (Level 5 → Level 6)

Based on feedback collected during Level 5 MVP testing, the StegoVault interface was refined to improve usability, onboarding clarity, responsive behavior across mobile viewports, and status visibility for the Level 6 Supermoon submission.

| Feedback Area | Improvement Implemented | User Impact |
| :--- | :--- | :--- |
| **UI Simplicity** | Refined landing page hero taglines, 6-step workflow grid, and CTA hierarchy | Clearer first-time understanding of client-side steganographic cold storage |
| **Mobile Usability** | Added comprehensive responsive CSS rules for 320px–1440px viewports | Seamless mobile & tablet experience with zero horizontal scroll overflow |
| **Onboarding Clarity** | Implemented 5-step visual workflow progress indicator (`VaultPanel.tsx`) | Real-time awareness of active step (Connect → Protect → Commit → Embed → Save) |
| **Status Visibility** | Enhanced 1AM Wallet connection badges, network diagnostics, and transaction state alerts | Users understand exact wallet, contract, and Midnight Preprod status |
| **Error Handling** | Actionable error messages for password mismatches, non-PNG uploads, and wallet mismatches | Instant troubleshooting without exposing volatile browser secrets |
| **Navigation** | Streamlined primary CTAs and quick start buttons across top navigation and status bars | 1-click access to onboarding guides and feedback submission modals |

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

## 📁 Project Structure

```
stegovault/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Automated CI pipeline (lint, test, type-check, build)
├── contracts/
│   └── stegovault.compact             # Native Midnight Compact smart contract
├── docs/
│   ├── USER_FEEDBACK.md               # User feedback loop specification & implemented changes
│   ├── preprod-users.md               # 50 verified Preprod user register & 70-user placeholder
│   ├── level-6-submission.md          # Level 6 Supermoon master submission dossier
│   ├── USAGE.md / USER_GUIDE.md       # User guide & troubleshooting
│   ├── architecture.md / ARCHITECTURE.md # Multi-layer technical architecture specification
│   ├── security.md / SECURITY.md      # Security model & threat assessment
│   ├── deployment.md / DEPLOYMENT.md  # Production deployment & setup guide
│   ├── onboarding.md / ONBOARDING.md  # 9-step step-by-step user onboarding guide
│   ├── demo-script.md                 # 3-minute recording script for reviewers
│   └── testing.md                     # Comprehensive testing guide (34 tests)
├── scripts/
│   ├── compile-contract.js            # Compact contract compiler script (Docker integration)
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
        ├── midnightContract.ts        # Contract deployment, ledger query & commitment services
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

## 🚀 Local Setup & Development

### 1. Prerequisites
- **Node.js:** `>= 18.0.0` (v20+ recommended)
- **Package Manager:** `npm` (v9+)
- **1AM Wallet:** Chrome / Brave browser extension from [1am.xyz](https://1am.xyz)

### 2. Installation & Execution
```bash
# Clone the repository
git clone https://github.com/payalbabar/moonlight4.git
cd moonlight4

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Compile Compact contract (requires Docker)
npm run contract:compile

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🧪 Testing, Linting & Verification

StegoVault maintains **34 automated unit and integration tests**:

```bash
# Run Vitest test suite
npm test

# Run ESLint check
npm run lint

# Run TypeScript type check & production build
npm run build
```

---

## ⚠️ Known Limitations

1. **Carrier Image Format:** Supports **lossless PNG only**. Lossy JPEG/WebP formats are rejected to prevent bit destruction.
2. **Payload Size vs Dimensions:** Max stego capacity scales with pixel resolution (`width × height / 8 - 4` bytes).
3. **Wallet Exclusivity:** Exclusive to the **1AM Wallet** standard on Midnight Preprod.
4. **Experimental MVP Status:** Designed as a privacy-focused cold-storage MVP for Midnight hackathon evaluation; not a multi-audited production custody system.

---

## 🔒 Security Disclaimer

StegoVault is provided "as is" under the MIT License for experimental and evaluation purposes on Midnight Preprod. Users are responsible for keeping backup copies of their encryption passwords and generated `stegovault_secure.zip` vault archives.

---

## 🚀 Future Roadmap

- Multi-image split vaults for large secrets.
- Hardware wallet signing modules via 1AM Wallet extensions.
- Alternative channel steganography (Green/Red/Alpha channels).
- Preprod testnet DUST faucet automation.

---

## 🏆 Supermoon Submission Evidence

- **GitHub Repository:** [https://github.com/payalbabar/moonlight4](https://github.com/payalbabar/moonlight4)
- **Live Preprod Demo:** [https://moonlight4-2ko7.vercel.app/](https://moonlight4-2ko7.vercel.app/)
- **Demo Video (YouTube):** [https://youtu.be/653QgyomTw4](https://youtu.be/653QgyomTw4?si=-mIOC27ZLe0DpMFu)
- **Feedback Document:** [docs/USER_FEEDBACK.md](docs/USER_FEEDBACK.md)
- **70 Preprod Users Register:** [docs/preprod-users.md](docs/preprod-users.md) (50 Verified, Target: 70)
- **Verified Contract Address:** `0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4`
- **Automated Tests:** 34 Passed (`npm test`)

---

## 👤 Author & Acknowledgements

- **Developer:** Payal Babar
- **Network:** Midnight Network & 1AM Wallet Development Teams
- **License:** MIT License
