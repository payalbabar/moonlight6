# 🧪 StegoVault Testing & Verification Guide

StegoVault maintains a comprehensive automated testing suite built with **Vitest**, covering hardware-accelerated Web Crypto operations, blue-channel LSB steganography, file validation, Compact smart contract integration, and user feedback systems.

---

## 1. Test Suite Summary

| Test File | Focus Area | Tests | Status |
| :--- | :--- | :---: | :---: |
| `src/__tests__/crypto.test.ts` | PBKDF2 (100k iter), AES-256-GCM AEAD, wrong password rejection, ciphertext tampering detection | 6 | ✅ Pass |
| `src/__tests__/steganography.test.ts` | 32-bit header parsing, blue-channel bitstream injection, capacity overflow prevention, boundary conditions | 13 | ✅ Pass |
| `src/__tests__/file-utils.test.ts` | PNG MIME validation, binary magic number checks, JPEG/WebP rejection, uncompressed ZIP bundling | 4 | ✅ Pass |
| `src/__tests__/compact-contract.test.ts` | Compact runtime constructor, ZKIR circuit representation, witness generation, disclosure proofs | 4 | ✅ Pass |
| `src/__tests__/contract-workflow.test.ts` | On-chain ledger query mock, commitment hashing (SHA-256), address formatting | 4 | ✅ Pass |
| `src/__tests__/feedback-and-onboarding.test.ts` | Feedback schema validation, LSB capacity formulas, serialization and export format | 3 | ✅ Pass |
| **Total** | **Full System Coverage** | **34** | **✅ 100% Pass** |

---

## 2. Running Automated Tests

```bash
# Run full test suite once
npm test

# Run tests in watch mode
npx vitest

# Run tests with UI reporter
npx vitest --ui
```

---

## 3. Code Quality & Build Verification

```bash
# Run ESLint validation
npm run lint

# Run TypeScript compiler checks and production bundle build
npm run build
```

---

## 4. Manual QA Verification Checklist

Reviewers can verify all primary flows manually:

- [x] **1AM Wallet Connection:** Connects cleanly, resolves Bech32m address, displays in status bar.
- [x] **Smart Contract Interaction:** Deployment state machine progresses smoothly and displays verified contract address.
- [x] **Vault Sealing (The Vault):**
  - Rejects non-PNG formats (e.g. JPG, GIF, WebP).
  - Updates capacity indicator dynamically based on PNG resolution.
  - Generates ZIP bundle containing `vault.png` and recovery README.
- [x] **Vault Unlocking (The Key):**
  - Rejects corrupted or non-stego images.
  - Verifies unlocking wallet matches creator identity.
  - Rejects incorrect passwords with clear error banner.
  - Reveals secret safely in browser memory with copy action.
- [x] **Interactive Onboarding:** Opens modal, tracks progress through 5 steps, transitions to feedback.
- [x] **Feedback Loop:** Submits feedback, validates inputs, stores in `localStorage`, allows JSON export.
