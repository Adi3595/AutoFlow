"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
      background: "var(--color-bg)"
    }}>
      {/* Orb 1: Core Blue/Cyan */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(178,213,229,0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
          borderRadius: "50%",
        }}
      />

      {/* Orb 2: Deep Indigo */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 50, -100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(93,124,196,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
          borderRadius: "50%",
        }}
      />

      {/* Orb 3: Subtle Purple/Pink */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 80, -80, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "60%",
          left: "10%",
          width: "45vw",
          height: "45vw",
          background: "radial-gradient(circle, rgba(144,98,206,0.08) 0%, transparent 60%)",
          filter: "blur(70px)",
          borderRadius: "50%",
        }}
      />

      {/* Mouse Follower Light */}
      <motion.div
        animate={{
          x: mousePosition.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0),
          y: mousePosition.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 0),
        }}
        transition={{ type: "spring", damping: 40, stiffness: 100, mass: 0.5 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "30vw",
          height: "30vw",
          marginLeft: "-15vw",
          marginTop: "-15vw",
          background: "radial-gradient(circle, rgba(178,213,229,0.08) 0%, transparent 50%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
