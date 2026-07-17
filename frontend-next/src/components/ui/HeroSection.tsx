"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Database, Cpu, Loader2, Command } from 'lucide-react';

const PREDICTIVE_SUGGESTIONS = [
  "Wait for an email, extract invoice, save to DB",
  "Analyze Slack feedback. If negative, create Jira ticket",
  "Summarize daily meeting notes and email the team"
];

export function HeroSection() {
  const router = useRouter();
  const [intent, setIntent] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, agents: 0 });

  useEffect(() => {
    const loadStats = () => {
      const workflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
      const agents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
      const uniqueAgents = agents.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.name === v.name) === i);
      setStats({ workflows: workflows.length, agents: uniqueAgents.length });
    };
    loadStats();
  }, []);

  return (
    <section id="hero-section" aria-label="Introduction" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 2rem 4rem',
      position: 'relative',
      overflowX: 'hidden',
      background: 'var(--color-bg)'
    }}>
      
      {/* Decorative Grid Background - Now faded out since we have InteractiveBackground */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(178, 213, 229, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(178, 213, 229, 0.03) 1px, transparent 1px)',
        backgroundSize: '4vw 4vw',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-accent)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            fontWeight: 600,
            background: 'rgba(178, 213, 229, 0.05)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            border: '1px solid rgba(178, 213, 229, 0.2)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }} />
            Next-Gen AI Workflow OS
          </div>

          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', 
            fontWeight: 300, 
            lineHeight: 1.05, 
            margin: '0 0 1.5rem 0',
            fontFamily: 'Ancola, Outfit, sans-serif',
            letterSpacing: '-0.02em',
            maxWidth: '1000px'
          }}>
            From natural language to <span style={{ color: 'var(--color-accent)', fontStyle: 'italic', fontWeight: 500 }}>executing architecture.</span>
          </h1>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '1.25rem', 
            maxWidth: '650px', 
            lineHeight: 1.6,
            marginBottom: '3.5rem'
          }}>
            AutoFlow is an intelligent canvas that translates your plain English directly into self-healing, autonomous backend workflows and AI agent fleets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
            
            <motion.div 
              whileHover={{ boxShadow: '0 0 25px rgba(178, 213, 229, 0.2)' }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(5, 10, 15, 0.8)', 
                border: '1px solid rgba(178, 213, 229, 0.3)', 
                borderRadius: '50px',
                padding: '0.5rem 0.5rem 0.5rem 1.5rem',
                width: '100%',
                maxWidth: '750px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(12px)',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <Command size={22} style={{ color: 'var(--color-accent)', marginRight: '1rem' }} />
              <input 
                type="text" 
                placeholder="e.g. Analyze user sentiment and draft an email..." 
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  width: '100%',
                  fontFamily: 'var(--font-primary), sans-serif',
                  fontSize: '1.15rem',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isDeploying) {
                    document.getElementById('btn-deploy-os')?.click();
                  }
                }}
              />
              <motion.button 
                id="btn-deploy-os"
                onClick={async () => {
                  if (!intent.trim()) return;
                  setIsDeploying(true);
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                    const response = await fetch(`${apiUrl}/api/workflows/deploy`, {
                      method: "POST",
                      headers: { 
                        "Content-Type": "application/json",
                        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "af_dev_secret_99"
                      },
                      body: JSON.stringify({ intent: intent })
                    });
                    const data = await response.json();
                    if (data.status === "success") {
                      const newWorkflow = {
                        id: data.workflow_id || `wf_${Date.now()}`,
                        intent: intent,
                        createdAt: new Date().toISOString(),
                        nodes: data.nodes || [],
                        agents: data.agents || [],
                        execution_logs: data.execution_logs || [],
                        explanation: data.explanation || null,
                        simulation: data.simulation || null,
                        suggestions: data.suggestions || null,
                        documentation: data.documentation || null,
                      };

                      const existingWorkflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
                      localStorage.setItem("autoflow_workflows", JSON.stringify([newWorkflow, ...existingWorkflows]));

                      const existingAgents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
                      localStorage.setItem("autoflow_agents", JSON.stringify([...newWorkflow.agents, ...existingAgents]));

                      const pastHistory = JSON.parse(localStorage.getItem("autoflow_history") || "[]");
                      localStorage.setItem("autoflow_history", JSON.stringify([intent, ...pastHistory.slice(0, 4)]));
                      
                      router.push('/dashboard');
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsDeploying(false);
                  }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isDeploying}
                style={{
                  background: 'var(--color-accent)',
                  color: '#020202',
                  border: 'none',
                  padding: '1rem 2.2rem',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  cursor: isDeploying ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginLeft: '1rem',
                  opacity: isDeploying ? 0.7 : 1,
                  flexShrink: 0
                }}
              >
                {isDeploying ? 'Deploying...' : 'Deploy'} 
                {isDeploying ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
              </motion.button>
            </motion.div>

            {/* Predictive Automation Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem', maxWidth: '800px' }}>
              {PREDICTIVE_SUGGESTIONS.map((suggestion, idx) => (
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(178, 213, 229, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => setIntent(suggestion)}
                  style={{
                    background: 'rgba(178, 213, 229, 0.05)',
                    border: '1px solid rgba(178, 213, 229, 0.2)',
                    borderRadius: '50px',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>

            {/* Live Analytics Dock - Centered horizontally */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                gap: '3rem',
                marginTop: '4rem',
                padding: '1.5rem 3rem',
                background: 'rgba(5, 10, 15, 0.4)',
                border: '1px solid rgba(178, 213, 229, 0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>WORKFLOWS DEPLOYED</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                  {stats.workflows > 0 ? stats.workflows : '0'}
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>ACTIVE AI AGENTS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                  {stats.agents > 0 ? stats.agents : '0'}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
