"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal, CheckCircle2, Loader2, Link2 } from "lucide-react";

const APPS = [
  { id: "slack", name: "Slack", description: "Send messages and read channel data", color: "#E01E5A" },
  { id: "notion", name: "Notion", description: "Read and write to databases", color: "#fff" },
  { id: "gmail", name: "Gmail", description: "Parse incoming emails and send replies", color: "#EA4335" },
  { id: "github", name: "GitHub", description: "Manage issues and pull requests", color: "#2ea043" },
  { id: "jira", name: "Jira", description: "Create and update agile tickets", color: "#0052CC" },
  { id: "salesforce", name: "Salesforce", description: "Sync CRM records and leads", color: "#00A1E0" },
];

export default function IntegrationsPage() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const handleConnect = (id: string) => {
    setConnecting(id);
    // Simulate OAuth flow
    setTimeout(() => {
      setConnecting(null);
      setConnected(prev => ({ ...prev, [id]: true }));
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setConnected(prev => ({ ...prev, [id]: false }));
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
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>Integrations
          </h1>
        </div>

        <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ x: -5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: "0.9rem"
            }}
          >
            <ArrowLeft size={16} /> RETURN TO DASHBOARD
          </motion.button>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ padding: "4rem 3rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 600 }}>Connected Apps</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
            Authenticate with third-party services to grant the AI execution permissions.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1.5rem"
        }}>
          {APPS.map((app) => (
            <motion.div 
              key={app.id}
              whileHover={{ y: -5 }}
              style={{
                background: "rgba(178, 213, 229, 0.03)",
                border: "1px solid rgba(178, 213, 229, 0.1)",
                borderRadius: "12px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Highlight bar */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: app.color }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 600 }}>{app.name}</h3>
                  <p style={{ margin: "0.5rem 0 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                    {app.description}
                  </p>
                </div>
                
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "8px", 
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: app.color
                }}>
                  <Link2 size={20} />
                </div>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                {connected[app.id] ? (
                  <button 
                    onClick={() => handleDisconnect(app.id)}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      background: "rgba(0, 255, 0, 0.1)",
                      border: "1px solid rgba(0, 255, 0, 0.3)",
                      borderRadius: "6px",
                      color: "#0f0",
                      fontFamily: "monospace",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <CheckCircle2 size={16} /> CONNECTED
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect(app.id)}
                    disabled={connecting === app.id}
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      background: connecting === app.id ? "rgba(255,255,255,0.05)" : "var(--color-accent)",
                      border: "none",
                      borderRadius: "6px",
                      color: connecting === app.id ? "#fff" : "#000",
                      fontWeight: 600,
                      cursor: connecting === app.id ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s"
                    }}
                  >
                    {connecting === app.id ? (
                      <><Loader2 size={16} className="animate-spin" /> AUTHENTICATING...</>
                    ) : (
                      "CONNECT"
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
