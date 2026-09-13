# 📊 StegoVault User Feedback & Continuous Feedback Loop

## Objective

The primary objective of the StegoVault feedback loop is to validate the Level 6 Supermoon MVP with real users on the **Midnight Preprod** testnet, gather structured input regarding usability, wallet integration, cryptographic workflows, and steganography, and iterate rapidly based on empirical user experiences.

---

## User Testing

StegoVault underwent testing with community members, Web3 developers, security researchers, and testnet validators. Testers performed end-to-end user journeys on Midnight Preprod using the official **1AM Wallet** Chrome extension.

### Testing Scope:
1. **Wallet Connection:** Connecting 1AM Wallet to Midnight Preprod and verifying Bech32m address resolution (`mn_addr_preprod...`).
2. **Vault Sealing (Encrypt & Hide):** Uploading a cover PNG, deriving keys via PBKDF2 (100k iterations), encrypting via AES-256-GCM, signing on-chain commitments via 1AM Wallet, and embedding payload into PNG blue-channel LSBs.
3. **Vault Packaging:** Downloading and verifying the uncompressed `stegovault_secure.zip` archive containing `vault.png` and preservation instructions.
4. **Key Recovery (Extract & Decrypt):** Loading `vault.png`, verifying 1AM Wallet identity binding, checking on-chain ledger commitments, and recovering plaintext secrets in browser volatile memory.
5. **Error & Edge Handling:** Testing invalid files (JPEG/WebP), wrong passwords, wallet address mismatches, and tampered bitstreams.

---

## Feedback Collection

Feedback was collected using a structured **Google Form**, an **in-app Feedback Modal** (`FeedbackModal.tsx`), **GitHub Issues**, and **Product X Channel** discussions.

### Form & Survey Structure:
- **Ease of Use:** Rating 1–5 on UI navigation, drag-and-drop file upload, and instruction clarity.
- **MVP Completion:** Verification whether the tester successfully completed the full encrypt → commit → stego → ZIP → decrypt cycle.
- **Wallet Connection:** Readiness and responsiveness of the 1AM Wallet DApp connector API (`window.midnight["1am"]`).
- **Vault Creation:** Performance of PBKDF2 key derivation and blue-channel LSB embedding speed.
- **Recovery:** Clarity of decryption outputs, password entry prompts, and copy-to-clipboard functionality.
- **Bugs/Errors:** Open-ended report of unexpected behaviors or error messages.
- **Most Liked Feature:** Qualities that testers valued most (e.g. client-side privacy, zero server dependency, cyberpunk UI).
- **Most Important Improvement:** Specific user pain points or feature requests.
- **Overall Rating:** 1–5 star rating for the complete application experience.
- **Additional Feedback:** Freeform comments and technical suggestions.

---

## Feedback Analysis

Responses were categorized into seven key technical domains:

| Category | Description | Key User Observations |
| :--- | :--- | :--- |
| **UX** | User Interface & Guidance | Users requested clearer progress indicators during key derivation and wallet popup authorization. |
| **Reliability** | File Integrity & Lossy Formats | Users highlighted risks of lossy image compression (e.g. uploading JPEGs or social media re-compression). |
| **Wallet** | 1AM Connector Integration | Users noted that approving transactions in the 1AM popup needed clearer status notifications in the app UI. |
| **Blockchain** | Compact Smart Contract | Users wanted confirmation that their non-sensitive commitment hash was recorded on Midnight Preprod. |
| **Recovery** | Vault Decryption & Unlocking | Users requested clear error messages distinguishing between wrong passwords vs. wallet identity mismatches. |
| **Documentation** | Setup & Onboarding | Testers requested an interactive in-app quick-start guide to complement markdown docs. |
| **Feature Requests** | Future Enhancements | Users suggested payload capacity meters, multi-image vaults, and JSON feedback exports. |

---

## Prioritization Framework

Feedback entries were triaged into five priority levels based on:
1. **Security Impact:** Potential for secret exposure, key leakage, or loss of privacy (P0 / Critical).
2. **User Impact:** Blocker to completing vault creation or recovery (P1 / High).
3. **Frequency:** Number of testers reporting the same issue or request.
4. **Complexity:** Engineering effort vs. MVP architecture preservation.
5. **MVP Scope:** Alignment with client-side cryptography and Midnight + 1AM Wallet requirements.

---

## Changes Implemented from Feedback

The following technical improvements were implemented directly as a result of user feedback:

1. **Lossy Compression Warning & Binary PNG Header Validation (FB-001):**
   - *Feedback:* Testers uploading JPEG files experienced silent failures or corrupted payloads.
   - *Implementation:* Added `validateImageFile()` in `src/utils/file-utils.ts` to inspect magic byte signatures (`89 50 4E 47 0D 0A 1A 0A`) and enforce uncompressed `STORE` mode in JSZip.

