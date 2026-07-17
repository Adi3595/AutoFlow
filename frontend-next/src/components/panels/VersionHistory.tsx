"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, RotateCcw, ChevronDown, ChevronRight, Clock } from "lucide-react";

interface WorkflowVersion {
  version: number;
  saved_at: string;
  intent: string;
  nodes: any[];
  change_summary: string;
}
interface Props {
  workflowId: string;
  currentNodes: any[];
  currentIntent: string;
  onRestore: (nodes: any[], intent: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function VersionHistory({ workflowId, currentNodes, currentIntent, onRestore }: Props) {
  const storageKey = `autoflow_versions_${workflowId}`;
  const [expanded, setExpanded] = useState<number | null>(null);

  const getVersions = (): WorkflowVersion[] => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch { return []; }
  };

  const saveVersion = (summary: string) => {
    const versions = getVersions();
    const newVersion: WorkflowVersion = {
      version: versions.length + 1,
      saved_at: new Date().toISOString(),
      intent: currentIntent,
      nodes: currentNodes,
      change_summary: summary || `Snapshot v${versions.length + 1}`,
    };
    const updated = [newVersion, ...versions].slice(0, 20); // keep last 20
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  };

  const [versions, setVersions] = React.useState<WorkflowVersion[]>([]);
  const [savingLabel, setSavingLabel] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    setVersions(getVersions());
  }, []);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    const updated = saveVersion(savingLabel || "Manual snapshot");
    setVersions(updated);
    setSavingLabel("");
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleRestore = (v: WorkflowVersion) => {
    onRestore(v.nodes, v.intent);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid rgba(178,213,229,0.08)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <GitBranch size={18} style={{ color: "var(--color-accent)" }} />
        <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>VERSION HISTORY</h3>
        <span style={{ fontSize: "var(--text-xs)", background: "rgba(178,213,229,0.1)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>{versions.length} saved</span>
      </div>

      {/* Save current version */}
      <div style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "0.75rem" }}>
        <input value={savingLabel} onChange={e => setSavingLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()} placeholder="Snapshot label (optional)"
          style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(178,213,229,0.15)", borderRadius: "var(--radius-sm)", padding: "0.5rem 0.75rem", color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", outline: "none" }} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
          style={{ background: isSaving ? "rgba(80,250,123,0.2)" : "rgba(178,213,229,0.1)", border: `1px solid ${isSaving ? "rgba(80,250,123,0.4)" : "rgba(178,213,229,0.2)"}`, borderRadius: "var(--radius-sm)", padding: "0.5rem 1rem", color: isSaving ? "#50fa7b" : "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", cursor: "pointer", whiteSpace: "nowrap" }}>
          {isSaving ? "✓ SAVED" : "SAVE NOW"}
        </motion.button>
      </div>

      {/* Version list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 2rem" }}>
        {versions.length === 0 ? (
          <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", padding: "1rem 0" }}>
            No snapshots yet. Click "SAVE NOW" to capture the current state.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {versions.map((v, i) => (
              <div key={i}>
                <motion.div whileHover={{ x: 2 }} onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-md)", padding: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(178,213,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--color-accent)", flexShrink: 0 }}>v{v.version}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-sm)", color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.change_summary}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem", fontSize: "var(--text-xs)", color: "var(--color-text-faint)" }}>
                      <Clock size={10} /> {formatDate(v.saved_at)} · {v.nodes.length} nodes
                    </div>
                  </div>
                  {expanded === i ? <ChevronDown size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />}
                </motion.div>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ background: "rgba(178,213,229,0.03)", border: "1px solid rgba(178,213,229,0.1)", borderTop: "none", borderRadius: "0 0 var(--radius-md) var(--radius-md)", padding: "1rem" }}>
                        <p style={{ margin: "0 0 0.75rem", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontStyle: "italic" }}>"{v.intent}"</p>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", marginBottom: "0.75rem" }}>
                          {v.nodes.slice(0,3).map((n: any) => n.name).join(" → ")}{v.nodes.length > 3 ? ` +${v.nodes.length-3} more` : ""}
                        </div>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleRestore(v)}
                          style={{ background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-sm)", padding: "0.4rem 1rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <RotateCcw size={12} /> RESTORE THIS VERSION
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
