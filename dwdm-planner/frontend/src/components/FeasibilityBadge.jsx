import React from 'react';

export default function FeasibilityBadge({ feasible }) {
  const style = {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: feasible ? '#22c55e' : '#ef4444',
  };

  return <span style={style}>{feasible ? 'PASS' : 'FAIL'}</span>;
}
