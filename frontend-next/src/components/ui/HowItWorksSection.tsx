"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRightCircle } from 'lucide-react';

const steps = [
  { num: '01', title: 'CONNECT', desc: 'Securely link all your internal databases and SaaS tools in one click.' },
  { num: '02', title: 'INTENT', desc: 'Speak to the engine. Describe your workflow outcome in plain English.' },
  { num: '03', title: 'COMPILE', desc: 'AutoFlow generates the perfect node architecture instantly.' },
  { num: '04', title: 'EXECUTE', desc: 'Agents deploy autonomously, repairing routes if APIs change.' }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-label="How AutoFlow Works" style={{ background: 'var(--color-bg)' }}>
      {steps.map((step, idx) => (
        <div key={idx} style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          scrollSnapAlign: 'start'
        }}>
          {/* Left: Giant Number */}
          <div style={{ 
            flex: '1 1 50%', 
            minWidth: '300px',
            borderRight: '1px solid rgba(178,213,229,0.1)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '4rem 8vw',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.5 }}>
              <div style={{ fontSize: 'clamp(6rem, 10vw, 15rem)', fontWeight: 700, lineHeight: 0.8, color: 'var(--color-accent)', fontFamily: 'Outfit, sans-serif' }}>
                {step.num}
              </div>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 300, marginTop: '2rem', letterSpacing: '0.2em' }}>
                {step.title}
              </div>
            </motion.div>
          </div>
          
          {/* Right: Graphic / Visual Representation */}
          <div style={{ 
            flex: '1 1 50%', 
            minWidth: '300px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '4rem 8vw',
            background: '#020202'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: false, amount: 0.5 }} 
              style={{ 
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}
            >
              <h3 style={{ fontSize: '2rem', fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>
                {step.desc}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(178,213,229,0.05)', borderRadius: '16px', border: '1px solid rgba(178,213,229,0.2)' }}>
                <CheckCircle2 color="var(--color-accent)" size={28} />
                <span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>System Verified</span>
                <div style={{ flex: 1 }} />
                <ArrowRightCircle color="rgba(255,255,255,0.3)" size={28} />
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
