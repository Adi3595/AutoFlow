"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, CheckCircle, AlertCircle, Clock, Zap, RefreshCw, BarChart2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status?: string;
  current_task?: string;
}

interface AgentRuntimeState {
  status: "idle" | "running" | "success" | "error" | "healing";
  currentTask: string;
  progress: number; // 0-100
  log: string[];
  lastActive: string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode; pulse: boolean }> = {
  idle:    { color: "#888", label: "IDLE", icon: <Clock size={12}/>, pulse: false },
  running: { color: "#B2D5E5", label: "RUNNING", icon: <Activity size={12}/>, pulse: true },
  success: { color: "#50fa7b", label: "SUCCESS", icon: <CheckCircle size={12}/>, pulse: false },
  error:   { color: "#ff5555", label: "ERROR", icon: <AlertCircle size={12}/>, pulse: true },
  healing: { color: "#ffb86c", label: "HEALING", icon: <RefreshCw size={12}/>, pulse: true },
};

const ROLE_ICONS: Record<string, string> = {
  "Data Extraction": "🔍",
  "Decision & Approval": "⚖️",
  "Orchestration": "🎯",
  "Execution": "⚡",
  "Memory": "🧠",
  "Scheduling": "📅",
  "Classification": "🏷️",
  "Communication": "📡",
  "Creative Writing": "✍️",
  "Publishing": "📤",
  "Audio Processing": "🎙️",
  "Sales Operations": "📈",
  "Finance Automation": "💰",
  "Approval Logic": "✅",
};

