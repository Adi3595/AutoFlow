"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MechBootOverlay() {
  const [booted, setBooted] = useState(false);
  const [textStage, setTextStage] = useState(0);

  useEffect(() => {
    // Sequence text
    const t1 = setTimeout(() => setTextStage(1), 400);
    const t2 = setTimeout(() => setTextStage(2), 800);
    const t3 = setTimeout(() => setTextStage(3), 1200);
    
    // Trigger open
    const t4 = setTimeout(() => setBooted(true), 2000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          key="mech-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, delay: 0.8 }} // Wait for doors to open before unmounting
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 99999,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Blast Door */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.1 }}
            style={{
              flex: 1,
              background: "#050a0f", // Dark metallic
              borderBottom: "2px solid var(--color-accent)",
              display: "flex",
              alignItems: "flex-end",
              padding: "2rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", fontSize: "0.85rem", opacity: 0.8 }}>
              {textStage >= 0 && <div>&gt; INITIALIZING CORE SYSTEMS... [OK]</div>}
              {textStage >= 1 && <div>&gt; ESTABLISHING AGENT NETWORK... [OK]</div>}
            </div>
          </motion.div>

          {/* Bottom Blast Door */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.1 }}
            style={{
              flex: 1,
              background: "#050a0f",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "2rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", color: "#fff", fontSize: "0.85rem", opacity: 0.8 }}>
              {textStage >= 2 && <div>&gt; BOOTING AUTOFLOW OS v2.0...</div>}
              {textStage >= 3 && <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>_</motion.div>}
            </div>
          </motion.div>
          
          {/* Central Locking Mechanism */}
          <motion.div
            initial={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120px",
              height: "40px",
              background: "var(--color-accent)",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              borderRadius: "4px",
              boxShadow: "0 0 20px rgba(178,213,229,0.4)"
            }}
          >
            LOCKED
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
