# DWDM Planner - Backend

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn app:app --reload --port 8000
```

## Test

```bash
pytest tests/
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/plan/feasibility` - Check link feasibility
