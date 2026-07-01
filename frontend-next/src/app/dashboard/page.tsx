"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import WorkflowCanvas from "@/components/ui/WorkflowCanvas";

export default function Dashboard() {
  const [nodes, setNodes] = useState<any[]>([]);
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
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <div style={{ padding: "2rem 3rem", borderBottom: "1px solid rgba(178, 213, 229, 0.1)" }}>
          <h2 style={{ fontSize: "2rem", margin: 0, fontWeight: 600 }}>Architecture Overview</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>
            The AI has compiled your intent into the following execution DAG.
          </p>
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
      </main>

    </div>
  );
}
