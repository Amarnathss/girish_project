# API Contract - DWDM Planner

## Base URL

```
http://localhost:8000
```

## Endpoints

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

---

### POST /api/plan/feasibility

Evaluate DWDM link feasibility based on topology, service parameters, and assumptions.

**Request Body:**

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
      "length_km": 80,
      "connectors": 4,
      "splices": 10,
      "amp_gain_db": 20.0,
      "amp_penalty_db": 1.0
    }
  ],
  "service": {
    "tx_power_dbm": 2.0,
    "receiver_sensitivity_dbm": -28.0,
    "osnr_threshold_db": 12.0,
    "noise_penalty_db": 1.5
  },
  "assumptions": {
    "atten_db_per_km": 0.25,
    "conn_loss_db": 0.5,
    "splice_loss_db": 0.1
  }
}
```

**Request Fields:**

| Field | Type | Description |
|-------|------|-------------|
| nodes | array | List of network nodes with id and label |
| spans | array | List of fiber spans between nodes |
| service | object | Transceiver and service parameters |
| assumptions | object | Fiber and component loss assumptions |

**Span Fields:**

| Field | Type | Description |
|-------|------|-------------|
| from | string | Source node ID |
| to | string | Destination node ID |
| length_km | float | Span length in kilometers |
| connectors | int | Number of connectors |
| splices | int | Number of splices |
| amp_gain_db | float | Amplifier gain in dB |
| amp_penalty_db | float | Amplifier penalty in dB |

**Service Fields:**

| Field | Type | Description |
|-------|------|-------------|
| tx_power_dbm | float | Transmit power in dBm |
| receiver_sensitivity_dbm | float | Minimum receiver power in dBm |
| osnr_threshold_db | float | Required OSNR threshold in dB |
| noise_penalty_db | float | System noise penalty in dB |

**Assumptions Fields:**

| Field | Type | Description |
|-------|------|-------------|
| atten_db_per_km | float | Fiber attenuation per km in dB |
| conn_loss_db | float | Loss per connector in dB |
| splice_loss_db | float | Loss per splice in dB |

**Response:**

```json
{
  "total_loss_db": 4.0,
  "rx_power_dbm": -2.0,
  "osnr_margin_db": 3.5,
  "feasible": true,
  "per_span": [
    {
      "span_index": 0,
      "from": "A",
      "to": "B",
      "length_km": 80,
      "loss_db": 4.0
    }
  ],
  "assumptions_used": {
    "atten_db_per_km": 0.25,
    "conn_loss_db": 0.5,
    "splice_loss_db": 0.1
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| total_loss_db | float | Total link loss in dB |
| rx_power_dbm | float | Received power in dBm |
| osnr_margin_db | float | OSNR margin above threshold in dB |
| feasible | bool | true if link meets all criteria |
| per_span | array | Per-span loss breakdown |
| assumptions_used | object | Echo of assumptions used |

**Feasibility Criteria:**

- `rx_power_dbm >= receiver_sensitivity_dbm`
- `osnr_margin_db >= 0`
- Both conditions must be true for `feasible = true`
