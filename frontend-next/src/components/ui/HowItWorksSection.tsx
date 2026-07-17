"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRightCircle, Database, Mic, Cpu, Zap } from 'lucide-react';

const steps = [
  { num: '01', title: 'CONNECT', desc: 'Securely link all your internal databases and SaaS tools in one click.', icon: <Database size={24} /> },
  { num: '02', title: 'INTENT', desc: 'Speak to the engine. Describe your workflow outcome in plain English.', icon: <Mic size={24} /> },
  { num: '03', title: 'COMPILE', desc: 'AutoFlow generates the perfect node architecture instantly.', icon: <Cpu size={24} /> },
  { num: '04', title: 'EXECUTE', desc: 'Agents deploy autonomously, repairing routes if APIs change.', icon: <Zap size={24} /> }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-label="How AutoFlow Works" style={{ 
      background: 'transparent',
      padding: '8rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, marginBottom: '1rem', color: '#fff' }}>
          How it <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>works.</span>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Four steps from natural language to a fully deployed, autonomous AI workflow.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(178,213,229,0.1)' }}
            style={{ 
              background: 'rgba(5, 10, 15, 0.6)',
              border: '1px solid rgba(178,213,229,0.15)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ 
                color: 'var(--color-accent)', 
                background: 'rgba(178,213,229,0.1)',
                padding: '0.8rem',
                borderRadius: '12px'
              }}>
                {step.icon}
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, fontFamily: 'Ancola, Outfit, sans-serif' }}>
                {step.num}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '1rem', letterSpacing: '0.1em' }}>
              {step.title}
            </h3>
            
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, flexGrow: 1 }}>
              {step.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '2rem', padding: '1rem', background: 'rgba(178,213,229,0.05)', borderRadius: '12px', border: '1px solid rgba(178,213,229,0.1)' }}>
              <CheckCircle2 color="var(--color-accent)" size={18} />
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>System Ready</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
