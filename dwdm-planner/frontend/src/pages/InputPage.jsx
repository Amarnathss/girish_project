import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkFeasibility } from '../api/plannerApi';

/* ── Preset definitions ──────────────────────────────────── */
const PRESETS = {
  PASS: {
    nodes: [
      { id: 'A', label: 'Site A' },
      { id: 'B', label: 'Site B' },
    ],
    spans: [
      { from: 'A', to: 'B', length_km: 50, connectors: 2, splices: 6, amplifier_gain_db: 20 },
    ],
    service: { tx_power_dbm: 2, receiver_sensitivity_dbm: -28, osnr_threshold_db: 12 },
  },
  MEDIUM: {
    nodes: [
      { id: 'A', label: 'Site A' },
      { id: 'B', label: 'Site B' },
      { id: 'C', label: 'Site C' },
    ],
    spans: [
      { from: 'A', to: 'B', length_km: 40, connectors: 2, splices: 8, amplifier_gain_db: 0 },
      { from: 'B', to: 'C', length_km: 60, connectors: 2, splices: 12, amplifier_gain_db: 20 },
    ],
    service: { tx_power_dbm: 0, receiver_sensitivity_dbm: -24, osnr_threshold_db: 18 },
  },
  FAIL: {
    nodes: [
      { id: 'A', label: 'Site A' },
      { id: 'B', label: 'Site B' },
      { id: 'C', label: 'Site C' },
    ],
    spans: [
      { from: 'A', to: 'B', length_km: 80, connectors: 2, splices: 10, amplifier_gain_db: 0 },
      { from: 'B', to: 'C', length_km: 90, connectors: 2, splices: 12, amplifier_gain_db: 0 },
    ],
    service: { tx_power_dbm: 0, receiver_sensitivity_dbm: -24, osnr_threshold_db: 18 },
  },
};

const SPAN_FIELD_LABELS = {
  length_km: 'Length (km)',
  connectors: 'Connectors',
  splices: 'Splices',
  amplifier_gain_db: 'Amplifier Gain (dB)',
};
const SPAN_FIELDS = ['length_km', 'connectors', 'splices', 'amplifier_gain_db'];

const SERVICE_FIELD_LABELS = {
  tx_power_dbm: 'Tx Power (dBm)',
  receiver_sensitivity_dbm: 'Receiver Sensitivity (dBm)',
  osnr_threshold_db: 'OSNR Threshold (dB)',
};
const SERVICE_FIELDS = ['tx_power_dbm', 'receiver_sensitivity_dbm', 'osnr_threshold_db'];

/* ── Build API payload from form state ───────────────────── */
function buildPayload(form) {
  return {
    nodes: form.nodes,
    spans: form.spans.map((s) => ({
      from: s.from,
      to: s.to,
      length_km: Number(s.length_km),
      connectors: Number(s.connectors),
      splices: Number(s.splices),
      amp_gain_db: Number(s.amplifier_gain_db),
      amp_penalty_db: 1.0,
    })),
    service: {
      tx_power_dbm: Number(form.service.tx_power_dbm),
      receiver_sensitivity_dbm: Number(form.service.receiver_sensitivity_dbm),
      osnr_threshold_db: Number(form.service.osnr_threshold_db),
      noise_penalty_db: 3.0,
    },
    assumptions: {
      atten_db_per_km: 0.22,
      conn_loss_db: 0.5,
      splice_loss_db: 0.1,
    },
  };
}

/* ── Component ───────────────────────────────────────────── */
export default function InputPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(structuredClone(PRESETS.PASS));
  const [activePreset, setActivePreset] = useState('PASS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreset = (key) => {
    setForm(structuredClone(PRESETS[key]));
    setActivePreset(key);
    setError(null);
  };

  const handleSpanChange = (spanIdx, field, value) => {
    setForm((prev) => {
      const spans = prev.spans.map((s, i) =>
        i === spanIdx ? { ...s, [field]: value } : s
      );
      return { ...prev, spans };
    });
  };

  const handleServiceChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      service: { ...prev.service, [field]: value },
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = buildPayload(form);
      const result = await checkFeasibility(payload);
      navigate('/result', {
        state: { result, nodes: payload.nodes, spans: payload.spans },
      });
    } catch (err) {
      console.error(err);
      setError('Calculation failed. Is the backend running?');
    }
    setLoading(false);
  };

  const inputStyle = {
    padding: '8px 12px',
    fontSize: 14,
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>DWDM Link Planner</h1>

      {/* Preset buttons */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        {Object.keys(PRESETS).map((key) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            style={{
              padding: '8px 20px',
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor:
                key === 'PASS' ? '#22c55e' : key === 'FAIL' ? '#ef4444' : '#f59e0b',
              color: '#fff',
              border: activePreset === key ? '3px solid #333' : '3px solid transparent',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {key} ({PRESETS[key].nodes.length} nodes)
          </button>
        ))}
      </div>

      {/* Topology info */}
      <div style={{ marginBottom: 16, fontSize: 14, color: '#555' }}>
        <strong>Topology:</strong>{' '}
        {form.nodes.map((n) => n.label || n.id).join(' → ')}
      </div>

      {/* Per-span fields */}
      {form.spans.map((span, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 16,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: '#fafafa',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: 15 }}>
            Span {idx + 1}: {span.from} → {span.to}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            {SPAN_FIELDS.map((field) => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontWeight: 'bold', fontSize: 12, color: '#555' }}>
                  {SPAN_FIELD_LABELS[field]}
                </label>
                <input
                  type="number"
                  value={span[field]}
                  onChange={(e) => handleSpanChange(idx, field, e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Service parameters */}
      <div
        style={{
          marginBottom: 24,
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: 15 }}>Service Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {SERVICE_FIELDS.map((field) => (
            <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontWeight: 'bold', fontSize: 12, color: '#555' }}>
                {SERVICE_FIELD_LABELS[field]}
              </label>
              <input
                type="number"
                value={form.service[field]}
                onChange={(e) => handleServiceChange(field, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ color: '#ef4444', marginBottom: 16, fontWeight: 'bold' }}>{error}</div>
      )}

      <button
        onClick={handleCalculate}
        disabled={loading}
        style={{
          padding: '10px 32px',
          fontSize: 16,
          fontWeight: 'bold',
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </div>
  );
}
