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

// Minimal styling for our brutalist dark theme
const nodeStyle = {
  background: 'rgba(0, 5, 10, 0.9)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-accent)',
  borderRadius: '8px',
  padding: '1rem',
  fontFamily: 'monospace',
  boxShadow: '0 4px 20px rgba(178, 213, 229, 0.1)',
  width: 250,
};

export default function WorkflowCanvas({ workflowData }: { workflowData: any[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Sync selected node edits back to the nodes array
  const handleNodeEdit = (field: string, value: string) => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, [field]: value };
    setSelectedNode(updatedNode);
    setNodes((nds) => 
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          // Keep label sync'd with name
          let newLabel = n.data.label;
          if (field === 'name') {
            newLabel = (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <strong style={{ color: n.style?.border?.toString().includes('ffb86c') ? '#ffb86c' : n.style?.border?.toString().includes('ff79c6') ? '#ff79c6' : 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                  [{n.type.toUpperCase()}]
                </strong>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{value}</div>
              </div>
            );
          }
          return { ...n, [field]: value, data: { ...n.data, label: field === 'name' ? newLabel : n.data.label } };
        }
        return n;
      })
    );
  };

  useEffect(() => {
    if (!workflowData || workflowData.length === 0) return;

    // Transform backend nodes into React Flow nodes
    const newNodes = workflowData.map((node, index) => {
      // Color-coding based on type
      let borderColor = 'var(--color-accent)';
      if (node.type === 'trigger') borderColor = '#ffb86c'; // orange
      if (node.type === 'condition') borderColor = '#ff79c6'; // pink

      return {
        id: node.id,
        type: 'default',
        name: node.name,
        nodeType: node.type,
        position: { x: 250, y: index * 150 + 50 }, // Stack vertically
        data: {
          label: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <strong style={{ color: borderColor, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                [{node.type.toUpperCase()}]
              </strong>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{node.name}</div>
            </div>
          ),
        },
        style: { ...nodeStyle, border: `1px solid ${borderColor}` },
      };
    });

    // Create sequential edges between nodes
    const newEdges = [];
    for (let i = 0; i < workflowData.length - 1; i++) {
      newEdges.push({
        id: `e-${workflowData[i].id}-${workflowData[i+1].id}`,
        source: workflowData[i].id,
        target: workflowData[i+1].id,
        animated: true,
        style: { stroke: 'var(--color-accent)', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--color-accent)',
        },
      });
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
      >
        <Controls style={{ background: '#111', color: '#fff', border: '1px solid #333' }} />
        <MiniMap 
          nodeColor={(n) => {
            if (String(n.style?.border || '').includes('ffb86c')) return '#ffb86c';
            if (String(n.style?.border || '').includes('ff79c6')) return '#ff79c6';
            return '#b2d5e5';
          }}
          maskColor="rgba(0,0,0,0.8)"
          style={{ background: '#111', border: '1px solid #333' }}
        />
        <Background color="#333" gap={20} />
      </ReactFlow>

      {/* Slide-out Property Panel */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '350px',
          height: '100%',
          background: 'rgba(5, 5, 5, 0.95)',
          borderLeft: '1px solid var(--color-accent)',
          padding: '2rem',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--color-accent)', fontFamily: 'monospace' }}>NODE PROPERTIES</h3>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>ID</label>
            <div style={{ background: '#111', padding: '0.8rem', borderRadius: '4px', fontSize: '0.9rem', color: '#888', fontFamily: 'monospace' }}>
              {selectedNode.id}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>TYPE</label>
            <div style={{ background: '#111', padding: '0.8rem', borderRadius: '4px', fontSize: '0.9rem', color: '#888', fontFamily: 'monospace' }}>
              {selectedNode.nodeType?.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>ACTION NAME</label>
            <input 
              value={selectedNode.name || ''}
              onChange={(e) => handleNodeEdit('name', e.target.value)}
              style={{
                background: 'rgba(178, 213, 229, 0.05)',
                border: '1px solid rgba(178, 213, 229, 0.2)',
                color: '#fff',
                padding: '0.8rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
