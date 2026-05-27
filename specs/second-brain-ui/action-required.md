# Action Required: Second Brain UI

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Select AI Provider** — Choose which AI API to use for semantic queries (OpenAI, Anthropic Claude, Google Gemini, or other). This affects API key setup in environment variables.
- [ ] **Obtain API Key** — Generate API key from chosen AI provider. Required for AI query interface and AI chat panel.

## During Implementation

- [ ] **Review Design System** — Verify updated DESIGN.md cyberpunk tokens align with aesthetic preferences. Adjust color values if needed.
- [ ] **Font Installation** — Ensure Orbitron, JetBrains Mono, and Space Grotesk fonts load correctly in browser. May need to add to Next.js font configuration.
- [ ] **Test Graph Libraries** — Verify React Flow renders correctly without performance issues. May need to adjust node count limits or virtualization for large graphs.

## After Implementation

- [ ] **Setup Environment Variables** — Add AI API key to .env file:
  - `OPENAI_API_KEY` for OpenAI
  - `ANTHROPIC_API_KEY` for Anthropic Claude
  - `GEMINI_API_KEY` for Google Gemini
- [ ] **Install Graphify** — Run Graphify on note files to generate knowledge graph JSON (graphify.json) for testing graph visualization.
- [ ] **Test Responsive Design** — Verify layout adapts correctly to different screen sizes, particularly sidebar behavior on smaller screens.
- [ ] **Performance Testing** — Test with large note collections (100+ notes, 500+ graph nodes) to ensure acceptable performance. May need to implement virtualization or lazy loading.
- [ ] **Browser Compatibility** — Test in Chrome, Firefox, Safari, and Edge. CSS animations and WebGL may have varying support.

---

> These tasks are also referenced in context within the relevant task files.