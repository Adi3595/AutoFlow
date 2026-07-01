"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

export function PricingSection() {
  return (
    <section id="pricing" aria-label="Pricing Architecture" style={{ 
      minHeight: '100vh', 
      background: 'var(--color-bg)', 
      position: 'relative',
      borderTop: '1px solid var(--color-accent)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Endlessly scrolling marquee for the title */}
      <div style={{ padding: '2rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#020202', zIndex: 10 }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{ display: 'flex', whiteSpace: 'nowrap', gap: '4rem', fontSize: '3rem', fontWeight: 600, fontFamily: 'Ancola, Outfit, sans-serif', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}
        >
          <span>PRICING ARCHITECTURE &bull; TRANSPARENT INFRASTRUCTURE &bull; NO HIDDEN FEES &bull; PRICING ARCHITECTURE &bull; TRANSPARENT INFRASTRUCTURE &bull; NO HIDDEN FEES &bull;</span>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
        
        {/* DEVELOPER TIER - Raw Terminal / Brutalist style */}
        <div style={{ 
          flex: '1 1 50%', 
          minWidth: '350px',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          padding: '6rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '4rem' }}>
            <Terminal size={20} />
            <span>sys.env.DEVELOPER_MODE = true</span>
          </div>
          
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '0.2em', marginBottom: '1rem' }}>INDIVIDUAL / LOCAL</h3>
          <div style={{ fontSize: 'clamp(5rem, 10vw, 12rem)', fontWeight: 300, color: '#fff', lineHeight: 0.8, marginBottom: '2rem' }}>
            $0
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', fontFamily: 'monospace', marginBottom: '4rem' }}>
            {">"} Unlimited local agents<br/>
            {">"} Basic telemetry pipeline<br/>
            {">"} 100 cloud runs / month
          </p>

          <div style={{ marginTop: 'auto' }}>
            <motion.button 
              onClick={() => window.open('https://github.com/Adi3595/AutoFlow', '_blank')}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid #fff',
                padding: '1.5rem 3rem',
                fontSize: '1rem',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              Initialize Local <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* ENTERPRISE TIER - Solid Candy Blue block, highly editorial */}
        <div style={{ 
          flex: '1 1 50%', 
          minWidth: '350px',
          background: 'var(--color-accent)',
          padding: '6rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          color: '#020202',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative giant background letter */}
          <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', fontSize: '40vw', fontWeight: 700, opacity: 0.1, lineHeight: 0.7, pointerEvents: 'none' }}>
            E
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'monospace', marginBottom: '4rem', opacity: 0.6 }}>
            <span>[ HIGH-AVAILABILITY CLUSTER ]</span>
          </div>
          
          <h3 style={{ fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: 700 }}>PRODUCTION GRADE</h3>
          <div style={{ 
            fontSize: 'clamp(2rem, 4vw, 5rem)', 
            fontWeight: 700, 
            lineHeight: 0.9, 
            marginBottom: '2rem', 
            letterSpacing: '-0.04em',
            wordBreak: 'break-word'
          }}>
            CUSTOM<br/>INFRASTRUCTURE
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '4rem', maxWidth: '400px' }}>
            Dedicated VPC deployments, self-healing SLA, custom integrations, and infinite scaling across your entire organization.
          </p>

          <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
            <motion.button 
              onClick={() => window.location.href = 'mailto:engineering@autoflow.com'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#020202',
                color: 'var(--color-accent)',
                border: 'none',
                padding: '1.5rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              Contact Engineering <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
}
