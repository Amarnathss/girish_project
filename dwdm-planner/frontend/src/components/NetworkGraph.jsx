import React, { useMemo } from 'react';
import ReactFlow from 'react-flow-renderer';

export default function NetworkGraph({ nodes, spans, feasible }) {
  const flowNodes = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      data: { label: node.label },
      position: { x: index * 200, y: 100 },
      style: {
        background: '#fff',
        border: '2px solid #333',
        borderRadius: 8,
        padding: 10,
        fontWeight: 'bold',
      },
    }));
  }, [nodes]);

  const flowEdges = useMemo(() => {
    return spans.map((span, index) => ({
      id: `e${index}`,
      source: span.from || nodes[index]?.id || `node-${index}`,
      target: span.to || nodes[index + 1]?.id || `node-${index + 1}`,
      label: `${span.length_km} km`,
      animated: true,
      style: { stroke: feasible ? '#22c55e' : '#ef4444', strokeWidth: 3 },
      labelStyle: { fontWeight: 'bold' },
    }));
  }, [spans, nodes, feasible]);

  return (
    <div style={{ width: '100%', height: 300, border: '1px solid #ddd', borderRadius: 8 }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView />
    </div>
  );
}
