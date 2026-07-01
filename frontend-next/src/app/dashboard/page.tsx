"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal, Clock, Trash2, Edit3, ChevronRight } from "lucide-react";
import WorkflowCanvas from "@/components/ui/WorkflowCanvas";

interface SavedWorkflow {
  id: string;
  intent: string;
  createdAt: string;
  nodes: any[];
  agents: any[];
}

export default function Dashboard() {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<SavedWorkflow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingIntent, setEditingIntent] = useState(false);
  const [editedIntent, setEditedIntent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("autoflow_workflows");
    if (saved) {
      try {
        const parsed: SavedWorkflow[] = JSON.parse(saved);
        setSavedWorkflows(parsed);
        if (parsed.length > 0) setActiveWorkflow(parsed[0]);
      } catch (e) {
        console.error("Failed to parse workflows from local storage");
      }
    }
    setIsLoaded(true);
  }, []);

  const deleteWorkflow = (id: string) => {
    const updated = savedWorkflows.filter(w => w.id !== id);
    setSavedWorkflows(updated);
    localStorage.setItem("autoflow_workflows", JSON.stringify(updated));
    if (activeWorkflow?.id === id) {
      setActiveWorkflow(updated.length > 0 ? updated[0] : null);
    }
  };

  const saveIntentEdit = () => {
    if (!activeWorkflow) return;
    const updated = savedWorkflows.map(w =>
      w.id === activeWorkflow.id ? { ...w, intent: editedIntent } : w
    );
    setSavedWorkflows(updated);
    setActiveWorkflow({ ...activeWorkflow, intent: editedIntent });
    localStorage.setItem("autoflow_workflows", JSON.stringify(updated));
    setEditingIntent(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--color-bg)",
      color: "var(--color-text)",
    }}>

      {/* Top Navbar */}
      <header style={{
        padding: "1.5rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(178, 213, 229, 0.1)",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Terminal style={{ color: "var(--color-accent)" }} />
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>Dashboard
          </h1>
          {savedWorkflows.length > 0 && (
            <span style={{ fontSize: "0.8rem", background: "rgba(178,213,229,0.1)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "50px", padding: "0.2rem 0.8rem", color: "var(--color-accent)", fontFamily: "monospace" }}>
              {savedWorkflows.length} workflow{savedWorkflows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/agents" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ y: -2 }} style={{ background: "transparent", border: "1px solid var(--color-accent)", borderRadius: "4px", padding: "0.5rem 1rem", color: "var(--color-accent)", fontWeight: 600, cursor: "pointer", fontFamily: "monospace", fontSize: "0.9rem" }}>
              [⚡] AGENT FLEET
            </motion.button>
          </Link>
          <Link href="/integrations" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ y: -2 }} style={{ background: "var(--color-accent)", border: "none", borderRadius: "4px", padding: "0.5rem 1rem", color: "#000", fontWeight: 600, cursor: "pointer", fontFamily: "monospace", fontSize: "0.9rem" }}>
              [+] INTEGRATIONS
            </motion.button>
          </Link>
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ x: -5 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "monospace", fontSize: "0.9rem" }}>
              <ArrowLeft size={16} /> NEW WORKFLOW
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden", height: "calc(100vh - 73px)" }}>

        {/* LEFT: Saved Workflows Sidebar */}
        <div style={{ width: "320px", borderRight: "1px solid rgba(178, 213, 229, 0.1)", background: "rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid rgba(178,213,229,0.08)" }}>
            <h3 style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-accent)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              [MY WORKFLOWS]
            </h3>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
              Click any workflow to load & edit
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
            {!isLoaded ? (
              <div style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontFamily: "monospace", padding: "1rem 0" }}>Loading...</div>
            ) : savedWorkflows.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic", padding: "1rem 0" }}>
                No saved workflows yet.<br />Deploy one from the homepage!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {savedWorkflows.map(wf => (
                  <motion.div
                    key={wf.id}
                    whileHover={{ x: 3 }}
                    onClick={() => { setActiveWorkflow(wf); setEditingIntent(false); }}
                    style={{
                      padding: "1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: activeWorkflow?.id === wf.id ? "rgba(178, 213, 229, 0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${activeWorkflow?.id === wf.id ? "rgba(178, 213, 229, 0.3)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <p style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: activeWorkflow?.id === wf.id ? "#fff" : "rgba(255,255,255,0.7)",
                        lineHeight: 1.4,
                        flex: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {wf.intent}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.id); }}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,80,80,0.5)", padding: "0", flexShrink: 0 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.6rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                      <Clock size={11} />
                      {formatDate(wf.createdAt)}
                      <span style={{ marginLeft: "auto", color: "rgba(178,213,229,0.5)" }}>
                        {wf.nodes.length} nodes · {wf.agents.length} agents
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Canvas + Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Intent bar */}
          <AnimatePresence mode="wait">
            {activeWorkflow && (
              <motion.div
                key={activeWorkflow.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(178,213,229,0.08)", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0,0,0,0.2)" }}
              >
                <ChevronRight size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                {editingIntent ? (
                  <>
                    <input
                      autoFocus
                      value={editedIntent}
                      onChange={e => setEditedIntent(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveIntentEdit()}
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid var(--color-accent)", color: "#fff", fontFamily: "monospace", fontSize: "0.9rem", outline: "none", padding: "0.2rem 0" }}
                    />
                    <button onClick={saveIntentEdit} style={{ background: "var(--color-accent)", color: "#000", border: "none", borderRadius: "4px", padding: "0.3rem 0.8rem", cursor: "pointer", fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600 }}>SAVE</button>
                    <button onClick={() => setEditingIntent(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "0.3rem 0.8rem", cursor: "pointer", fontFamily: "monospace", fontSize: "0.8rem" }}>CANCEL</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {activeWorkflow.intent}
                    </span>
                    <button
                      onClick={() => { setEditedIntent(activeWorkflow.intent); setEditingIntent(true); }}
                      style={{ background: "transparent", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "4px", padding: "0.3rem 0.8rem", cursor: "pointer", color: "var(--color-accent)", fontFamily: "monospace", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <Edit3 size={12} /> EDIT INTENT
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas */}
          <div style={{ flex: 1, position: "relative" }}>
            {!isLoaded ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-accent)", fontFamily: "monospace" }}>
                [LOADING VISUALIZER...]
              </div>
            ) : activeWorkflow ? (
              <WorkflowCanvas key={activeWorkflow.id} workflowData={activeWorkflow.nodes} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem" }}>
                <div style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace", fontSize: "1rem" }}>[NO WORKFLOW SELECTED]</div>
                <Link href="/" style={{ color: "var(--color-accent)", fontFamily: "monospace", fontSize: "0.9rem" }}>
                  → Deploy your first workflow
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
