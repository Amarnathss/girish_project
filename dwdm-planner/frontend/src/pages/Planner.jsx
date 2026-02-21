import React, { useState } from 'react';
import { checkFeasibility } from '../api/plannerApi';
import NetworkGraph from '../components/NetworkGraph';
import MetricsPanel from '../components/MetricsPanel';

const SAMPLE_PASS = {
  nodes: [
    { id: 'A', label: 'Site A' },
    { id: 'B', label: 'Site B' },
    { id: 'C', label: 'Site C' },
  ],
  spans: [
    { from: 'A', to: 'B', length_km: 60, connectors: 4, splices: 8, amplifier_gain_db: 20 },
    { from: 'B', to: 'C', length_km: 50, connectors: 2, splices: 6, amplifier_gain_db: 18 },
  ],
  service: {
    tx_power_dbm: 2.0,
    receiver_sensitivity_dbm: -28.0,
    osnr_threshold_db: 12.0,
  },
  assumptions: {
    fiber_atten_db_per_km: 0.25,
    conn_loss_db: 0.5,
    splice_loss_db: 0.1,
    noise_penalty_db: 1.5,
    amp_penalty_db: 1.0,
  },
};

const SAMPLE_MEDIUM = {
  nodes: [
    { id: 'A', label: 'Site A' },
    { id: 'B', label: 'Site B' },
    { id: 'C', label: 'Site C' },
  ],
  spans: [
    { from: 'A', to: 'B', length_km: 40, connectors: 2, splices: 8, amplifier_gain_db: 0 },
    { from: 'B', to: 'C', length_km: 60, connectors: 2, splices: 12, amplifier_gain_db: 20 },
  ],
  service: {
    tx_power_dbm: 0.0,
    receiver_sensitivity_dbm: -24.0,
    osnr_threshold_db: 18.0,
  },
  assumptions: {
    fiber_atten_db_per_km: 0.22,
    conn_loss_db: 0.5,
    splice_loss_db: 0.1,
    noise_penalty_db: 3.0,
    amp_penalty_db: 1.0,
  },
};

const SAMPLE_FAIL = {
  nodes: [
    { id: 'A', label: 'Site A' },
    { id: 'B', label: 'Site B' },
    { id: 'C', label: 'Site C' },
  ],
  spans: [
    { from: 'A', to: 'B', length_km: 80, connectors: 2, splices: 10, amplifier_gain_db: 0 },
    { from: 'B', to: 'C', length_km: 90, connectors: 2, splices: 12, amplifier_gain_db: 0 },
  ],
  service: {
    tx_power_dbm: 0.0,
    receiver_sensitivity_dbm: -24.0,
    osnr_threshold_db: 18.0,
  },
  assumptions: {
    fiber_atten_db_per_km: 0.22,
    conn_loss_db: 0.5,
    splice_loss_db: 0.1,
    noise_penalty_db: 3.0,
    amp_penalty_db: 1.0,
  },
};

const SCENARIOS = {
  PASS: SAMPLE_PASS,
  MEDIUM: SAMPLE_MEDIUM,
  FAIL: SAMPLE_FAIL,
};

export default function Planner() {
  const [scenario, setScenario] = useState('PASS');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const payload = SCENARIOS[scenario];

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const data = await checkFeasibility(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>DWDM Link Planner</h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label htmlFor="scenario" style={{ fontWeight: 'bold' }}>Scenario:</label>
        <select
          id="scenario"
          value={scenario}
          onChange={(e) => { setScenario(e.target.value); setResult(null); }}
          style={{ padding: '6px 12px', fontSize: 14 }}
        >
          <option value="PASS">PASS</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="FAIL">FAIL</option>
        </select>

        <button
          onClick={handleRecalculate}
          disabled={loading}
          style={{
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Calculating...' : 'Recalculate'}
        </button>
      </div>

      <NetworkGraph
        nodes={payload.nodes}
        spans={payload.spans}
        feasible={result ? result.feasible : true}
      />

      <MetricsPanel result={result} />
    </div>
  );
}
