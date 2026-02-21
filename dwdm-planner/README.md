# DWDM Link Feasibility Planner

A web-based tool for evaluating Dense Wavelength Division Multiplexing (DWDM) optical link feasibility. Supports multi-node topologies with per-span loss breakdown, OSNR margin analysis, and interactive network graph visualization.

## Project Structure

```
dwdm-planner/
  backend/          - FastAPI backend with calculation services
  frontend/         - React + Vite frontend with network visualization
  data/             - Sample topology JSON files (PASS / MEDIUM / FAIL)
  docs/             - Documentation and seminar materials
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Server starts at http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:5173

### Run Tests

```bash
cd backend
pytest tests/ -v
```

## Features

- **Multi-node topologies** — supports 2-node and 3-node (multi-span) link paths
- **Power budget calculation** — per-span loss (fiber attenuation + connector + splice − amplifier gain), total loss, Rx power
- **OSNR margin evaluation** — estimated OSNR vs threshold with noise penalty
- **Per-span breakdown** — detailed loss table for each span in the results
- **Assumptions display** — shows the fiber parameters used in the calculation
- **Visual network topology graph** — interactive react-flow diagram with green (PASS) / red (FAIL) color coding
- **Preset scenarios** — PASS (2 nodes, 1 span), MEDIUM (3 nodes, 2 spans), FAIL (3 nodes, 2 spans)
- **RESTful API** — JSON-based POST endpoint for integration

## Sample Topologies

| File | Nodes | Spans | Expected Result |
|------|-------|-------|-----------------|
| `sample_topology_pass.json` | A → B → C | 2 | PASS |
| `sample_topology_medium.json` | A → B → C | 2 | Borderline |
| `sample_topology_fail.json` | A → B → C | 2 | FAIL |

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python, FastAPI, Pydantic, Uvicorn |
| **Frontend** | React 18, Vite 5, react-flow-renderer, axios, React Router v7 |
| **Testing** | pytest |
