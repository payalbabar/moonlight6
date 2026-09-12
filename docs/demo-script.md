# 🎬 StegoVault Level 5 Demo Video Script & Reviewer Guide

This script provides an exact 3-minute walkthrough sequence for recording the Level 5 demo video and guiding evaluators through the complete StegoVault application on **Midnight Preprod**.

---

## ⏱️ Video Structure Overview (Total Duration: ~3:00)

| Timestamp | Scene / Section | Key Talking Points | Visual Action |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:25** | 1. Landing Page & Overview | StegoVault mission: Client-side steganographic cold storage powered by Midnight Network & 1AM Wallet. | Show Landing Page, hero animation, three security layers, and feature cards. |
| **0:25 - 0:45** | 2. 1AM Wallet & Network | Exclusively built for Midnight Preprod via official DApp connector. | Click **CONNECT 1AM WALLET**, approve extension popup, transition to `/app`. |
| **0:45 - 1:05** | 3. Onboarding & Diagnostics | Interactive 5-step onboarding guide and live Preprod network status bar. | Open **📖 Quick Start Guide**, step through slides, highlight RPC latency ping. |
| **1:05 - 1:40** | 4. Vault Sealing (The Vault) | Lossless PNG validation, live payload capacity meter, local PBKDF2 + AES-256-GCM, Midnight commitment. | Drop PNG image, observe capacity bar, enter secret seed phrase + password, click **🔐 SEAL THE VAULT**, approve in 1AM Wallet, download `stegovault_secure.zip`. |
| **1:40 - 2:15** | 5. Unlock & Verification (The Key) | On-chain commitment verification, wallet identity binding check, AEAD tag authentication. | Drop `vault.png`, observe Bound Wallet badge, enter password, click **🔓 UNLOCK THE VAULT**, reveal secret in browser memory, click Copy. |
| **2:15 - 2:40** | 6. Feedback Loop System | In-app feedback loop directly driving product enhancements. | Click **💬 Feedback Loop**, submit a test review, switch to History tab showing 100% resolution rate and JSON export. |
| **2:40 - 3:00** | 7. Preprod Users & Testing | 50 verified Preprod users, 34 passing automated tests, open source on GitHub. | Briefly show `docs/preprod-users.md` register, terminal test output (34 tests passing), and closing summary. |

---

## 📋 Step-by-Step Recording Actions

### Scene 1: Landing Page (0:00 - 0:25)
1. Start recording at `http://localhost:5173` (or `https://stegovault.vercel.app`).
2. Scroll through the Landing Page highlighting:
   - "Hide seed phrases inside ordinary images using AES-256-GCM and Midnight commitments."
   - The Three Security Layers (Midnight & 1AM Wallet, AES-256-GCM, PNG LSB Steganography).

### Scene 2: Wallet Connection (0:25 - 0:45)
1. Click **CONNECT 1AM WALLET**.
2. Show the 1AM Wallet popup connecting to **Midnight Preprod**.
3. Click **LAUNCH STEGOVAULT** to navigate to `/app`.

### Scene 3: Network Diagnostics & Onboarding (0:45 - 1:05)
1. Point out the top **Network Status Bar** (`Midnight Preprod`, `Connected`, `RPC Ping: ~55ms`, `Contract: 0200578f...63c4`).
2. Click **📖 Quick Start** to open the interactive `OnboardingGuide` modal and cycle through steps 1–5.

### Scene 4: Sealing a Vault (1:05 - 1:40)
1. In the **THE VAULT** panel:
   - Drop a clean PNG image.
   - Note the **Payload Capacity Bar** updating in real time.
   - Enter secret: `venture direct quantum silver galaxy orbit mystery horizon secret seed`
   - Enter password: `MidnightPreprod2026!`
   - Click **🔐 SEAL THE VAULT**.
2. Watch the live **TerminalLog** daemon print each step:
   - `[CRYPTO] PBKDF2 key derivation (100,000 iterations)...`
   - `[MIDNIGHT] Submitting vault commitment...`
   - `[STEGO] Injecting encrypted payload into blue-channel LSBs...`
   - `[SUCCESS] VAULT SEALED ✓ — stegovault_secure.zip downloaded!`

### Scene 5: Unlocking the Vault (1:40 - 2:15)
1. Extract `vault.png` from the downloaded zip.
2. In the **THE KEY** panel:
   - Drop `vault.png`.
   - Highlight the **Bound Wallet** badge verifying your 1AM wallet identity.
   - Enter password `MidnightPreprod2026!`.
   - Click **🔓 UNLOCK THE VAULT**.
3. Observe the revealed secret safely in browser memory and click **📋 Copy**.

### Scene 6: In-App Feedback Loop (2:15 - 2:40)
1. Click **💬 Feedback Loop** in the top navigation.
2. Submit a test feedback entry.
3. Switch to the **Feedback History & Status** tab showing all tracked entries and resolutions.
4. Click **📥 Export JSON**.

### Scene 7: 50 Preprod Users & Test Suite (2:40 - 3:00)
1. Briefly showcase the 50-user register in `docs/preprod-users.md`.
2. Conclude by highlighting the automated test suite with 34 tests passing.
