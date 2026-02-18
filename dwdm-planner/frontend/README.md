# DWDM Planner - Frontend

React frontend for the DWDM link feasibility planner.

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

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | InputPage | Form to enter span and service parameters. Includes PASS / MEDIUM / FAIL preset buttons. |
| `/result` | ResultPage | Displays network graph and link metrics (Total Loss, Rx Power, OSNR Margin, PASS/FAIL). |

## Stack

- React 18
- React Router v7
- Vite
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
    App.jsx                 # Route definitions
    api/
      plannerApi.js         # Axios client for /api/plan/feasibility
    pages/
      InputPage.jsx         # Input form with presets and Calculate button
      ResultPage.jsx        # Results display with graph, metrics, Back button
    components/
      NetworkGraph.jsx      # react-flow graph (green=PASS, red=FAIL edges)
      MetricsPanel.jsx      # Metrics table (loss, power, OSNR, status)
      FeasibilityBadge.jsx  # PASS/FAIL colored badge
```