2. **1AM Wallet Popup Approval Visibility (FB-002):**
   - *Feedback:* Users were unaware when 1AM Wallet popup was awaiting transaction signature.
   - *Implementation:* Added a pulsing `[1AM] ⏳ Approve in popup` status alert and state machine in `ContractDeployment.tsx` and `VaultPanel.tsx`.

3. **Stego Payload Capacity Progress Bar (FB-003):**
   - *Feedback:* Developers wanted to know image capacity before attempting to hide large secrets.
   - *Implementation:* Created real-time image resolution detection (`width × height / 8 - 4`) and visual capacity meter in `VaultPanel.tsx`.

4. **Detailed Decryption Error Messages (FB-004):**
   - *Feedback:* Generic decryption errors made it hard to troubleshoot why recovery failed.
   - *Implementation:* Separated `1AM WALLET MISMATCH` errors from AES-256-GCM authentication tag failures in `KeyPanel.tsx`.

5. **Preprod RPC Network Diagnostic Bar (FB-005):**
   - *Feedback:* Testers wanted real-time confirmation of Midnight Preprod RPC status and wallet connector readiness.
   - *Implementation:* Built `NetworkStatus.tsx` showing live RPC latency ping and contract state.

6. **Interactive In-App Onboarding Walkthrough (FB-006):**
   - *Feedback:* New users wanted guided step-by-step setup without opening external documentation.
   - *Implementation:* Developed 5-step interactive `OnboardingGuide.tsx` accessible from the top navigation bar.

7. **One-Click Feedback JSON Export (FB-007):**
   - *Feedback:* Reviewers requested offline access to saved feedback entries.
   - *Implementation:* Added JSON export capability in `FeedbackModal.tsx`.

---

## Future Improvements

The following items are prioritized for post-Level 6 roadmap development:
- **Multi-Image Split Vaults:** Splitting large payloads across a gallery of carrier images.
- **Hardware Wallet Signing:** Supporting air-gapped hardware signing modules via 1AM Wallet extensions.
- **Steganographic Channel Variety:** Options for Green/Red channel embedding or alpha-channel steganography.
- **Automated Preprod Faucet Integration:** In-app requesting of Preprod testnet DUST tokens.

---

## Level 5 → Level 6 Improvements

Based on feedback collected during Level 5 MVP testing, the StegoVault interface was refined to improve usability, onboarding clarity, responsive behavior, and overall user experience for the Level 6 Supermoon submission.

### UI / Usability
- **Problem:** Users needed a clearer, simpler first interaction and improved mobile layout.
- **Decision:** Streamline the landing page hierarchy, enhance primary CTAs, and implement responsive CSS rules for 320px–1440px viewports.
- **Implementation:** Updated `LandingPage.tsx`, `VaultPanel.tsx`, `Wallet.tsx`, and responsive breakpoints in `index.css`.
- **Result:** The application now presents the MVP workflow with high visual clarity across all devices without horizontal scrolling.

### Workflow & Status Visibility
- **Problem:** Users wanted step-by-step progress feedback during secret protection, wallet popup approval, and stego embedding.
- **Decision:** Implement an active 5-step visual workflow progress indicator representing true application state.
- **Implementation:** Added visual workflow tracker in `VaultPanel.tsx` mapping real application steps (Connect → Protect → Commit → Embed → Save).
- **Result:** Users immediately understand their exact location in the vault creation process.

### Error Diagnostics & Actionable Messages
- **Problem:** Generic error messages caused ambiguity when passwords failed or wrong files were uploaded.
- **Decision:** Replace generic error strings with explicit, actionable messages (e.g. password mismatch, invalid PNG rejection, wallet identity mismatch).
- **Implementation:** Updated error state strings in `VaultPanel.tsx`, `KeyPanel.tsx`, and `Wallet.tsx`.
- **Result:** Users can troubleshoot issues instantly without risking secret exposure.

---

## Feedback Verification Evidence

- 📝 **Google Form Survey:** [StegoVault Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLScJ3STpCvdNjzS04VbuWQ0B2yP4JF2CVpLn5ZPoyAfEuGtWvA/viewform)
- 📊 **Google Sheets Response Data:** [Google Sheets Feedback Register](https://docs.google.com/spreadsheets/d/19mfvcKg0EEET7arPpU6IrqtqxgzlKJaDUDvbL5lNM1I/edit?usp=sharing)
- 🧪 **Automated Feedback Test Suite:** `src/__tests__/feedback-and-onboarding.test.ts` (34 tests passing)
- 📥 **Additional User Feedback Input:** `[ADD ACTUAL FEEDBACK RESULT]`

