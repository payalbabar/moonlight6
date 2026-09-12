# 📖 Preprod User Onboarding Guide

Welcome to **StegoVault**! This document provides a step-by-step onboarding walkthrough for users testing and evaluating StegoVault on the **Midnight Preprod** network.

---

## 🎯 Onboarding Objectives

By the end of this 5-minute onboarding flow, you will have:
1. Connected your **1AM Wallet** to the Midnight Preprod network.
2. Verified the active **StegoVault Compact Smart Contract**.
3. Encrypted a seed phrase locally with **PBKDF2 + AES-256-GCM**.
4. Authorized an on-chain commitment via **1AM Wallet**.
5. Embedded the payload into a lossless PNG using **blue-channel LSB steganography**.
6. Downloaded your protected `stegovault_secure.zip` cold-storage bundle.
7. Unlocked and verified the vault in browser memory.
8. Submitted feedback into the **Level 5 Developer Feedback Loop**.

---

## Step 1: Install & Connect 1AM Wallet

1. Download the **1AM Wallet extension** from [1am.xyz](https://1am.xyz).
2. Open the extension, select **Midnight Preprod** in the network dropdown.
3. Open the StegoVault Web App at [https://stegovault.vercel.app](https://stegovault.vercel.app) (or `http://localhost:5173`).
4. Click **⚡ CONNECT 1AM WALLET** in the top navigation or landing page.
5. In the 1AM popup, approve the connection request.
6. Verify your address displays in the top status bar (`addr_test1...`).

---

## Step 2: Prepare a Lossless PNG Image

StegoVault embeds encrypted bytes into the least significant bit (LSB) of each pixel's blue channel.

> [!WARNING]
> **Lossless Format Required:** Always use PNG format. Lossy formats (JPEG, WebP) discard high-frequency pixel data during compression, which destroys hidden payloads. StegoVault automatically validates image MIME types and binary headers.

- **Recommended Resolution:** Any PNG image from `800×600` up to `3840×2160`.
- **Payload Capacity:** A `1920×1080` image safely holds **~259 KB** of encrypted data (sufficient for 500+ seed phrases or sensitive keys).

---

## Step 3: Seal Your Vault

1. In the **THE VAULT** panel (left side):
   - Drag & drop your PNG cover image into the drop zone.
   - Observe the live **Stego Payload Capacity meter** reflecting your image resolution.
   - Enter your confidential seed phrase or private key into the secret text area.
   - Enter an encryption password (minimum 8 characters) and confirm it.
2. Click **🔐 SEAL THE VAULT**.
3. In the 1AM Wallet popup, review and approve the commitment authorization.
4. Your browser will locally derive the AES-256 key via 100,000 PBKDF2 iterations, embed the ciphertext into the PNG pixels, and automatically download `stegovault_secure.zip`.

---

## Step 4: Unlock & Recover Your Secret

1. In the **THE KEY** panel (right side):
   - Unzip your `stegovault_secure.zip` and drop the extracted `vault.png` into the drop zone.
   - Observe the **Bound Wallet** and metadata badge confirming your wallet identity.
   - Enter your encryption password.
2. Click **🔓 UNLOCK THE VAULT**.
3. The cryptographic engine verifies your 1AM wallet identity, extracts the LSB bitstream, authenticates the AES-GCM tag, and reveals your secret in browser memory.
4. Click **📋 Copy** to copy your secret, then remove the image.

---

## Step 5: Submit Feedback

1. Click the **💬 Feedback Loop** button in the header or footer.
2. Select your role (Crypto User, Developer, Tester, Security Researcher).
3. Select the feature tested and category (UX, Bug, Feature Request, Performance).
4. Enter what you expected, what happened, and any suggestions for improvement.
5. Click **🚀 Submit Feedback to Developer Loop** to record your entry.
