# StegoVault Security Model & Threat Assessment

> Note: Detailed security specification is available in [`docs/security.md`](docs/security.md).

## Core Security Invariants

1. **Zero Secret Leakage:**
   Plaintext secrets, passwords, seed phrases, private keys, and derived AES keys **NEVER** leave local browser memory.
2. **Zero Plaintext Blockchain Storage:**
   The Midnight Network stores only non-sensitive 32-byte `vaultId` identifiers and SHA-256 `contentHash` commitment digests.
3. **Cryptographic Authenticity & Integrity:**
   Secrets are protected using **AES-256-GCM** authenticated encryption. Any bit flipping or image alteration causes authentication tag mismatch and immediate decryption failure.
4. **Multi-Factor Vault Authorization:**
   Recovery requires both:
   - Possession of the authorized **1AM Wallet** identity (matching on-chain commitment).
   - Knowledge of the original encryption password for PBKDF2 derivation.
5. **Lossy Compression Protection:**
   The application strictly rejects JPEG, WebP, and lossy formats at the file validation layer and packages artifacts in `STORE` uncompressed ZIP bundles to preserve pixel integrity.

For full threat model and cryptographic parameters, see [`docs/security.md`](docs/security.md).
