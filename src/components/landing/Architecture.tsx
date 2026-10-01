export default function Architecture() {
  return (
    <section className="sv-architecture-section" aria-label="Cryptographic Architecture">
      <div className="sv-container">
        {/* Header */}
        <div className="sv-arch-header">
          <span className="sv-arch-tag">SYSTEM SPECIFICATION</span>
          <h2 className="sv-arch-h2">Architecture</h2>
          <p className="sv-arch-lead">
            Plaintext never crosses the dotted line. Only the proof does.
          </p>
        </div>

        {/* Wide SVG Pipeline Visualization (Desktop & Tablet) */}
        <div className="sv-arch-svg-container" aria-hidden="true">
          <svg
            className="sv-arch-svg"
            viewBox="0 0 1200 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background guide track */}
            <line
              x1="80"
              y1="160"
              x2="1120"
              y2="160"
              stroke="#2a2828"
              strokeWidth="2"
              strokeOpacity="0.3"
            />

            {/* Red Dotted On-Chain Boundary Line */}
            <line
              x1="720"
              y1="30"
              x2="720"
              y2="290"
              stroke="#b3121b"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Boundary Labels */}
            <text
              x="705"
              y="55"
              textAnchor="end"
              fill="#524e4d"
              fontSize="14"
              fontWeight="600"
              fontFamily="Instrument Sans, sans-serif"
              letterSpacing="0.04em"
            >
              ← LOCAL DEVICE (AIR-GAPPED)
            </text>
            <text
              x="735"
              y="55"
              textAnchor="start"
              fill="#b3121b"
              fontSize="14"
              fontWeight="700"
              fontFamily="Instrument Sans, sans-serif"
              letterSpacing="0.04em"
            >
              ON-CHAIN BOUNDARY (MIDNIGHT) →
            </text>

            {/* Node 1: Data (Solid ink square) */}
            <g className="sv-arch-node">
              <rect x="115" y="135" width="50" height="50" fill="#0c0b0b" />
              <text
                x="140"
                y="225"
                textAnchor="middle"
                fill="#0c0b0b"
                fontSize="16"
                fontWeight="800"
                fontFamily="Archivo, sans-serif"
              >
                01 Data
              </text>
              <text
                x="140"
                y="245"
                textAnchor="middle"
                fill="#615d5c"
                fontSize="13"
                fontFamily="Instrument Sans, sans-serif"
              >
                Secret Seed Phrase
              </text>
            </g>

            {/* Node 2: Encrypt (Outlined square with inner square) */}
            <g className="sv-arch-node">
              <rect
                x="345"
                y="135"
                width="50"
                height="50"
                fill="none"
                stroke="#0c0b0b"
                strokeWidth="2.5"
              />
              <rect x="358" y="148" width="24" height="24" fill="#0c0b0b" />
              <text
                x="370"
                y="225"
                textAnchor="middle"
                fill="#0c0b0b"
                fontSize="16"
                fontWeight="800"
                fontFamily="Archivo, sans-serif"
              >
                02 Encrypt
              </text>
              <text
                x="370"
                y="245"
                textAnchor="middle"
                fill="#615d5c"
                fontSize="13"
                fontFamily="Instrument Sans, sans-serif"
              >
                AES-256-GCM
              </text>
            </g>

            {/* Node 3: Embed (Quarter-circle) */}
            <g className="sv-arch-node">
              <path
                d="M 575 135 H 625 A 50 50 0 0 1 625 185 V 185 H 575 Z"
                fill="#0c0b0b"
              />
              <text
                x="600"
                y="225"
                textAnchor="middle"
                fill="#0c0b0b"
                fontSize="16"
                fontWeight="800"
                fontFamily="Archivo, sans-serif"
              >
                03 Embed
              </text>
              <text
                x="600"
                y="245"
                textAnchor="middle"
                fill="#615d5c"
                fontSize="13"
                fontFamily="Instrument Sans, sans-serif"
              >
                PNG Pixel Matrix
              </text>
            </g>

            {/* Node 4: Prove (Red circle) */}
            <g className="sv-arch-node">
              <circle cx="850" cy="160" r="26" fill="#b3121b" />
              <text
                x="850"
                y="225"
                textAnchor="middle"
                fill="#0c0b0b"
                fontSize="16"
                fontWeight="800"
                fontFamily="Archivo, sans-serif"
              >
                04 Prove
              </text>
              <text
                x="850"
                y="245"
                textAnchor="middle"
                fill="#615d5c"
                fontSize="13"
                fontFamily="Instrument Sans, sans-serif"
              >
                Compact ZK Proof
              </text>
            </g>

            {/* Node 5: Verify (Red square with white inner square) */}
            <g className="sv-arch-node">
              <rect x="1035" y="135" width="50" height="50" fill="#b3121b" />
              <rect x="1048" y="148" width="24" height="24" fill="#f1f0ee" />
              <text
                x="1060"
                y="225"
                textAnchor="middle"
                fill="#0c0b0b"
                fontSize="16"
                fontWeight="800"
                fontFamily="Archivo, sans-serif"
              >
                05 Verify
              </text>
              <text
                x="1060"
                y="245"
                textAnchor="middle"
                fill="#615d5c"
                fontSize="13"
                fontFamily="Instrument Sans, sans-serif"
              >
                1AM Wallet On-Chain
              </text>
            </g>

            {/* Animated Traveling Particles along the baseline */}
            <circle r="6" fill="#0c0b0b">
              <animateMotion
                path="M 80 160 L 1120 160"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>

            <circle r="6" fill="#b3121b">
              <animateMotion
                path="M 80 160 L 1120 160"
                dur="6s"
                begin="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Mobile Vertical Architecture List */}
        <div className="sv-arch-mobile-list">
          <div className="sv-arch-mobile-boundary">
            <span className="sv-arch-mobile-boundary-tag">LOCAL AIR-GAPPED ENVIRONMENT</span>
          </div>

          <div className="sv-arch-mobile-card">
            <span className="sv-arch-mobile-icon">■</span>
            <div>
              <div className="sv-arch-mobile-title">01 Data (Secret Seed Phrase)</div>
              <p className="sv-arch-mobile-desc">Stays strictly in volatile browser RAM.</p>
            </div>
          </div>

          <div className="sv-arch-mobile-card">
            <span className="sv-arch-mobile-icon">⧈</span>
            <div>
              <div className="sv-arch-mobile-title">02 Encrypt (AES-256-GCM)</div>
              <p className="sv-arch-mobile-desc">Authenticated payload derivation via PBKDF2.</p>
            </div>
          </div>

          <div className="sv-arch-mobile-card">
            <span className="sv-arch-mobile-icon">▲</span>
            <div>
              <div className="sv-arch-mobile-title">03 Embed (Lossless PNG)</div>
              <p className="sv-arch-mobile-desc">Direct pixel LSB modification with ΔE &lt; 0.05.</p>
            </div>
          </div>

          <div className="sv-arch-mobile-boundary sv-arch-mobile-boundary-chain">
            <span className="sv-arch-mobile-boundary-tag">ON-CHAIN MIDNIGHT BOUNDARY</span>
          </div>

          <div className="sv-arch-mobile-card sv-arch-mobile-card-red">
            <span className="sv-arch-mobile-icon">●</span>
            <div>
              <div className="sv-arch-mobile-title">04 Prove (Compact ZK)</div>
              <p className="sv-arch-mobile-desc">Zero-knowledge proof generated on-device.</p>
            </div>
          </div>

          <div className="sv-arch-mobile-card sv-arch-mobile-card-red">
            <span className="sv-arch-mobile-icon">⧇</span>
            <div>
              <div className="sv-arch-mobile-title">05 Verify (1AM Wallet)</div>
              <p className="sv-arch-mobile-desc">Decentralized verification without disclosing plaintext.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
