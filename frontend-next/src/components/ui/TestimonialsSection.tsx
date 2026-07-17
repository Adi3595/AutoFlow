"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "AutoFlow eliminated our entire DevOps backlog. We describe the CI/CD pipeline, and the agents build it in seconds.",
    author: "Sarah Jenkins",
    role: "VP of Engineering, CloudScale"
  },
  {
    quote: "The ability for the workflows to self-heal when an external API changes is nothing short of magic. It saves us countless hours of debugging.",
    author: "David Chen",
    role: "Lead Architect, Nexus"
  },
  {
    quote: "We replaced three different automation platforms with AutoFlow. The natural language interface makes it accessible to our whole team.",
    author: "Elena Rodriguez",
    role: "Director of Ops, FinTech Global"
  },
  {
    quote: "I've never seen an operating system for agents this intuitive. It's like having a senior engineer on call 24/7.",
    author: "Marcus Toll",
    role: "CTO, DataSync"
  },
  {
    quote: "AutoFlow eliminated our entire DevOps backlog. We describe the CI/CD pipeline, and the agents build it in seconds.",
    author: "Sarah Jenkins",
    role: "VP of Engineering, CloudScale"
  },
  {
    quote: "The ability for the workflows to self-heal when an external API changes is nothing short of magic. It saves us countless hours of debugging.",
    author: "David Chen",
    role: "Lead Architect, Nexus"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ 
      padding: '8rem 0',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden',
      background: 'rgba(2, 2, 2, 0.4)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, marginBottom: '1rem', color: '#fff' }}>
          Trusted by <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>innovators.</span>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          See how top engineering teams are scaling their operations with autonomous AI workflows.
        </p>
      </div>

      <div style={{
        display: 'flex',
        width: '200%', // Double width for seamless scroll
      }}>
        <motion.div 
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          style={{
            display: 'flex',
            gap: '2rem',
            paddingLeft: '2rem'
          }}
        >
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(10px)',
                width: '450px',
                flexShrink: 0
              }}
            >
              <Quote size={32} color="var(--color-accent)" style={{ opacity: 0.5, marginBottom: '1.5rem' }} />
              
              <p style={{ fontSize: '1.15rem', color: '#fff', lineHeight: 1.6, flexGrow: 1, marginBottom: '2rem', fontWeight: 300 }}>
                "{t.quote}"
              </p>

              <div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{t.author}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
