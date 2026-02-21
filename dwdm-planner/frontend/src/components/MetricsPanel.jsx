import React from 'react';
import FeasibilityBadge from './FeasibilityBadge';

const ASSUMPTION_LABELS = {
  atten_db_per_km: 'Fiber Attenuation',
  fiber_atten_db_per_km: 'Fiber Attenuation',
  conn_loss_db: 'Connector Loss',
  splice_loss_db: 'Splice Loss',
  noise_penalty_db: 'Noise Penalty',
  amp_penalty_db: 'Amplifier Penalty',
};

const ASSUMPTION_UNITS = {
  atten_db_per_km: 'dB/km',
  fiber_atten_db_per_km: 'dB/km',
  conn_loss_db: 'dB',
  splice_loss_db: 'dB',
  noise_penalty_db: 'dB',
  amp_penalty_db: 'dB',
};

export default function MetricsPanel({ result }) {
  if (!result) return null;

  const cellStyle = { padding: '8px 12px', borderBottom: '1px solid #eee' };
  const headerCellStyle = { ...cellStyle, fontWeight: 'bold', backgroundColor: '#f9fafb', textAlign: 'left' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
      {/* Summary Metrics */}
      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Link Metrics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Total Loss</td>
              <td style={{ padding: 8 }}>{result.total_loss_db} dB</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Rx Power</td>
              <td style={{ padding: 8 }}>{result.rx_power_dbm} dBm</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>OSNR Margin</td>
              <td style={{ padding: 8 }}>{result.osnr_margin_db} dB</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Status</td>
              <td style={{ padding: 8 }}>
                <FeasibilityBadge feasible={result.feasible} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-Span Breakdown */}
      {result.per_span && result.per_span.length > 0 && (
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Per-Span Breakdown</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Span</th>
                <th style={headerCellStyle}>From</th>
                <th style={headerCellStyle}>To</th>
                <th style={headerCellStyle}>Length (km)</th>
                <th style={headerCellStyle}>Loss (dB)</th>
              </tr>
            </thead>
            <tbody>
              {result.per_span.map((span, idx) => (
                <tr key={idx}>
                  <td style={cellStyle}>{span.span_index != null ? span.span_index + 1 : idx + 1}</td>
                  <td style={cellStyle}>{span.from || '—'}</td>
                  <td style={cellStyle}>{span.to || '—'}</td>
                  <td style={cellStyle}>{span.length_km}</td>
                  <td style={{
                    ...cellStyle,
                    fontWeight: 'bold',
                    color: span.loss_db > 15 ? '#ef4444' : '#22c55e',
                  }}>
                    {span.loss_db} dB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assumptions Used */}
      {result.assumptions_used && (
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>Assumptions Used</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Parameter</th>
                <th style={headerCellStyle}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.assumptions_used).map(([key, value]) => (
                <tr key={key}>
                  <td style={cellStyle}>{ASSUMPTION_LABELS[key] || key}</td>
                  <td style={cellStyle}>
                    {value} {ASSUMPTION_UNITS[key] || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
