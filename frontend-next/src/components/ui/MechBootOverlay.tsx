"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MechBootOverlay() {
  const [booted, setBooted] = useState(false);
  const [textStage, setTextStage] = useState(0);

  useEffect(() => {
    // Sequence text
    const t1 = setTimeout(() => setTextStage(1), 150);
    const t2 = setTimeout(() => setTextStage(2), 300);
    const t3 = setTimeout(() => setTextStage(3), 450);
    
    // Trigger open
    const t4 = setTimeout(() => setBooted(true), 600);
    
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
          transition={{ duration: 0.1, delay: 0.4 }} // Wait for doors to open before unmounting
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
          
          {/* Full Locking Mechanism */}
          <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
          }}>
             {/* Left Lock Bar */}
             <motion.div
                initial={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                style={{
                   width: '100px',
                   height: '16px',
                   background: '#050a0f',
                   border: '1px solid var(--color-accent)',
                   borderRight: 'none',
                   marginRight: '-10px',
                   zIndex: 1
                }}
             />
             
             {/* Central Rotating Hub */}
             <motion.div
               initial={{ rotate: 0, scale: 1, opacity: 1 }}
               exit={{ rotate: 180, scale: 1.5, opacity: 0 }}
               transition={{ duration: 0.4 }}
               style={{
                 width: '70px',
                 height: '70px',
                 borderRadius: '50%',
                 background: '#050a0f',
                 border: '2px dashed var(--color-accent)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 zIndex: 2,
                 boxShadow: '0 0 30px rgba(178,213,229,0.3)',
                 padding: '5px'
               }}
             >
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 style={{ 
                   width: '100%', 
                   height: '100%', 
                   borderRadius: '50%', 
                   border: '4px solid var(--color-accent)',
                   borderTopColor: 'transparent',
                   borderBottomColor: 'transparent'
                 }} 
               />
             </motion.div>

             {/* Right Lock Bar */}
             <motion.div
                initial={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                style={{
                   width: '100px',
                   height: '16px',
                   background: '#050a0f',
                   border: '1px solid var(--color-accent)',
                   borderLeft: 'none',
                   marginLeft: '-10px',
                   zIndex: 1
                }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
