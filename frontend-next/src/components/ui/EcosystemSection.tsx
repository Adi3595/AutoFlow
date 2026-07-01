"use client";

import React from 'react';
import { motion } from 'framer-motion';

export function EcosystemSection() {
  const logos = ['GITHUB', 'SLACK', 'LINEAR', 'NOTION', 'FIGMA', 'AWS', 'HUBSPOT', 'JIRA', 'STRIPE', 'DATADOG'];

  return (
    <section id="integrations" aria-label="Integrations Ecosystem" style={{ 
      minHeight: '60vh', 
      background: '#020202', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden', 
      padding: '4rem 0',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <h2 style={{ 
        position: 'absolute', 
        zIndex: 10, 
        fontSize: 'clamp(4rem, 8vw, 10rem)', 
        fontWeight: 700, 
        textAlign: 'center', 
        pointerEvents: 'none', 
        color: 'var(--color-accent)',
        textShadow: '0 10px 40px rgba(2,2,2,0.9), 0 0 20px rgba(2,2,2,0.8)',
        fontFamily: 'Outfit, sans-serif',
        lineHeight: 0.9,
        letterSpacing: '-0.02em'
      }}>
        PLUG INTO<br/>EVERYTHING
      </h2>
      
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        zIndex: 1, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4rem', 
        justifyContent: 'center', 
        opacity: 0.15,
        padding: '0 2rem'
      }}>
        {logos.map((logo, idx) => {
          const y1 = (idx * 7 % 30) - 15;
          const y2 = (idx * 11 % 30) - 15;
          const y3 = (idx * 19 % 30) - 15;
          const x1 = (idx * 13 % 30) - 15;
          const x2 = (idx * 17 % 30) - 15;
          const x3 = (idx * 23 % 30) - 15;
          const size = 1.5 + (idx * 5 % 2.5);
          const isAccent = idx % 3 === 0;
          const duration = 4 + (idx % 4);

          return (
            <motion.div
              key={idx}
              animate={{ 
                y: [y1, y2, y3],
                x: [x1, x2, x3]
              }}
              transition={{ repeat: Infinity, duration: duration, ease: 'easeInOut' }}
              style={{
                fontSize: `${size}rem`,
                fontWeight: 700,
                color: isAccent ? 'var(--color-accent)' : '#fff',
                fontFamily: 'monospace'
              }}
            >
              {logo}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
