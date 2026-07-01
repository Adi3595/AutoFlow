"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FooterSection() {
  return (
    <footer style={{ 
      background: '#020202',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      position: 'relative'
    }}>
      
      {/* THE ENTIRE SECTION IS A GIANT CTA */}
      <motion.a 
        href="#"
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{ 
          height: '70vh', 
          minHeight: '400px',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          textDecoration: 'none',
          cursor: 'pointer',
          borderTop: '1px solid var(--color-accent)'
        }}
      >
        {/* Background color expansion effect */}
        <motion.div 
          variants={{
            rest: { height: '0%' },
            hover: { height: '100%' }
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'var(--color-accent)',
            zIndex: 0
          }}
        />

        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <motion.div
            variants={{
              rest: { opacity: 1, y: 0 },
              hover: { opacity: 0, y: -20 }
            }}
            transition={{ duration: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '2rem', textTransform: 'uppercase' }}
          >
            System standing by
          </motion.div>

          <motion.h2 
            variants={{
              rest: { color: '#ffffff' },
              hover: { color: '#020202' }
            }}
            style={{ 
              fontSize: 'clamp(4rem, 10vw, 12rem)', 
              fontWeight: 700, 
              fontFamily: 'Ancola, Outfit, sans-serif',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            DEPLOY
            <motion.div
              variants={{
                rest: { x: 0, opacity: 0.5 },
                hover: { x: 40, opacity: 1 }
              }}
            >
              <ArrowRight size={'clamp(4rem, 10vw, 12rem)'} />
            </motion.div>
          </motion.h2>

          <motion.div
            variants={{
              rest: { opacity: 0, y: 20, color: '#020202' },
              hover: { opacity: 1, y: 0, color: '#020202' }
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', letterSpacing: '0.1em' }}
          >
            CLICK ANYWHERE TO INITIALIZE
          </motion.div>
        </div>
      </motion.a>

      {/* Extreme Minimal Metadata Strip */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '2rem 4rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div>© 2026 AUTOFLUX. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>GITHUB</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>TWITTER</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>DISCORD</a>
        </div>
      </div>

    </footer>
  );
}
