import Logo from "../Logo";

export default function ProductDemo() {
  return (
    <section className="sv-section sv-demo-section" id="product" aria-label="Interactive Product Interface Preview">
      <div className="sv-container">
        {/* Header */}
        <div className="sv-demo-header">
          <h2 className="sv-h2">The vault, in one window.</h2>
          <p className="sv-lead">
            An intuitive, distraction-free environment for air-gapped cryptographic operations.
          </p>
        </div>

        {/* CSS Mockup Container */}
        <div className="sv-mockup-wrapper">
          {/* Mockup Window Bar */}
          <div className="sv-mockup-topbar">
            <div className="sv-mockup-traffic-lights">
              <span className="sv-traffic-light sv-traffic-close" />
              <span className="sv-traffic-light sv-traffic-min" />
              <span className="sv-traffic-light sv-traffic-max" />
            </div>
            <div className="sv-mockup-url">stegovault.app/workspace</div>
            <div className="sv-mockup-badge">CLIENT-SIDE ENCLAVE</div>
          </div>

          {/* 3-Column UI Layout */}
          <div className="sv-mockup-body">
            {/* Column 1: Sidebar (Hidden on Mobile) */}
            <aside className="sv-mockup-sidebar">
              <div className="sv-mockup-logo">
                <Logo variant="dark" height={20} />
              </div>

              <nav className="sv-mockup-nav">
                <div className="sv-mockup-nav-item active">
                  <span className="sv-mockup-nav-square" />
                  <span>Create vault</span>
                </div>
                <div className="sv-mockup-nav-item">
                  <span className="sv-mockup-nav-dot" />
                  <span>Reveal vault</span>
                </div>
                <div className="sv-mockup-nav-item">
                  <span className="sv-mockup-nav-dot" />
                  <span>Verify on Midnight</span>
                </div>
                <div className="sv-mockup-nav-item">
                  <span className="sv-mockup-nav-dot" />
                  <span>History</span>
                </div>
              </nav>

              <div className="sv-mockup-sidebar-footer">
                <div className="sv-mockup-status-indicator">
                  <span className="sv-status-dot" />
                  <span>Midnight Preprod</span>
                </div>
              </div>
            </aside>

            {/* Column 2: Main Workspace */}
            <main className="sv-mockup-main">
              <div className="sv-mockup-main-header">
                <div>
                  <h4 className="sv-mockup-view-title">Create vault</h4>
                  <div className="sv-mockup-step-indicator">
                    Step 3 of 5 · Hiding data in image
                  </div>
                </div>
                <div className="sv-mockup-badge-active">ENCRYPTED</div>
              </div>

              {/* Checkerboard PNG Preview with Sweeping Scan Band */}
              <div className="sv-mockup-preview-box">
                <div className="sv-checkerboard-bg">
                  <div className="sv-scan-band" />
                  <div className="sv-preview-image-mock">
                    <div className="sv-preview-meta">
                      <span className="sv-preview-tag">vault_carrier_2026.png</span>
                      <span className="sv-preview-res">1920 × 1080 · 24-bit PNG</span>
                    </div>
                    <div className="sv-preview-center-icon">
                      <div className="sv-preview-frame">
                        <span className="sv-preview-lock-symbol">■</span>
                        <span>LSB Pixel Bitplane Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="sv-mockup-form">
                <div className="sv-mockup-field">
                  <label className="sv-mockup-label">Passphrase</label>
                  <div className="sv-mockup-input-wrap">
                    <span className="sv-mockup-input-text">••••••••••••••••••••••••</span>
                    <span className="sv-mockup-input-tag">100k PBKDF2</span>
                  </div>
                </div>

                <div className="sv-mockup-field">
                  <label className="sv-mockup-label">Cover image</label>
                  <div className="sv-mockup-input-wrap">
                    <span className="sv-mockup-input-file">carrier_nature_4k.png (3.4 MB)</span>
                    <span className="sv-mockup-input-tag sv-tag-green">Lossless Verified</span>
                  </div>
                </div>
              </div>
            </main>

            {/* Column 3: Record Panel (Hidden on Tablet & Mobile) */}
            <aside className="sv-mockup-record-panel">
              <div className="sv-record-header">
                <span className="sv-record-title">VAULT RECORD</span>
              </div>

              <div className="sv-record-list">
                <div className="sv-record-row">
                  <span className="sv-record-label">Encryption</span>
                  <span className="sv-record-val">AES-256-GCM</span>
                </div>
                <div className="sv-record-row">
                  <span className="sv-record-label">Payload</span>
                  <span className="sv-record-val sv-val-highlight">Embedded (LSB)</span>
                </div>
                <div className="sv-record-row">
                  <span className="sv-record-label">Proof</span>
                  <span className="sv-record-val sv-proof-valid">
                    <span className="sv-record-dot-red" />
                    Valid Compact ZK
                  </span>
                </div>
                <div className="sv-record-row">
                  <span className="sv-record-label">Network</span>
                  <span className="sv-record-val">Midnight Preprod</span>
                </div>
                <div className="sv-record-row">
                  <span className="sv-record-label">Wallet</span>
                  <span className="sv-record-val">1AM Wallet</span>
                </div>
              </div>

              <div className="sv-record-hash-box">
                <span className="sv-record-hash-label">STATE COMMITMENT HASH</span>
                <code className="sv-record-hash">
                  0x7f9a2b84...e901a4
                </code>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
