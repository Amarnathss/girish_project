# DWDM Planner — Frontend

React frontend for the DWDM link feasibility planner. Supports multi-node topology input with per-span editing, interactive network graph visualization, and detailed results display.

## Prerequisites

- Node.js 18+
- Backend server running on http://localhost:8000

## Setup

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

Opens at http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | InputPage | Multi-span form with per-span editing. Includes PASS (2 nodes), MEDIUM (3 nodes), and FAIL (3 nodes) presets. |
| `/result` | ResultPage | Network graph, link metrics, per-span breakdown table, and assumptions used. |

## Preset Scenarios

| Preset | Nodes | Spans | Description |
|--------|-------|-------|-------------|
| **PASS** | A → B | 1 | Short link, high amp gain — expected to pass |
| **MEDIUM** | A → B → C | 2 | Mixed spans, one with amplifier — borderline |
| **FAIL** | A → B → C | 2 | Long spans, no amplification — expected to fail |

## Result Page Sections

- **Network Graph** — Interactive react-flow diagram with green (PASS) or red (FAIL) edge coloring
- **Link Metrics** — Total loss (dB), Rx power (dBm), OSNR margin (dB), PASS/FAIL badge
- **Per-Span Breakdown** — Table showing each span's from/to nodes, length, and individual loss (color-coded)
- **Assumptions Used** — Fiber attenuation, connector loss, and splice loss values used in the calculation

## Stack

- React 18
- React Router v7
- Vite 5
- react-flow-renderer (network graph visualization)
- axios (HTTP client)

## Project Structure

```
frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx                # Entry point, wraps App in BrowserRouter
    App.jsx                 # Route definitions (/ and /result)
    api/
      plannerApi.js         # Axios client for /api/plan/feasibility
    pages/
      InputPage.jsx         # Multi-span input form with presets and Calculate button
      ResultPage.jsx        # Results display with graph, metrics, per-span, assumptions
      Planner.jsx           # (unused placeholder)
    components/
      NetworkGraph.jsx      # react-flow graph (green=PASS, red=FAIL edges)
      MetricsPanel.jsx      # Link metrics, per-span breakdown, and assumptions tables
      FeasibilityBadge.jsx  # PASS/FAIL colored badge
```
