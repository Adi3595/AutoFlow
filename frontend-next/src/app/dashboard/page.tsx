"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Terminal, Clock, Trash2, Edit3, ChevronRight,
  Network, Sparkles, PlayCircle, MessageSquare, Lightbulb,
  FileText, GitBranch, BarChart2, LayoutTemplate
} from "lucide-react";
import WorkflowCanvas from "@/components/ui/WorkflowCanvas";
import { ExplanationPanel } from "@/components/panels/ExplanationPanel";
import { SimulationPanel } from "@/components/panels/SimulationPanel";
import { ConversationalEdit } from "@/components/panels/ConversationalEdit";
import { SuggestionsPanel } from "@/components/panels/SuggestionsPanel";
import { TimelinePanel } from "@/components/panels/TimelinePanel";
import { DocumentationPanel } from "@/components/panels/DocumentationPanel";
import { VersionHistory } from "@/components/panels/VersionHistory";

interface SavedWorkflow {
  id: string;
  intent: string;
  createdAt: string;
  nodes: any[];
  agents: any[];
  execution_logs?: string[];
  explanation?: string | null;
  simulation?: any | null;
  suggestions?: any[] | null;
  documentation?: any | null;
}

type TabId = "canvas" | "explain" | "simulate" | "edit" | "suggest" | "timeline" | "docs" | "history";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "canvas",   label: "CANVAS",      icon: <Network size={14} /> },
  { id: "explain",  label: "EXPLAIN",     icon: <Sparkles size={14} /> },
  { id: "simulate", label: "SIMULATE",    icon: <PlayCircle size={14} /> },
  { id: "edit",     label: "EDIT AI",     icon: <MessageSquare size={14} /> },
  { id: "suggest",  label: "SUGGEST",     icon: <Lightbulb size={14} /> },
  { id: "timeline", label: "TIMELINE",    icon: <Clock size={14} /> },
  { id: "docs",     label: "DOCS",        icon: <FileText size={14} /> },
  { id: "history",  label: "HISTORY",     icon: <GitBranch size={14} /> },
];

