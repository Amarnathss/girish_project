# DWDM Link Feasibility Planner

A web-based tool for evaluating Dense Wavelength Division Multiplexing (DWDM) optical link feasibility.

## Project Structure

```
dwdm-planner/
  backend/          - FastAPI backend with calculation services
  frontend/         - React + Vite frontend with network visualization
  data/             - Sample topology JSON files
  docs/             - Documentation and seminar materials
```

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Run Tests

```bash
cd backend
pytest tests/ -v
```

## Features

- Power budget calculation (span loss, total loss, Rx power)
- OSNR margin evaluation
- Visual network topology graph with pass/fail color coding
- Interactive scenario selection (PASS / FAIL)
- Per-span loss breakdown
- RESTful API for integration

## Tech Stack

- **Backend:** Python, FastAPI, Pydantic
- **Frontend:** React, Vite, react-flow-renderer, axios
- **Testing:** pytest
