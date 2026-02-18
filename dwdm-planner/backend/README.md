# DWDM Planner - Backend

FastAPI backend for DWDM link feasibility calculations.

## Prerequisites

- Python 3.10+

## Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

```bash
venv\Scripts\uvicorn app:app --reload --port 8000
```

Server starts at http://localhost:8000

## Test

```bash
venv\Scripts\pytest tests/
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/plan/feasibility` | Check link feasibility |

### Request body (`POST /api/plan/feasibility`)

```json
{
  "nodes": [
    { "id": "A", "label": "Site A" },
    { "id": "B", "label": "Site B" }
  ],
  "spans": [
    {
      "from": "A",
      "to": "B",
      "length_km": 50,
      "connectors": 2,
      "splices": 6,
      "amp_gain_db": 10,
      "amp_penalty_db": 1.0
    }
  ],
  "service": {
    "tx_power_dbm": 0,
    "receiver_sensitivity_dbm": -26,
    "osnr_threshold_db": 18,
    "noise_penalty_db": 3.0
  },
  "assumptions": {
    "atten_db_per_km": 0.22,
    "conn_loss_db": 0.5,
    "splice_loss_db": 0.1
  }
}
```

### Response

```json
{
  "total_loss_db": 3.6,
  "rx_power_dbm": -3.6,
  "osnr_margin_db": 1.4,
  "feasible": true,
  "per_span": [...],
  "assumptions_used": {...}
}
```

## Project Structure

```
backend/
  app.py              # FastAPI application and route
  models.py           # Pydantic request/response models
  requirements.txt    # Python dependencies
  venv/               # Virtual environment (not committed)
  services/
    power_budget.py   # Span loss and Rx power calculations
    osnr.py           # OSNR margin calculation
    path_utils.py     # Per-span reports and amp gain totals
  tests/
    test_power_budget.py
    test_osnr.py
```
