# 📊 StegoVault Feedback Tracking Log

This document records the collected feedback entries from Preprod testers and users, along with their triage priority, status, and implemented resolutions in the codebase.

---

## 📝 Feedback Registry

| ID | Date | Category | Priority | User Persona | Feedback / Expected vs Actual | Status | Implemented Resolution & Evidence |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| **FB-001** | 2026-09-08 | UX / Data | High | Security Researcher | User expected clear rejection if lossy JPG was selected; raw JPG could lead to bit corruption. | ✅ **Implemented** | Implemented `validateImageFile()` in `file-utils.ts` and automated uncompressed `STORE` ZIP packaging (`bdc2a41`). |
| **FB-002** | 2026-09-09 | Smart Contract | High | Tester | Users were unaware when 1AM Wallet popup was awaiting authorization signature on Midnight Preprod. | ✅ **Implemented** | Added live deployment state machine (`ContractDeployment.tsx`) and pulsing `[1AM] ⏳ Approve in popup` alerts. |
| **FB-003** | 2026-09-10 | UX / Stego | Medium | Developer | Expected capacity indicator before embedding payload into image to prevent capacity overflows. | ✅ **Implemented** | Added real-time image dimension detection and blue-channel payload capacity bar in `VaultPanel.tsx`. |
| **FB-004** | 2026-09-11 | UX / Crypto | Medium | Crypto User | Generic decryption failure when wrong password was entered was confusing. | ✅ **Implemented** | Added distinct error messages separating 1AM Wallet identity mismatches from AES-256-GCM authentication tag failures (`KeyPanel.tsx`). |
| **FB-005** | 2026-09-11 | Performance | Medium | Validator | Wanted live visual feedback on Midnight Preprod RPC latency and DApp connector readiness. | ✅ **Implemented** | Implemented `NetworkStatus.tsx` diagnostic status bar with live RPC ping and contract state. |
| **FB-006** | 2026-09-12 | Onboarding | Medium | Crypto User | New users wanted an interactive quick-start walkthrough without reading external markdown docs. | ✅ **Implemented** | Created interactive 5-step `OnboardingGuide.tsx` modal accessible from navigation and status bar. |
| **FB-007** | 2026-09-12 | Tooling | Low | Developer | Requested ability to export feedback history directly to JSON for offline analysis. | ✅ **Implemented** | Added one-click JSON export button in `FeedbackModal.tsx`. |

---

## 📈 Feedback Loop Metrics

- **Total Feedback Entries Tracked:** 7
- **Resolution Rate:** 100% (7 of 7 implemented locally)
- **High / Critical Priority Resolved:** 2 of 2
- **Medium Priority Resolved:** 4 of 4
- **Low Priority Resolved:** 1 of 1
- **Testing Coverage:** Automated test suite in `src/__tests__/feedback-and-onboarding.test.ts` validates data structures and math.
