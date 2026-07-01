"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("AutoFlow Boundary Error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050505",
        color: "#ff3333",
        fontFamily: "monospace",
        padding: "2rem"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          border: "1px solid #ff3333",
          background: "rgba(255, 51, 51, 0.05)",
          padding: "3rem",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 0 40px rgba(255, 51, 51, 0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,51,51,0.3)", paddingBottom: "1rem" }}>
          <AlertTriangle size={32} />
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>CRITICAL SYSTEM FAILURE</h2>
        </div>

        <div style={{ marginBottom: "2rem", color: "rgba(255,51,51,0.8)", fontSize: "0.9rem", lineHeight: 1.5 }}>
          <p>The AutoFlow orchestrator encountered an unhandled exception during rendering.</p>
          <div style={{ background: "rgba(0,0,0,0.5)", padding: "1rem", marginTop: "1rem", borderRadius: "4px", border: "1px solid rgba(255,51,51,0.2)" }}>
            <code>{error.message || "Unknown Runtime Error"}</code>
          </div>
        </div>

        <motion.button
          onClick={() => reset()}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 51, 51, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.8rem",
            width: "100%",
            background: "transparent",
            border: "1px solid #ff3333",
            color: "#ff3333",
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "monospace"
          }}
        >
          <RotateCcw size={18} />
          ATTEMPT AUTO-RECOVERY
        </motion.button>
      </motion.div>
    </div>
  );
}
