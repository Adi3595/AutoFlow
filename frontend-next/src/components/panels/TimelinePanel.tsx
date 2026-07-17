"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface Props { logs: string[]; isLoading?: boolean; }

type LogStatus = "success" | "error" | "heal" | "fatal" | "system" | "executing" | "info";

function parseLog(log: string): { status: LogStatus; content: string } {
  if (log.includes("[SUCCESS]")) return { status: "success", content: log.replace(/.*\[SUCCESS\] /, "") };
  if (log.includes("[HEALED]")) return { status: "heal", content: log.replace(/.*\[HEALED\] /, "") };
  if (log.includes("[ERROR]")) return { status: "error", content: log.replace(/.*\[ERROR\] /, "") };
  if (log.includes("[FATAL]")) return { status: "fatal", content: log.replace(/.*\[FATAL\] /, "") };
  if (log.includes("[EXECUTING]")) return { status: "executing", content: log.replace(/.*\[EXECUTING\] /, "") };
  if (log.includes("[SYSTEM]")) return { status: "system", content: log.replace(/.*\[SYSTEM\] /, "") };
  return { status: "info", content: log };
}

const STATUS_CONFIG: Record<LogStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  success:   { icon: <CheckCircle size={14} />, color: "#50fa7b", bg: "rgba(80,250,123,0.05)" },
  heal:      { icon: <RefreshCw size={14} />, color: "#ffb86c", bg: "rgba(255,184,108,0.05)" },
  error:     { icon: <AlertTriangle size={14} />, color: "#ff5555", bg: "rgba(255,85,85,0.05)" },
  fatal:     { icon: <XCircle size={14} />, color: "#ff5555", bg: "rgba(255,85,85,0.08)" },
  executing: { icon: <Loader2 size={14} />, color: "var(--color-accent)", bg: "rgba(178,213,229,0.04)" },
  system:    { icon: <Clock size={14} />, color: "rgba(255,255,255,0.4)", bg: "transparent" },
  info:      { icon: <Clock size={14} />, color: "rgba(255,255,255,0.3)", bg: "transparent" },
};

export function TimelinePanel({ logs, isLoading }: Props) {
  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <Clock size={18} style={{ color: "var(--color-accent)" }} />
        <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>EXECUTION TIMELINE</h3>
        {logs.length > 0 && <span style={{ fontSize: "var(--text-xs)", background: "rgba(178,213,229,0.1)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>{logs.length} events</span>}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[1,2,3,4,5].map(i => (
            <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i*0.1 }}
              style={{ height: "2.5rem", background: "rgba(178,213,229,0.04)", borderRadius: "var(--radius-sm)" }} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
          [NO EXECUTION LOGS — DEPLOY A WORKFLOW FIRST]
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", position: "relative" }}>
          {/* Vertical timeline line */}
          <div style={{ position: "absolute", left: "13px", top: "14px", bottom: "14px", width: "1px", background: "rgba(178,213,229,0.1)", zIndex: 0 }} />

          {logs.map((log, i) => {
            const { status, content } = parseLog(log);
            const cfg = STATUS_CONFIG[status];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.6) }}
                style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.5rem", borderRadius: "var(--radius-sm)", background: cfg.bg, position: "relative", zIndex: 1 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#020202", border: `1px solid ${cfg.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0, marginTop: "0px" }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, paddingTop: "0.35rem" }}>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: status === "system" || status === "info" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)", lineHeight: 1.5, fontFamily: status === "system" ? "var(--font-mono)" : "var(--font-body)" }}>
                    {content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
