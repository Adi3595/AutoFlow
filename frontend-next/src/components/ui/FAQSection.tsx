"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQSection() {
  const faqs = [
    { q: "How does it differ from Zapier?", a: "Zapier is static. If an endpoint changes, your Zap breaks. AutoFlow uses agents that read documentation and self-heal API routes dynamically." },
    { q: "Can I host this on my VPC?", a: "Yes. Enterprise plans include fully air-gapped Docker clusters that run entirely within your secure network." },
    { q: "What LLM is under the hood?", a: "A custom orchestration layer. We route logic tasks to specialized coding models and intent parsing to high-speed general models for zero-latency execution." },
    { q: "Is workflow complexity limited?", a: "No. The architecture compiles to a Directed Acyclic Graph. You can build infinitely deep branching paths." }
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  return (
    <section id="faq" aria-label="System Queries FAQ" style={{ 
      minHeight: '100vh',
      background: '#020202', 
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexWrap: 'wrap'
    }}>
      
      {/* Left side: The Questions (Interactive List) */}
      <div style={{ 
        flex: '1 1 50%', 
        minWidth: '350px',
        padding: '6rem 4vw',
        borderRight: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 500, 
          color: 'var(--color-accent)', 
          marginBottom: '4rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          // System Queries
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 3rem)',
                fontWeight: hoveredIdx === idx ? 700 : 300,
                color: hoveredIdx === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Outfit, sans-serif',
                lineHeight: 1.2
              }}
            >
              {hoveredIdx === idx && <span style={{ color: 'var(--color-accent)', marginRight: '1rem' }}>&gt;</span>}
              {faq.q}
            </div>
          ))}
        </div>
      </div>

      {/* Right side: The Dedicated Answer Viewport */}
      <div style={{ 
        flex: '1 1 50%', 
        minWidth: '350px',
        padding: '6rem 4vw',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '600px' }}
          >
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', marginBottom: '2rem' }}>
              RESPONSE_PAYLOAD_{hoveredIdx + 1}
            </div>
            <p style={{ 
              fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', 
              color: 'var(--color-accent)', 
              lineHeight: 1.4,
              fontWeight: 300
            }}>
              {faqs[hoveredIdx].a}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
