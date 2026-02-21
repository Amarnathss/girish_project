# DWDM Planner — Backend

FastAPI backend for DWDM link feasibility calculations. Supports multi-span topologies with per-span loss breakdown, OSNR margin analysis, and configurable assumptions.

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
# Windows
venv\Scripts\uvicorn app:app --reload --port 8000

# Linux / macOS
uvicorn app:app --reload --port 8000
```

Server starts at http://localhost:8000

## Test

```bash
pytest tests/ -v
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/plan/feasibility` | Check link feasibility |

### Request body (`POST /api/plan/feasibility`)

Supports single-span (2 nodes) and multi-span (3+ nodes) topologies.

**Example — 3-node topology (A → B → C):**

```json
{
  "nodes": [
    { "id": "A", "label": "Site A" },
    { "id": "B", "label": "Site B" },
    { "id": "C", "label": "Site C" }
  ],
  "spans": [
    {
      "from": "A",
      "to": "B",
      "length_km": 80,
      "connectors": 2,
      "splices": 10,
      "amplifier_gain_db": 0
    },
    {
      "from": "B",
      "to": "C",
      "length_km": 90,
      "connectors": 2,
      "splices": 12,
      "amplifier_gain_db": 0
    }
  ],
  "service": {
    "tx_power_dbm": 0,
    "receiver_sensitivity_dbm": -24,
    "osnr_threshold_db": 18
  },
  "assumptions": {
    "fiber_atten_db_per_km": 0.22,
    "conn_loss_db": 0.5,
    "splice_loss_db": 0.1,
    "noise_penalty_db": 3.0,
    "amp_penalty_db": 1.0
  }
}
```

### Response

```json
{
  "total_loss_db": 41.6,
  "rx_power_dbm": -41.6,
  "osnr_margin_db": -62.6,
  "feasible": false,
  "per_span": [
    {
      "span_index": 0,
      "from": "A",
      "to": "B",
      "length_km": 80,
      "loss_db": 19.6
    },
    {
      "span_index": 1,
      "from": "B",
      "to": "C",
      "length_km": 90,
      "loss_db": 22.0
    }
  ],
  "assumptions_used": {
    "fiber_atten_db_per_km": 0.22,
    "conn_loss_db": 0.5,
    "splice_loss_db": 0.1,
    "noise_penalty_db": 3.0,
    "amp_penalty_db": 1.0
  }
}
```

### Calculation Logic

| Formula | Description |
|---------|-------------|
| `Span Loss = (length × atten) + (connectors × conn_loss) + (splices × splice_loss) − amp_gain` | Per-span loss in dB |
| `Total Loss = Σ Span Losses` | Sum of all span losses |
| `Rx Power = Tx Power − Total Loss` | Received power at destination |
| `OSNR Margin = Tx Power − Total Loss + Amp Gain − Noise Penalty − OSNR Threshold` | Signal quality margin |
| `Feasible = (Rx Power ≥ Rx Sensitivity) AND (OSNR Margin ≥ 0)` | Pass/fail decision |

## Project Structure

```
backend/
  app.py              # FastAPI application and route handler
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
