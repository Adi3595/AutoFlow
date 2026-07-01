"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import WorkflowCanvas from "@/components/ui/WorkflowCanvas";

export default function Dashboard() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load deployed nodes from localStorage
    const savedNodes = localStorage.getItem("autoflow_deployed_nodes");
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        console.error("Failed to parse nodes from local storage");
      }
    }
    
    // Load memory engine history
    const savedHistory = localStorage.getItem("autoflow_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
    
    setIsLoaded(true);
  }, []);

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
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/agents" passHref style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ y: -2 }}
              style={{
                background: "transparent",
                border: "1px solid var(--color-accent)",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                color: "var(--color-accent)",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.9rem"
              }}
            >
              [⚡] AGENT FLEET
            </motion.button>
          </Link>

          <Link href="/integrations" passHref style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ y: -2 }}
              style={{
                background: "var(--color-accent)",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                color: "#000",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.9rem"
              }}
            >
              [+] INTEGRATIONS
            </motion.button>
          </Link>

          <Link href="/" passHref style={{ textDecoration: "none" }}>
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
              <ArrowLeft size={16} /> RETURN TO PROMPT
            </motion.button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <div style={{ padding: "2rem 3rem", borderBottom: "1px solid rgba(178, 213, 229, 0.1)" }}>
          <h2 style={{ fontSize: "2rem", margin: 0, fontWeight: 600 }}>Architecture Overview</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>
            The AI has compiled your intent into the following execution DAG.
          </p>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar for Memory Engine */}
          <div style={{ width: "300px", borderRight: "1px solid rgba(178, 213, 229, 0.1)", background: "rgba(0,0,0,0.2)", padding: "2rem", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "var(--color-accent)", fontFamily: "monospace" }}>[MEMORY ENGINE]</h3>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>Past workflow intents</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {history.length > 0 ? history.map((item, i) => (
                <div key={i} style={{ padding: "1rem", background: "rgba(178, 213, 229, 0.05)", borderRadius: "4px", fontSize: "0.85rem", borderLeft: "2px solid var(--color-accent)" }}>
                  "{item}"
                </div>
              )) : (
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No history recorded.</div>
              )}
            </div>
          </div>

          {/* Workflow Canvas Area */}
          <div style={{ flex: 1, position: "relative" }}>
            {isLoaded ? (
              nodes.length > 0 ? (
                <WorkflowCanvas workflowData={nodes} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                  [NO ACTIVE WORKFLOW DETECTED IN STATE]
                </div>
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-accent)", fontFamily: "monospace" }}>
                [LOADING VISUALIZER...]
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
