"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Shield, Bell, BarChart, ThumbsUp, Zap, Lock } from "lucide-react";

interface Suggestion { title: string; description: string; category: string; priority: string; }
interface Props { suggestions: Suggestion[] | null; isLoading?: boolean; }

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  reliability: <Shield size={16} />,
  notifications: <Bell size={16} />,
  analytics: <BarChart size={16} />,
  approval: <ThumbsUp size={16} />,
  optimization: <Zap size={16} />,
  security: <Lock size={16} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  reliability: "#ffb86c",
  notifications: "#8be9fd",
  analytics: "#B2D5E5",
  approval: "#50fa7b",
  optimization: "#ff79c6",
  security: "#ff5555",
};

const PRIORITY_BADGES: Record<string, { bg: string; color: string }> = {
  high: { bg: "rgba(255,85,85,0.1)", color: "#ff5555" },
  medium: { bg: "rgba(255,184,108,0.1)", color: "#ffb86c" },
  low: { bg: "rgba(178,213,229,0.1)", color: "#B2D5E5" },
};

export function SuggestionsPanel({ suggestions, isLoading }: Props) {
  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <Lightbulb size={18} style={{ color: "var(--color-accent)" }} />
        <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>AI SUGGESTIONS</h3>
        {suggestions && <span style={{ fontSize: "var(--text-xs)", background: "rgba(178,213,229,0.1)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>{suggestions.length}</span>}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1,2,3,4].map(i => (
            <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i*0.2 }}
              style={{ height: "5rem", background: "rgba(178,213,229,0.05)", borderRadius: "var(--radius-md)" }} />
          ))}
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {suggestions.map((s, i) => {
            const color = CATEGORY_COLORS[s.category] || "var(--color-accent)";
            const icon = CATEGORY_ICONS[s.category] || <Lightbulb size={16} />;
            const badge = PRIORITY_BADGES[s.priority] || PRIORITY_BADGES.low;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ x: 4 }}
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.06)`, borderLeft: `3px solid ${color}`, borderRadius: "var(--radius-md)", padding: "1.25rem", display: "flex", gap: "1rem", cursor: "default", transition: "all 0.2s" }}>
                <div style={{ color, marginTop: "2px", flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "#fff" }}>{s.title}</div>
                    <span style={{ fontSize: "var(--text-xs)", background: badge.bg, color: badge.color, borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.priority}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{s.description}</p>
                  <div style={{ marginTop: "0.75rem", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.category}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
          [NO SUGGESTIONS AVAILABLE — DEPLOY A WORKFLOW FIRST]
        </div>
      )}
    </div>
  );
}
