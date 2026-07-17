"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, HeadphonesIcon, Terminal, Users } from 'lucide-react';

const cases = [
  {
    title: "Finance & Operations",
    description: "Automate invoice extraction, categorize expenses via AI, and route approvals based on budget thresholds directly to Slack.",
    icon: <Building2 size={32} color="var(--color-accent)" />,
    span: "col-span-1 md:col-span-2",
    features: ["Document Parsing", "Budget Routing", "Stripe Automation"]
  },
  {
    title: "Customer Support",
    description: "Read incoming tickets, classify urgency, generate AI auto-replies for low-priority, and escalate high-priority to Jira.",
    icon: <HeadphonesIcon size={32} color="#ffb86c" />,
    span: "col-span-1",
    features: ["Sentiment Analysis", "Auto-Replies", "CRM Logging"]
  },
  {
    title: "Engineering",
    description: "Monitor GitHub webhooks, trigger tests, summarize PRs using Gemini, and post deployment statuses.",
    icon: <Terminal size={32} color="#50fa7b" />,
    span: "col-span-1",
    features: ["PR Summaries", "CI/CD Triggers", "Incident Alerts"]
  },
  {
    title: "Human Resources",
    description: "Onboard new hires automatically. Provision Google Workspace accounts, send Slack welcomes, and assign Notion tasks.",
    icon: <Users size={32} color="#bd93f9" />,
    span: "col-span-1 md:col-span-2",
    features: ["App Provisioning", "Welcome Sequences", "Task Assignment"]
  }
];

export function UseCasesSection() {
  return (
    <section id="use-cases" aria-label="Use Cases" style={{ 
      padding: '8rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, marginBottom: '1rem', color: '#fff' }}>
          Built for every <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>domain.</span>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Our AI workflow engine scales across your entire organization, adapting to the tools you already use.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        gridAutoRows: 'minmax(250px, auto)'
      }}>
        {cases.map((c, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              gridColumn: idx === 0 || idx === 3 ? 'span 2' : 'span 1'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {c.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#fff' }}>
                {c.title}
              </h3>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, flexGrow: 1, marginBottom: '2rem' }}>
              {c.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {c.features.map(f => (
                <span key={f} style={{ 
                  fontSize: '0.8rem', 
                  color: 'rgba(255,255,255,0.7)', 
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
