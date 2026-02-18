import React from 'react';
import FeasibilityBadge from './FeasibilityBadge';

export default function MetricsPanel({ result }) {
  if (!result) return null;

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginTop: 16 }}>
      <h3>Link Metrics</h3>
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
  );
}
