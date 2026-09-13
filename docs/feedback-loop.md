# 🔄 StegoVault Feedback Loop Specification

This document details the structured feedback loop implemented in StegoVault, outlining how user feedback is gathered, structured, prioritized, implemented, and verified on **Midnight Preprod**.

---

## 1. Feedback Submission Channels

Users and reviewers can submit feedback through four integrated channels:

1. **In-App Feedback Modal (Primary):** Accessible anywhere in the application by clicking the **💬 Feedback Loop** button in the top navigation or status bar. Stores submissions locally in `localStorage` and provides a one-click JSON export.
2. **GitHub Issues:** Bug reports and feature proposals on the [payalbabar/moonlight6](https://github.com/payalbabar/moonlight6/issues) repository.
3. **Product X (Twitter) Channel:** Community discussions and feedback via [@StegoVaultWeb3](https://x.com/StegoVaultWeb3).
4. **Interactive Onboarding Walkthrough:** Direct feedback prompts at the conclusion of the onboarding guide.

---

## 2. Information Schema Collected

Each feedback submission collects structured metadata:

| Field | Description | Example |
| :--- | :--- | :--- |
| `id` | Unique feedback identifier | `FB-001` |
| `date` | Timestamp of submission | `2026-09-12` |
| `walletAddress` | Connected Midnight Preprod Bech32m address | `addr_test1qpk299...` |
| `userType` | User persona / role | `Crypto User`, `Developer`, `Security Researcher`, `Tester`, `Validator` |
| `feature` | Targeted application module | `Vault Sealing`, `Key Unlock`, `Smart Contract`, `1AM Wallet`, `UI / Performance`, `Documentation` |
| `category` | Classification tag | `UX`, `Bug`, `Feature Request`, `Performance`, `Smart Contract`, `Documentation` |
| `severity` | Impact rating | `Critical`, `High`, `Medium`, `Low` |
| `expected` | User's intended outcome | "Lossy image rejection with explanation" |
| `actual` | Real behavior observed | "Silent failure on JPEG upload" |
| `improvement` | Proposed enhancement | "Add MIME and binary PNG validation" |
| `status` | Lifecycle state | `Implemented`, `Under Review`, `Planned` |
| `resolution` | Technical fix applied & commit link | "Implemented in `file-utils.ts` (Commit `bdc2a41`)" |

---

## 3. Feedback Categorization Matrix

```
┌───────────────────────────────────────────────────────────────────┐
│                     FEEDBACK CATEGORIES                           │
├─────────────────┬─────────────────┬───────────────────────────────┤
│ Category        │ Scope           │ Example                       │
├─────────────────┼─────────────────┼───────────────────────────────┤
│ UX              │ Usability & UI  │ Drag-and-drop feedback, hints │
│ Bug             │ Malfunctions    │ State desync, buffer overflow │
│ Feature Request │ New features    │ Capacity meter, JSON export   │
│ Performance     │ Speed & memory  │ PBKDF2 speed, bundle size     │
│ Smart Contract  │ ZK & Midnight   │ Circuit errors, gas / dust    │
│ Documentation   │ Guides & specs  │ Missing onboarding steps      │
└─────────────────┴─────────────────┴───────────────────────────────┘
```

---

## 4. Prioritization Framework

Feedback is triaged into four priority tiers:

- **🔴 Critical (P0):** Cryptographic flaws, security vulnerabilities, or complete workflow blockers. Handled immediately.
- **🟠 High (P1):** Transaction failures, wallet connector miscommunication, or lossy image corruption risks.
- **🟡 Medium (P2):** UX ambiguities, missing visual indicators (e.g. capacity meters, network status), or confusing error messages.
- **🟢 Low (P3):** Cosmetic suggestions, theme customization, or non-critical documentation polish.

---

## 5. The Complete Feedback → Implementation Lifecycle

```
    ┌───────────────────────┐
    │     1. USER INPUT     │  User tests Preprod MVP & submits structured form
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   2. CATEGORIZATION   │  Tag category (UX/Bug/ZK) & severity (P0-P3)
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   3. PRIORITIZATION   │  Triage into active development backlog
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │    4. LOCAL DEV & FIX │  Implement local code fix without remote push
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   5. AUTOMATED TESTS  │  Run Vitest suite (34 tests) + ESLint + Build
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │   6. LOGICAL COMMIT   │  Create meaningful local Git commit
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │ 7. USER VERIFICATION  │  Update feedback register status to 'Implemented'
    └───────────────────────┘
```

---

## 6. How Feedback Shaped Level 5 Development

The feedback loop directly drove major architectural improvements in StegoVault:

1. **Lossy Compression Warning (FB-001):** Implemented strict PNG binary header validation and JSZip STORE packaging.
2. **1AM Wallet Approval Visibility (FB-002):** Created live state machine with terminal alerts for pending approvals.
3. **Payload Capacity Calculator (FB-003):** Added real-time image resolution detection and payload progress indicator.
4. **Decryption Error Clarity (FB-004):** Differentiated wallet identity mismatches from AES-GCM tag verification failures.
