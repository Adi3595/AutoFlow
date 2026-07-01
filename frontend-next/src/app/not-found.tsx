"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-primary), sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          textAlign: "center"
        }}
      >
        <Terminal size={64} style={{ color: "var(--color-accent)" }} />
        
        <h1 style={{ fontSize: "6rem", margin: 0, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.1)" }}>
          404
        </h1>
        
        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          NODE NOT FOUND
        </div>
        
        <p style={{ maxWidth: "400px", color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6 }}>
          The orchestration engine could not locate the requested path in the current DAG architecture.
        </p>
        
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: "1rem",
              background: "transparent",
              border: "1px solid var(--color-accent)",
              color: "var(--color-accent)",
              padding: "1rem 2rem",
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "50px",
              cursor: "pointer",
              fontFamily: "monospace"
            }}
          >
            RETURN TO ROOT()
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
