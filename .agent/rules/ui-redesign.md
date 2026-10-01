# StegoVault UI Redesign Rules (ALWAYS APPLY)

## STRICT RULES
- Change ONLY the UI layer: CSS, class names, layout, animations, presentation markup.
- NEVER modify logic: JS/TS functions, crypto, wallet connection, steganography, ZK simulation, state, event handlers, API calls, contract code.
- Keep all existing IDs, data-attributes, refs and event bindings exactly as they are. If wrapping elements, never rename or remove the ones JS depends on.
- No heavy new dependencies. Prefer pure CSS + small vanilla JS (IntersectionObserver). Only lightweight libs if really needed.
- DO NOT git commit or push. Modify files locally only.
- Before editing, list the files you will change. After editing, summarize changes.

## Design direction: modern, custom, NOT Bootstrap-looking
Use fully custom BEM classes with `sv-` prefix (e.g. `.sv-hero__title`, `.sv-card--glass`). No generic template look.

### Color tokens (CSS variables in :root)
- Background: #0a0a0b, #111113, #1a1a1d
- Surface: rgba(255,255,255,0.03), border: 1px solid rgba(255,255,255,0.08)
- Text: primary #f5f5f4, secondary #9a9aa0, muted #5c5c63
- Accent gold: #e8c77a → #f6e3a8 (gradient)
- Silver/teal glow: #d9e4e2
- Live dot: #b6f23a
- Remove the blue/purple neon look completely. Black + white + gold only.

### Typography
- Headings: Sora or Poppins, tight letter-spacing, clamp() sizes
- Body: Inter
- Mono labels (STEP 01, THE PROTOCOL etc.): JetBrains Mono
- Hero headline: gradient text (white → gold) with subtle shimmer

### Animations
- Hero: morphing glowing orb (CSS/SVG blur), cursor-following spotlight, pulsing live badge, count-up stats
- Floating glass pill navbar (backdrop-filter blur) with sliding gold underline, shrinks on scroll; gold scroll-progress bar at top
- Scroll-reveal (fade + translateY + blur-to-sharp, staggered) on all sections
- Cards: 3D tilt on hover, cursor-following gold border glow, lift + shadow
- Marquee with edge fade masks, pause on hover
- 4-step cards: self-drawing connecting line, floating icons
- Comparison table: glowing gold border on StegoVault column, row hover, animated checkmarks
- FAQ: smooth height transition, + rotates to X
- Lab/Inspector: scanning-line effect, glowing focus rings, sliding-pill tab indicator
- ZK Prover: dashed flow with traveling glow dot (Private Witness → Poseidon Hash → Nullifier Guard → On-Chain Verify)
- Gradient section dividers, subtle grain overlay, custom scrollbar, smooth scroll
- Buttons: shine sweep on hover, gold border glow, magnetic effect on Launch App
- Respect prefers-reduced-motion
- Fully responsive (mobile/tablet/desktop), no horizontal overflow
- Easing: cubic-bezier(.22,1,.36,1)
- Layout: max-width ~1200px, 8px spacing scale, rounded corners 16-28px, focus-visible outlines
