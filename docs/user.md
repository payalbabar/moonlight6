# 👥 StegoVault — Level 5 User Feedback & Preprod Tester Registry

This document records the user feedback collection methodology, Google Form survey links, Google Sheets response repository, and key product improvements implemented in **StegoVault Level 5** based on real user feedback from Midnight Preprod testers.

---

## 🔗 Official User Feedback Links

| Resource | URL |
| :--- | :--- |
| **📝 Google Feedback Form** | [Submit StegoVault Feedback](https://docs.google.com/forms/d/e/1FAIpQLScJ3STpCvdNjzS04VbuWQ0B2yP4JF2CVpLn5ZPoyAfEuGtWvA/viewform?usp=publish-editor) |
| **📊 Google Sheets Response Sheet** | [View Real-Time Responses](https://docs.google.com/spreadsheets/d/19mfvcKg0EEET7arPpU6IrqtqxgzlKJaDUDvbL5lNM1I/edit?usp=sharing) |
| **🎥 Full Demo Video (YouTube)** | [Watch Demo Video](https://youtu.be/wVrh0jI3wDk?si=V7VFoJBcgly2SP2C) |
| **70 Preprod Users Registry** | [docs/preprod-users.md](preprod-users.md) |
| **In-App Feedback Loop** | Available via the **"💬 Feedback Loop"** modal button in StegoVault UI |

---

## 🚀 Key Product Improvements Implemented in Level 5

Based on structured feedback collected from 70 Midnight Preprod testers, the following core improvements were implemented:

### 1. 📱 Mobile Responsive UI Architecture
- **Problem Raised by Users:** Initial desktop layouts were difficult to navigate on mobile browsers and smartphones.
- **Solution Delivered:**
  - Implemented complete CSS media query architecture (`@media (max-width: 768px)` and `@media (max-width: 480px)`).
  - Landing page top navigation, hero CTAs, and 6-step How It Works cards collapse into single-column layouts for touch devices.
  - Long 1AM Wallet addresses (`mn_addr_preprod...`) and smart contract hashes format cleanly with single-line truncation and one-click copy buttons.

### 2. 🎨 Enhanced Cyberpunk Design System
- **Problem Raised by Users:** Users requested a cleaner, high-contrast, modern interface with better visual feedback for cover PNG selection and payload size limits.
- **Solution Delivered:**
  - Designed a high-contrast Cyberpunk dark-mode palette (`#0a0e17` background, `#00e5ff` cyan, `#39ff14` green, `#bf5af2` purple).
  - Added a **Real-Time Stego Image Capacity Bar** detecting pixel resolution (`width × height / 8 - 4`) and estimating payload capacity dynamically.
  - Created a 5-step visual workflow progress tracker (`Connect → Protect → Commit → Embed → Save`).

### 3. ⚡ Real-Time Wallet Transactions & Diagnostic Diagnostics
- **Problem Raised by Users:** Testers wanted clear, real-time visual feedback when approving transactions in the 1AM Wallet popup and tracking Midnight Preprod ledger confirmations.
- **Solution Delivered:**
  - Built a **Real-Time Network Status Bar** displaying RPC ping latency (ms), 1AM DApp connector status, active Midnight contract address, and wallet identity.
  - Added live state-machine progress steps (`PREPARING → WAITING FOR WALLET → PROVING → SUBMITTING → CONFIRMING → DEPLOYED`).
  - Integrated an interactive live terminal log broadcasting cryptographic PBKDF2 iterations, AES-256-GCM encryption events, and transaction commitment hashes.

---

## 📋 Structured Tester Feedback Summary (Sample Highlights)

| Tester Name | Role | Rating | Key Feature Tested | Feedback Summary | Action Taken |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **payal** | Developer | 5/5 | 🔄 Full MVP Flow | *"Complete encrypt, on-chain seal & decrypt flow worked seamlessly."* | Verified end-to-end ZK authorization. |
| **Paras** | Web3 User | 5/5 | ⚡ 1AM Wallet Connector | *"Smooth 1AM Wallet connection & contract seal."* | Enhanced address copying and connection state persistence. |
| **sneha k** | Student | 5/5 | 📱 Mobile Responsiveness | *"Responsive mobile UI tested cleanly on Android phone."* | Refined CSS breakpoint rules for sub-480px devices. |
| **Deepak** | Developer | 5/5 | 🔐 Client-Side Cryptography | *"Zero-knowledge client-side encryption verified."* | Confirmed 100% PBKDF2/AES data remains in browser volatile memory. |
| **Harshad** | Developer | 5/5 | 📜 Compact Smart Contract | *"Compact contract state hash verified on-chain."* | Added instant contract address copy & re-deploy features. |

---

## 🔒 Verification & Privacy Safety Policy

1. **Public Wallet Addresses Only:** Only public Bech32m addresses on Midnight Preprod (`mn_addr_preprod...` / `mn_dust_preprod...`) are recorded.
2. **Zero Plaintext Storage:** Seed phrases, private keys, passwords, and decrypted secret payloads are **NEVER** transmitted to any server or recorded in logs.
3. **Transparent Data Collection:** User feedback is collected voluntarily via Google Forms and the open-source in-app feedback modal.
