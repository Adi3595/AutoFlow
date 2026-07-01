"use client";

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  "01 — MULTI-AGENT COLLABORATION",
  "02 — PREDICTIVE EXECUTION",
  "03 — SELF-HEALING LOGIC",
  "04 — REAL-TIME TELEMETRY"
];

export function FeaturesSection() {
  return (
    <section id="features-section" aria-label="Key Features" style={{ padding: '8rem 0', background: 'var(--color-bg)', overflow: 'hidden' }}>
      <div style={{ borderTop: '1px solid var(--color-accent)', borderBottom: '1px solid var(--color-accent)', padding: '2rem 0' }}>
        {features.map((feature, idx) => (
          <div key={idx} style={{ position: 'relative', whiteSpace: 'nowrap', padding: '1rem 0' }}>
            <motion.div
              animate={{ x: idx % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              style={{ 
                display: 'flex', 
                gap: '4rem', 
                fontSize: 'clamp(3rem, 6vw, 6rem)', 
                fontWeight: 700, 
                fontFamily: 'Ancola, Outfit, sans-serif', 
                color: idx % 2 === 0 ? 'transparent' : '#fff', 
                WebkitTextStroke: idx % 2 === 0 ? '1px #fff' : 'none' 
              }}
            >
              <span>{feature} &bull; {feature} &bull; {feature} &bull; {feature}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
