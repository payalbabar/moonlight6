# 🛠️ StegoVault Local Setup & Development Guide

This guide walks through configuring your local environment, installing dependencies, configuring test environments, and executing tests and builds for StegoVault.

---

## 1. System Prerequisites

| Requirement | Supported Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` (v20+ recommended) | Tested with Node v20 LTS on Windows, Linux, and macOS |
| **npm** | `>= 9.0.0` | Default package manager bundled with Node.js |
| **1AM Wallet** | Latest Chrome/Brave extension | Available from [1am.xyz](https://1am.xyz) |
| **Docker** | Optional | Required only if re-compiling Compact contract via `midnightnetwork/compactc` |

---

## 2. Installation & Quick Start

```bash
# 1. Clone the repository (Local development only)
git clone https://github.com/payalbabar/moonlight6.git
cd moonlight6

# 2. Install dependencies
npm install

# 3. Configure local environment
cp .env.example .env

# 4. Start the development server
npm run dev
```

The application will launch locally at `http://localhost:5173`.

---

## 3. Environment Variables Configuration

Create a `.env` file from the provided `.env.example`:

```env
# Midnight Preprod Network Configuration
VITE_MIDNIGHT_NETWORK_ID=preprod
VITE_MIDNIGHT_INDEXER_URI=https://indexer.preprod.midnight.network/api/v1/graphql
VITE_MIDNIGHT_PROOF_SERVER_URI=http://localhost:6300

# Verified StegoVault Compact Contract on Midnight Preprod
VITE_STEGOVAULT_CONTRACT_ADDRESS=0200578f0943ded482a2eb5b575717ab4e88f43c5335bac10f87a28d51536b7d63c4
```

> [!IMPORTANT]
> **Zero Secrets Policy:** Never place seed phrases, private keys, or passwords in `.env` files. All sensitive operations occur exclusively in browser memory using the Web Crypto API.

---

## 4. Running Automated Tests & Code Quality

StegoVault includes 34 unit and integration tests covering cryptography, steganography, ZIP file validation, contract workflows, and the feedback loop:

```bash
# Run full Vitest test suite
npm test

# Run ESLint validation
npm run lint

# Run TypeScript type checks and production bundle build
npm run build
```

---

## 5. 1AM Wallet Preprod Setup

1. Install the **1AM Wallet extension** from [1am.xyz](https://1am.xyz) in Chrome or Brave.
2. In the 1AM Wallet interface, ensure the network selector is set to **Midnight Preprod**.
3. Allow the wallet to sync to 100%.
4. If testing on-chain transfers, obtain test funds via the official Midnight faucet.
5. In the StegoVault app, click **⚡ CONNECT 1AM WALLET** in the top bar to initialize the DApp connector.
