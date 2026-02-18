# Demo Script - DWDM Link Feasibility Planner

## Prerequisites

1. Backend running on http://localhost:8000
2. Frontend running on http://localhost:5173

## Starting the Application

### Step 1: Start Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Step 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo Flow

### Demo 1: PASS Scenario

1. Open browser to http://localhost:5173
2. Select "PASS" from the Scenario dropdown
3. Click "Recalculate"
4. Observe:
   - Network graph shows 3 nodes (Site A, Site B, Site C) connected with green edges
   - Metrics panel displays Total Loss, Rx Power, and OSNR Margin
   - Status badge shows green "PASS"
5. Explain the topology: two moderate spans with adequate amplification

### Demo 2: FAIL Scenario

1. Select "FAIL" from the Scenario dropdown
2. Click "Recalculate"
3. Observe:
   - Network graph edges turn red
   - Metrics panel shows higher loss values and negative OSNR margin
   - Status badge shows red "FAIL"
4. Explain: longer spans with insufficient amplification cause link to fail

### Demo 3: API Direct Call

1. Open a terminal
2. Run health check:

```bash
curl http://localhost:8000/health
```

3. Show direct API call with sample data:

```bash
curl -X POST http://localhost:8000/api/plan/feasibility \
  -H "Content-Type: application/json" \
  -d @data/sample_topology_pass.json
```

4. Show the JSON response with calculated metrics

### Demo 4: Running Tests

```bash
cd backend
pytest tests/ -v
```

Show all tests passing with calculated values matching expected results.

## Key Talking Points

- Real-time calculation with no page refresh needed
- Visual feedback through color-coded network edges
- Clear pass/fail determination based on industry-standard criteria
- Modular backend services for power budget and OSNR calculations
- RESTful API design following standard conventions
