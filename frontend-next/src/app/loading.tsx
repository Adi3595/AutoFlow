"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%", maxWidth: "800px", padding: "2rem" }}>
        
        {/* Header Skeleton */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "40%", height: "4rem", backgroundColor: "rgba(178, 213, 229, 0.1)", borderRadius: "8px" }}
        />
        
        {/* Body Skeletons */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          style={{ width: "80%", height: "2rem", backgroundColor: "rgba(178, 213, 229, 0.1)", borderRadius: "4px" }}
        />
        
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          style={{ width: "60%", height: "2rem", backgroundColor: "rgba(178, 213, 229, 0.1)", borderRadius: "4px" }}
        />

        {/* Action Button Skeleton */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ width: "200px", height: "3.5rem", backgroundColor: "rgba(178, 213, 229, 0.15)", borderRadius: "50px", marginTop: "2rem" }}
        />
        
      </div>
      
      {/* Absolute Loading Text */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "2rem", right: "2rem", fontFamily: "monospace", color: "var(--color-accent)", fontSize: "0.9rem" }}
      >
        [SYSTEM] INITIATING MODULES...
      </motion.div>
    </div>
  );
}
