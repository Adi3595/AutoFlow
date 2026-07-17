"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

const securityFeatures = [
  {
    icon: <ShieldCheck size={32} color="var(--color-accent)" />,
    title: "SOC2 Type II Certified",
    desc: "Our infrastructure is continuously audited and strictly complies with SOC2 Type II standards, ensuring your data is handled with the highest level of security."
  },
  {
    icon: <Lock size={32} color="var(--color-accent)" />,
    title: "End-to-End Encryption",
    desc: "All workflow data, API keys, and sensitive tokens are encrypted both in transit (TLS 1.3) and at rest (AES-256) across our entire global fleet."
  },
  {
    icon: <Activity size={32} color="var(--color-accent)" />,
    title: "99.99% Uptime SLA",
    desc: "Built on a resilient, globally distributed multi-cloud architecture. AutoFlow guarantees high availability for your mission-critical autonomous agents."
  }
];

export function SecuritySection() {
  return (
    <section id="security" style={{ 
      padding: '10rem 2rem',
      position: 'relative',
      zIndex: 1,
      background: 'rgba(5, 10, 15, 0.8)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.02)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
              fontWeight: 600,
            }}>
              <Lock size={14} /> Enterprise Grade
            </div>

            <h2 style={{ 
              fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
              fontWeight: 300, 
              marginBottom: '2rem', 
              color: '#fff',
              lineHeight: 1.1,
              fontFamily: 'Ancola, Outfit, sans-serif'
            }}>
              Secure by <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>design.</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '500px' }}>
              AutoFlow is engineered from the ground up for the enterprise. We provide military-grade security so your autonomous workflows can run securely at scale.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {securityFeatures.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '2rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ 
                  background: 'rgba(178,213,229,0.05)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(178,213,229,0.1)'
                }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
