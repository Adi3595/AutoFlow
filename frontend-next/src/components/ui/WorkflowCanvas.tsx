"use client";

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Type color map
const TYPE_COLORS: Record<string, string> = {
  trigger:   '#ffb86c',
  condition: '#ff79c6',
  transform: '#8be9fd',
  action:    '#B2D5E5',
  output:    '#50fa7b',
};
const TYPE_DEFAULT = '#B2D5E5';

function getColor(type: string) {
  return TYPE_COLORS[type?.toLowerCase()] ?? TYPE_DEFAULT;
}

function buildNodeLabel(node: any, color: string) {
  const tool = node.metadata?.tool;
  const desc = node.metadata?.description;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.1em', color, textTransform: 'uppercase', fontWeight: 600 }}>
          {node.type}
        </span>
        {tool && (
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono, monospace)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
            {tool}
          </span>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', lineHeight: 1.3 }}>{node.name}</div>
      {desc && (
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, marginTop: '0.2rem' }}>{desc}</div>
      )}
    </div>
  );
}

export default function WorkflowCanvas({ workflowData }: { workflowData: any[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNodeEdit = (field: string, value: string) => {
    if (!selectedNode) return;
    setSelectedNode({ ...selectedNode, [field]: value });
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== selectedNode.id) return n;
        const updated = { ...n, [field]: value };
        if (field === 'name') {
          updated.data = { ...n.data, label: buildNodeLabel({ ...n, name: value, metadata: n.data?._meta }, getColor(n.nodeType)) };
        }
        return updated;
      })
    );
  };

  useEffect(() => {
    if (!workflowData || workflowData.length === 0) return;

    // Layout: stagger nodes in a gentle S-curve for readability
    const COLS = 2;
    const COL_GAP = 340;
    const ROW_GAP = 180;

    const newNodes = workflowData.map((node, index) => {
      const color = getColor(node.type);
      const col = index % COLS;
      const row = Math.floor(index / COLS);
      const x = col * COL_GAP + (row % 2 === 0 ? 0 : COL_GAP / 2);
      const y = row * ROW_GAP + 50;

      return {
        id: node.id,
        type: 'default',
        name: node.name,
        nodeType: node.type,
        position: { x, y },
        data: {
          label: buildNodeLabel(node, color),
          _meta: node.metadata,
        },
        style: {
          background: 'rgba(0, 5, 10, 0.95)',
          color: '#fff',
          border: `1px solid ${color}`,
          borderRadius: '10px',
          padding: '1rem',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          boxShadow: `0 4px 24px ${color}22`,
          width: 280,
        },
      };
    });

    // Build edges from metadata.next / on_true / on_false where available, else sequential
    const newEdges: any[] = [];
    const usedPairs = new Set<string>();

    workflowData.forEach((node) => {
      const addEdgeIfNew = (src: string, tgt: string, label?: string) => {
        const key = `${src}->${tgt}`;
        if (usedPairs.has(key)) return;
        usedPairs.add(key);
        const color = label === 'YES' ? '#50fa7b' : label === 'NO' ? '#ff79c6' : 'var(--color-accent)';
        newEdges.push({
          id: `e-${src}-${tgt}`,
          source: src,
          target: tgt,
          animated: true,
          label: label || undefined,
          labelStyle: { fill: color, fontFamily: 'monospace', fontSize: 11 },
          labelBgStyle: { fill: '#020202', fillOpacity: 0.8 },
          style: { stroke: color, strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color },
        });
      };

      const meta = node.metadata || {};
      const nexts: string[] = meta.next || [];
      const onTrue: string[] = meta.on_true || [];
      const onFalse: string[] = meta.on_false || [];

      nexts.forEach((tgt: string) => addEdgeIfNew(node.id, tgt));
      onTrue.forEach((tgt: string) => addEdgeIfNew(node.id, tgt, 'YES'));
      onFalse.forEach((tgt: string) => addEdgeIfNew(node.id, tgt, 'NO'));
    });

    // Fallback: if no edges were built from metadata, use sequential
    if (newEdges.length === 0) {
      for (let i = 0; i < workflowData.length - 1; i++) {
        const src = workflowData[i].id;
        const tgt = workflowData[i + 1].id;
        const color = 'var(--color-accent)';
        newEdges.push({
          id: `e-${src}-${tgt}`,
          source: src,
          target: tgt,
          animated: true,
          style: { stroke: color, strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color },
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [workflowData, setNodes, setEdges]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#020202' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #222' }} />
        <MiniMap
          nodeColor={(n) => getColor((n as any).nodeType as string)}
          maskColor="rgba(0,0,0,0.85)"
          style={{ background: '#0a0a0a', border: '1px solid #222' }}
        />
        <Background color="#1a1a1a" gap={24} />
      </ReactFlow>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', zIndex: 20 }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono, monospace)', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '2px', background: color }} />
            {type.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Slide-out Property Panel */}
      {selectedNode && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '360px', height: '100%',
          background: 'rgba(5, 5, 5, 0.97)',
          borderLeft: `1px solid ${getColor(selectedNode.nodeType)}`,
          padding: '1.5rem',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.9)',
          zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.25rem',
          backdropFilter: 'blur(12px)', overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono, monospace)', color: getColor(selectedNode.nodeType), letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                {selectedNode.nodeType?.toUpperCase()}
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: '#fff', fontWeight: 600 }}>Node Properties</h3>
            </div>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', width: 32, height: 32, borderRadius: '6px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Fields */}
          {[
            { label: 'Node ID', value: selectedNode.id, mono: true, readonly: true },
            { label: 'Tool / Service', value: selectedNode.data?._meta?.tool || '—', mono: true, readonly: true },
            { label: 'Operation', value: selectedNode.data?._meta?.operation || '—', mono: true, readonly: true },
          ].map(({ label, value, mono, readonly }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.05em' }}>{label.toUpperCase()}</label>
              <div style={{ background: '#0d0d0d', padding: '0.7rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', color: readonly ? '#555' : '#fff', fontFamily: mono ? 'var(--font-mono, monospace)' : 'inherit', border: '1px solid #1a1a1a' }}>
                {value}
              </div>
            </div>
          ))}

          {/* Editable: Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.05em' }}>ACTION NAME</label>
            <input
              value={selectedNode.name || ''}
              onChange={(e) => handleNodeEdit('name', e.target.value)}
              style={{ background: 'rgba(178, 213, 229, 0.05)', border: `1px solid ${getColor(selectedNode.nodeType)}44`, color: '#fff', padding: '0.7rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: 'var(--text-sm)', outline: 'none', width: '100%' }}
            />
          </div>

          {/* Description */}
          {selectedNode.data?._meta?.description && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.05em' }}>DESCRIPTION</label>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, background: '#0d0d0d', padding: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid #1a1a1a' }}>
                {selectedNode.data._meta.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
