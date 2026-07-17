"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, AlertTriangle, Layers, CheckCircle } from "lucide-react";

interface SimStep { node_id: string; node_name: string; estimated_duration_ms: number; tool?: string; possible_output?: string; }
interface SimData { total_estimated_ms: number; services_involved: string[]; warnings: string[]; dependency_summary: string; steps: SimStep[]; }
interface Props { simulation: SimData | null; isLoading?: boolean; onRunReal?: () => void; }

function formatMs(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

const CAT_COLORS: Record<string, string> = { trigger: "#ffb86c", condition: "#ff79c6", transform: "#8be9fd", action: "#B2D5E5", output: "#50fa7b" };

export function SimulationPanel({ simulation, isLoading, onRunReal }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (isLoading) return (
    <div style={{ padding: "2rem" }}>
      {[1,2,3,4].map(i => <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i*0.15 }} style={{ height: "3rem", background: "rgba(178,213,229,0.06)", borderRadius: "8px", marginBottom: "1rem" }} />)}
    </div>
  );

  if (!simulation) return <div style={{ padding: "2rem", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>[NO SIMULATION DATA — DEPLOY A WORKFLOW FIRST]</div>;

  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <PlayCircle size={18} style={{ color: "var(--color-accent)" }} />
        <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>SIMULATION PREVIEW</h3>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {[
          { icon: <Clock size={16}/>, label: "Est. Duration", value: formatMs(simulation.total_estimated_ms), accent: true },
          { icon: <Layers size={16}/>, label: "Services", value: simulation.services_involved.length, accent: false },
          { icon: <AlertTriangle size={16}/>, label: "Warnings", value: simulation.warnings.length, accent: simulation.warnings.length > 0 },
        ].map((card, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${card.accent ? "rgba(178,213,229,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-md)", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: card.accent ? "var(--color-accent)" : "var(--color-text-muted)", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", marginBottom: "0.5rem" }}>
              {card.icon} {card.label}
            </div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, fontFamily: "var(--font-mono)", color: card.accent ? "var(--color-accent)" : "#fff" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>SERVICES INVOLVED</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {simulation.services_involved.map(s => (
            <span key={s} style={{ background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.25rem 0.75rem", fontSize: "var(--text-sm)", color: "var(--color-accent)" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {simulation.warnings.length > 0 && (
        <div style={{ background: "rgba(255,184,108,0.05)", border: "1px solid rgba(255,184,108,0.2)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "#ffb86c", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>⚠ WARNINGS</div>
          {simulation.warnings.map((w, i) => <p key={i} style={{ margin: "0.25rem 0", fontSize: "var(--text-sm)", color: "rgba(255,184,108,0.8)" }}>• {w}</p>)}
        </div>
      )}

      {/* Step-by-step */}
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>EXECUTION STEPS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {simulation.steps.map((step, i) => (
            <motion.div key={step.node_id} whileHover={{ x: 3 }} onHoverStart={() => setHovered(step.node_id)} onHoverEnd={() => setHovered(null)}
              style={{ background: hovered === step.node_id ? "rgba(178,213,229,0.06)" : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "default", transition: "all 0.2s" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(178,213,229,0.1)", border: "1px solid rgba(178,213,229,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--color-accent)", flexShrink: 0 }}>{i+1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--text-sm)", color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{step.node_name}</div>
                {step.possible_output && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>→ {step.possible_output}</div>}
              </div>
              <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", flexShrink: 0 }}>{formatMs(step.estimated_duration_ms)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {onRunReal && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRunReal}
          style={{ width: "100%", padding: "1rem", background: "var(--color-accent)", color: "#020202", border: "none", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: "var(--text-base)", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <CheckCircle size={18} /> EXECUTE REAL WORKFLOW
        </motion.button>
      )}
    </div>
  );
}