export default function Dashboard() {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<SavedWorkflow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingIntent, setEditingIntent] = useState(false);
  const [editedIntent, setEditedIntent] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("canvas");

  useEffect(() => {
    const saved = localStorage.getItem("autoflow_workflows");
    if (saved) {
      try {
        const parsed: SavedWorkflow[] = JSON.parse(saved);
        setSavedWorkflows(parsed);
        if (parsed.length > 0) setActiveWorkflow(parsed[0]);
      } catch (e) { console.error("Failed to parse workflows"); }
    }
    setIsLoaded(true);
  }, []);

  const persistWorkflows = useCallback((updated: SavedWorkflow[]) => {
    setSavedWorkflows(updated);
    localStorage.setItem("autoflow_workflows", JSON.stringify(updated));
  }, []);

  const deleteWorkflow = (id: string) => {
    const updated = savedWorkflows.filter(w => w.id !== id);
    persistWorkflows(updated);
    setActiveWorkflow(updated.length > 0 ? updated[0] : null);
  };

  const updateActiveWorkflow = useCallback((patch: Partial<SavedWorkflow>) => {
    if (!activeWorkflow) return;
    const updated = savedWorkflows.map(w => w.id === activeWorkflow.id ? { ...w, ...patch } : w);
    persistWorkflows(updated);
    setActiveWorkflow(prev => prev ? { ...prev, ...patch } : null);
  }, [activeWorkflow, savedWorkflows, persistWorkflows]);

  const saveIntentEdit = () => {
    if (!activeWorkflow) return;
    updateActiveWorkflow({ intent: editedIntent });
    setEditingIntent(false);
  };

  // Conversational edit callback — called by ConversationalEdit panel
  const handleWorkflowEdited = (nodes: any[], agents: any[], explanation: string | null) => {
    updateActiveWorkflow({ nodes, agents, explanation });
    setActiveTab("canvas");
  };

  // Version restore callback
  const handleVersionRestore = (nodes: any[], intent: string) => {
    updateActiveWorkflow({ nodes, intent });
    setActiveTab("canvas");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const navBtn = (href: string, label: string, primary = false) => (
    <Link href={href} passHref style={{ textDecoration: "none" }}>
      <motion.button whileHover={{ y: -2 }} style={{
        background: primary ? "var(--color-accent)" : "transparent",
        border: `1px solid ${primary ? "transparent" : "rgba(178,213,229,0.3)"}`,
        borderRadius: "var(--radius-sm)", padding: "0.45rem 0.9rem",
        color: primary ? "#020202" : "var(--color-accent)",
        fontWeight: 600, cursor: "pointer",
        fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)"
      }}>{label}</motion.button>
    </Link>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "transparent", color: "var(--color-text)" }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <header style={{ padding: "1.2rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Terminal size={18} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>OS
          </h1>
          {savedWorkflows.length > 0 && (
            <span style={{ fontSize: "var(--text-xs)", background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.2rem 0.8rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>
              {savedWorkflows.length} workflow{savedWorkflows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {navBtn("/agents", "[⚡] AGENTS")}
          {navBtn("/analytics", "[📊] ANALYTICS")}
          {navBtn("/templates", "[📦] TEMPLATES")}
          {navBtn("/integrations", "[+] INTEGRATIONS", true)}
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ x: -3 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
              <ArrowLeft size={14} /> NEW
            </motion.button>
          </Link>
        </div>
      </header>

      {/* ── Main Layout ───────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 65px)" }}>

        {/* LEFT: Workflow Sidebar */}
        <div style={{ width: "280px", borderRight: "1px solid var(--color-border)", background: "rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid rgba(178,213,229,0.06)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>[MY WORKFLOWS]</h3>
            <p style={{ margin: "0.3rem 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-faint)" }}>Click to load & inspect</p>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
            {!isLoaded ? (
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontFamily: "var(--font-mono)", padding: "1rem 0" }}>Loading...</div>
            ) : savedWorkflows.length === 0 ? (
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-faint)", fontStyle: "italic", padding: "1rem 0" }}>
                No saved workflows.<br />Deploy one from the homepage!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {savedWorkflows.map(wf => (
                  <motion.div key={wf.id} whileHover={{ x: 2 }}
                    onClick={() => { setActiveWorkflow(wf); setEditingIntent(false); setActiveTab("canvas"); }}
                    style={{ padding: "0.875rem", borderRadius: "var(--radius-md)", cursor: "pointer", background: activeWorkflow?.id === wf.id ? "var(--color-surface-hover)" : "var(--color-surface)", border: `1px solid ${activeWorkflow?.id === wf.id ? "var(--color-border-bright)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.18s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.4rem" }}>
                      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: activeWorkflow?.id === wf.id ? "#fff" : "var(--color-text-muted)", lineHeight: 1.4, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {wf.intent}
                      </p>
                      <button onClick={e => { e.stopPropagation(); deleteWorkflow(wf.id); }}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,80,80,0.4)", padding: 0, flexShrink: 0 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem", fontSize: "var(--text-xs)", color: "var(--color-text-faint)" }}>
                      <Clock size={10} />
                      {formatDate(wf.createdAt)}
                      <span style={{ marginLeft: "auto", color: "var(--color-accent-dim)" }}>
                        {wf.nodes.length}n · {wf.agents?.length ?? 0}a
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Workspace */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Intent bar */}
          <AnimatePresence mode="wait">
            {activeWorkflow && (
              <motion.div key={activeWorkflow.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(0,0,0,0.15)", flexShrink: 0 }}>
                <ChevronRight size={13} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                {editingIntent ? (
                  <>
                    <input autoFocus value={editedIntent} onChange={e => setEditedIntent(e.target.value)} onKeyDown={e => e.key === "Enter" && saveIntentEdit()}
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid var(--color-accent)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", outline: "none", padding: "0.1rem 0" }} />
                    <button onClick={saveIntentEdit} style={{ background: "var(--color-accent)", color: "#020202", border: "none", borderRadius: "var(--radius-sm)", padding: "0.25rem 0.75rem", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700 }}>SAVE</button>
                    <button onClick={() => setEditingIntent(false)} style={{ background: "transparent", color: "var(--color-text-muted)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", padding: "0.25rem 0.75rem", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>CANCEL</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {activeWorkflow.intent}
                    </span>
                    <button onClick={() => { setEditedIntent(activeWorkflow.intent); setEditingIntent(true); }}
                      style={{ background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "0.25rem 0.75rem", cursor: "pointer", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Edit3 size={11} /> RENAME
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab bar */}
          {activeWorkflow && (
            <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", background: "rgba(0,0,0,0.1)", flexShrink: 0, overflowX: "auto" }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.1rem", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "var(--color-accent)" : "transparent"}`, color: activeTab === tab.id ? "var(--color-accent)" : "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease", letterSpacing: "0.05em" }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {!isLoaded ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>[LOADING...]</div>
            ) : activeWorkflow ? (
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ height: "100%", overflow: "hidden" }}>
                  {activeTab === "canvas" && <WorkflowCanvas key={activeWorkflow.id} workflowData={activeWorkflow.nodes} />}
                  {activeTab === "explain" && <ExplanationPanel explanation={activeWorkflow.explanation ?? null} />}
                  {activeTab === "simulate" && <SimulationPanel simulation={activeWorkflow.simulation ?? null} />}
                  {activeTab === "edit" && (
                    <ConversationalEdit
                      workflowId={activeWorkflow.id}
                      intent={activeWorkflow.intent}
                      nodes={activeWorkflow.nodes}
                      onWorkflowUpdated={handleWorkflowEdited}
                    />
                  )}
                  {activeTab === "suggest" && <SuggestionsPanel suggestions={activeWorkflow.suggestions ?? null} />}
                  {activeTab === "timeline" && <TimelinePanel logs={activeWorkflow.execution_logs ?? []} />}
                  {activeTab === "docs" && <DocumentationPanel documentation={activeWorkflow.documentation ?? null} workflowIntent={activeWorkflow.intent} />}
                  {activeTab === "history" && (
                    <VersionHistory
                      workflowId={activeWorkflow.id}
                      currentNodes={activeWorkflow.nodes}
                      currentIntent={activeWorkflow.intent}
                      onRestore={handleVersionRestore}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
                <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>[NO WORKFLOW SELECTED]</div>
                <Link href="/" style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>→ Deploy your first workflow</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
