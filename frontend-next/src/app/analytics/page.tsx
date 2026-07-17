"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BarChart2, TrendingUp, CheckCircle, XCircle, Clock, Zap, Layers } from "lucide-react";

interface SavedWorkflow {
  id: string; intent: string; createdAt: string;
  nodes: any[]; agents: any[]; execution_logs?: string[];
}

interface Analytics {
  totalWorkflows: number;
  totalAgents: number;
  totalNodes: number;
  successRate: number;
  failedWorkflows: number;
  avgNodes: number;
  topTools: { tool: string; count: number }[];
  dailyActivity: { date: string; count: number }[];
  recentWorkflows: { intent: string; date: string; nodes: number }[];
}

function computeAnalytics(workflows: SavedWorkflow[]): Analytics {
  const total = workflows.length;
  if (total === 0) return { totalWorkflows: 0, totalAgents: 0, totalNodes: 0, successRate: 0, failedWorkflows: 0, avgNodes: 0, topTools: [], dailyActivity: [], recentWorkflows: [] };

  const totalNodes = workflows.reduce((s, w) => s + (w.nodes?.length ?? 0), 0);
  const totalAgents = workflows.reduce((s, w) => s + (w.agents?.length ?? 0), 0);
  const failed = workflows.filter(w => (w.execution_logs || []).some(l => l.includes("[FATAL]"))).length;
  const successRate = total > 0 ? Math.round(((total - failed) / total) * 100) : 0;

  // Tool frequency
  const toolCount: Record<string, number> = {};
  workflows.forEach(w => w.nodes?.forEach((n: any) => {
    const tool = n.metadata?.tool;
    if (tool) toolCount[tool] = (toolCount[tool] || 0) + 1;
  }));
  const topTools = Object.entries(toolCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tool, count]) => ({ tool, count }));

  // Daily activity (last 7 days)
  const now = new Date();
  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: workflows.filter(w => w.createdAt?.slice(0, 10) === dateStr).length };
  });

  const recentWorkflows = workflows.slice(0, 5).map(w => ({ intent: w.intent, date: new Date(w.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), nodes: w.nodes?.length ?? 0 }));

  return { totalWorkflows: total, totalAgents, totalNodes, successRate, failedWorkflows: failed, avgNodes: Math.round(totalNodes / total), topTools, dailyActivity, recentWorkflows };
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent ? "rgba(178,213,229,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "0.75rem" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: "var(--text-4xl)", fontWeight: 700, fontFamily: "var(--font-mono)", color: accent ? "var(--color-accent)" : "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", marginTop: "0.4rem" }}>{sub}</div>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const workflows: SavedWorkflow[] = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
    setAnalytics(computeAnalytics(workflows));
  }, []);

  const maxDay = analytics ? Math.max(...analytics.dailyActivity.map(d => d.count), 1) : 1;

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--color-text)" }}>
      {/* Header */}
      <header style={{ padding: "1.25rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <BarChart2 size={18} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>Analytics
          </h1>
        </div>
        <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
          <motion.button whileHover={{ x: -3 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
            <ArrowLeft size={14} /> DASHBOARD
          </motion.button>
        </Link>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}>
        {!analytics ? (
          <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}>Loading analytics...</div>
        ) : analytics.totalWorkflows === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem" }}>📊</div>
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-base)" }}>No data yet. Deploy a workflow to see analytics.</p>
            <Link href="/" style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", marginTop: "1rem", display: "inline-block" }}>→ Go deploy</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <StatCard icon={<Layers size={14}/>} label="Total Workflows" value={analytics.totalWorkflows} accent />
              <StatCard icon={<CheckCircle size={14}/>} label="Success Rate" value={`${analytics.successRate}%`} sub={`${analytics.failedWorkflows} failed`} accent />
              <StatCard icon={<Zap size={14}/>} label="AI Agents Created" value={analytics.totalAgents} />
              <StatCard icon={<TrendingUp size={14}/>} label="Total Nodes Built" value={analytics.totalNodes} sub={`avg ${analytics.avgNodes}/workflow`} />
              <StatCard icon={<XCircle size={14}/>} label="Failed Workflows" value={analytics.failedWorkflows} sub="with self-healing attempts" />
              <StatCard icon={<Clock size={14}/>} label="Avg. Complexity" value={analytics.avgNodes} sub="nodes per workflow" />
            </div>

            {/* Daily activity bar chart */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
              <h2 style={{ margin: "0 0 1.5rem", fontSize: "var(--text-base)", fontFamily: "var(--font-mono)", color: "var(--color-accent)", letterSpacing: "0.05em" }}>DAILY EXECUTION TREND (LAST 7 DAYS)</h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "120px" }}>
                {analytics.dailyActivity.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((d.count / maxDay) * 90, 4)}px` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                      style={{ width: "100%", background: d.count > 0 ? "var(--color-accent)" : "rgba(178,213,229,0.1)", borderRadius: "4px 4px 0 0" }} />
                    <span style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)" }}>{d.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Top tools */}
              {analytics.topTools.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                  <h2 style={{ margin: "0 0 1rem", fontSize: "var(--text-base)", fontFamily: "var(--font-mono)", color: "var(--color-accent)", letterSpacing: "0.05em" }}>TOP INTEGRATIONS</h2>
                  {analytics.topTools.map((t, i) => (
                    <div key={t.tool} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)", width: "16px" }}>{i+1}</span>
                      <span style={{ flex: 1, fontSize: "var(--text-sm)", color: "#fff" }}>{t.tool}</span>
                      <div style={{ height: "4px", width: `${(t.count / analytics.topTools[0].count) * 80}px`, background: "var(--color-accent)", borderRadius: "2px" }} />
                      <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", width: "20px", textAlign: "right" }}>{t.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent workflows */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                <h2 style={{ margin: "0 0 1rem", fontSize: "var(--text-base)", fontFamily: "var(--font-mono)", color: "var(--color-accent)", letterSpacing: "0.05em" }}>RECENT WORKFLOWS</h2>
                {analytics.recentWorkflows.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.6rem 0", borderBottom: i < analytics.recentWorkflows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-sm)", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.intent}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-faint)", marginTop: "0.2rem" }}>{w.date} · {w.nodes} nodes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