function generateActivityLog(agentName: string, taskCount: number): string[] {
  const actions = [
    `Initialized ${agentName.split(" ")[0]} engine`,
    `Connected to upstream APIs`,
    `Processing batch ${taskCount} of ${taskCount + 2}`,
    `Token usage: ${Math.floor(Math.random() * 800 + 200)} tokens`,
    `Confidence score: ${(Math.random() * 0.2 + 0.8).toFixed(2)}`,
    `Output validated and passed downstream`,
  ];
  return actions.slice(0, 4);
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [runtime, setRuntime] = useState<AgentRuntimeState>({
    status: "idle",
    currentTask: "Awaiting workflow trigger",
    progress: 0,
    log: [],
    lastActive: new Date().toISOString(),
  });
  const [expanded, setExpanded] = useState(false);
  const intervalRef = useRef<any>(null);

  // Simulate live agent activity
  useEffect(() => {
    const startDelay = (index % 3) * 2000 + Math.random() * 3000;
    const startTimeout = setTimeout(() => {
      const cycle = () => {
        const taskCount = Math.floor(Math.random() * 10 + 1);
        setRuntime(prev => ({ ...prev, status: "running", currentTask: `Executing node task #${taskCount}`, progress: 0, log: generateActivityLog(agent.name, taskCount), lastActive: new Date().toISOString() }));
        let p = 0;
        const progInterval = setInterval(() => {
          p += Math.random() * 15 + 5;
          if (p >= 100) {
            p = 100;
            clearInterval(progInterval);
            const succeeded = Math.random() > 0.15;
            setRuntime(prev => ({
              ...prev, status: succeeded ? "success" : "error",
              currentTask: succeeded ? "Task completed successfully" : "Error: API timeout — initiating self-heal",
              progress: 100
            }));
            if (!succeeded) {
              setTimeout(() => {
                setRuntime(prev => ({ ...prev, status: "healing", currentTask: "Retrying with fallback method..." }));
                setTimeout(() => {
                  setRuntime(prev => ({ ...prev, status: "success", currentTask: "Self-healed and completed", progress: 100 }));
                  setTimeout(() => { setRuntime(prev => ({ ...prev, status: "idle", currentTask: "Awaiting next workflow trigger", progress: 0 })); cycle(); }, 3000);
                }, 2000);
              }, 1500);
            } else {
              setTimeout(() => { setRuntime(prev => ({ ...prev, status: "idle", currentTask: "Awaiting next workflow trigger", progress: 0 })); cycle(); }, 4000);
            }
          } else {
            setRuntime(prev => ({ ...prev, progress: Math.round(p) }));
          }
        }, 150);
      };
      cycle();
    }, startDelay);
    return () => { clearTimeout(startTimeout); clearInterval(intervalRef.current); };
  }, []);

  const cfg = STATUS_CONFIG[runtime.status];
  const roleIcon = ROLE_ICONS[agent.role] || "🤖";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${runtime.status !== "idle" ? `${cfg.color}30` : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-lg)", overflow: "hidden", transition: "border-color 0.3s" }}>
      
      {/* Card Header */}
      <div style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
        {/* Avatar */}
        <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
          {roleIcon}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{agent.name}</h3>
            {/* Status badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, borderRadius: "var(--radius-pill)", padding: "0.2rem 0.6rem", flexShrink: 0 }}>
              {cfg.pulse ? (
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
              ) : (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
              )}
              <span style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: cfg.color, letterSpacing: "0.08em" }}>{cfg.label}</span>
            </div>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontFamily: "var(--font-mono)", marginBottom: "0.4rem" }}>{agent.role}</div>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{agent.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      {(runtime.status === "running" || runtime.status === "healing") && (
        <div style={{ margin: "0 1.25rem 0.75rem", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
          <motion.div animate={{ width: `${runtime.progress}%` }} style={{ height: "100%", background: cfg.color, borderRadius: "2px" }} />
        </div>
      )}

      {/* Current task */}
      <div style={{ margin: "0 1.25rem 1rem", padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: cfg.color, flexShrink: 0 }}>{cfg.icon}</span>
        <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{runtime.currentTask}</span>
      </div>

      {/* Expanded log */}
      <AnimatePresence>
        {expanded && runtime.log.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ padding: "0.75rem 1.25rem" }}>
              <div style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>ACTIVITY LOG</div>
              {runtime.log.map((entry, i) => (
                <div key={i} style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", padding: "0.15rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>›</span> {entry}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [totalWorkflows, setTotalWorkflows] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const rawAgents: Agent[] = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
    const unique = rawAgents.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
    setAgents(unique);
    setTotalWorkflows(JSON.parse(localStorage.getItem("autoflow_workflows") || "[]").length);
    setIsLoaded(true);
  }, []);

  const running = agents.length; // all are simulated as active

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* Header */}
      <header style={{ padding: "1.25rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Cpu size={18} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>AgentOS
          </h1>
          {agents.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 7, height: 7, borderRadius: "50%", background: "#50fa7b" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "#50fa7b", fontFamily: "var(--font-mono)" }}>{agents.length} AGENTS ACTIVE</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/analytics" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ y: -1 }} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "transparent", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-sm)", padding: "0.4rem 0.8rem", color: "var(--color-accent)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
              <BarChart2 size={12}/> ANALYTICS
            </motion.button>
          </Link>
          <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ x: -3 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
              <ArrowLeft size={14} /> DASHBOARD
            </motion.button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Agents", value: agents.length, icon: <Cpu size={14}/>, accent: true },
            { label: "Active Now", value: agents.length, icon: <Activity size={14}/> },
            { label: "Workflows Served", value: totalWorkflows, icon: <Zap size={14}/> },
            { label: "Self-Heals", value: Math.floor(agents.length * 0.3), icon: <RefreshCw size={14}/> },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${s.accent ? "rgba(178,213,229,0.2)" : "rgba(255,255,255,0.05)"}`, borderRadius: "var(--radius-lg)", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", marginBottom: "0.5rem" }}>{s.icon} {s.label}</div>
              <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, fontFamily: "var(--font-mono)", color: s.accent ? "var(--color-accent)" : "#fff" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {!isLoaded ? (
          <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>Scanning agent fleet...</div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem" }}>🤖</div>
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-base)" }}>No agents deployed yet.</p>
            <Link href="/" style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", marginTop: "1rem", display: "inline-block" }}>→ Deploy a workflow to spawn agents</Link>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>LIVE AGENT MONITOR — {agents.length} AGENTS · CLICK CARD TO EXPAND LOG</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {agents.map((agent, i) => <AgentCard key={agent.id || i} agent={agent} index={i} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
