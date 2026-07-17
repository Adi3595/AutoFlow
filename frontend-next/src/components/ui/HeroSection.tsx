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
  const [activeNode, setActiveNode] = useState(0);
  const [intent, setIntent] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState("");
  const [stats, setStats] = useState({ workflows: 0, agents: 0 });

  // Load live stats from localStorage
  useEffect(() => {
    const loadStats = () => {
      const workflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
      const agents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
      const uniqueAgents = agents.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.name === v.name) === i);
      setStats({ workflows: workflows.length, agents: uniqueAgents.length });
    };
    loadStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  const nodes = [
    { title: 'Parse Email', icon: <Database size={16} /> },
    { title: 'Extract Intent', icon: <Cpu size={16} /> },
    { title: 'Generate Script', icon: <Code size={16} /> },
    { title: 'Execute Flow', icon: <ArrowUpRight size={16} /> },
  ];

  return (
    <section id="hero-section" aria-label="Introduction" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'stretch',
      padding: '0',
      position: 'relative',
      overflowX: 'hidden',
      background: 'var(--color-bg)'
    }}>
      
      {/* Decorative Grid Background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(178, 213, 229, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(178, 213, 229, 0.05) 1px, transparent 1px)',
        backgroundSize: '4vw 4vw',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        zIndex: 1
      }}>
        
        {/* Left Side: Editorial Massive Typography */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 4rem 4rem 8vw',
          borderRight: '1px solid rgba(178, 213, 229, 0.1)',
          background: 'rgba(2, 2, 2, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--color-accent)',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '3rem',
              fontWeight: 600
            }}>
              <span style={{ width: '30px', height: '1px', background: 'var(--color-accent)' }} />
              System Architecture
            </div>

            <h1 style={{ 
              fontSize: 'clamp(4rem, 8vw, 8rem)', 
              fontWeight: 300, 
              lineHeight: 0.9, 
              margin: '0 0 2rem 0',
              fontFamily: 'Ancola, Outfit, sans-serif',
              letterSpacing: '-0.04em'
            }}>
              THINK.<br />
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic', fontWeight: 500 }}>BUILD.</span><br />
              SCALE.
            </h1>

            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '1.2rem', 
              maxWidth: '400px', 
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              AutoFlow is not a template. It is an intelligent canvas that translates your natural language directly into executing, self-healing backend architecture.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', width: '100%' }}>
              
              <motion.div 
                whileHover={{ boxShadow: '0 0 25px rgba(178, 213, 229, 0.15)' }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'rgba(5, 10, 15, 0.8)', 
                  border: '1px solid rgba(178, 213, 229, 0.3)', 
                  borderRadius: '50px',
                  padding: '0.5rem 0.5rem 0.5rem 1.5rem',
                  width: '100%',
                  maxWidth: '650px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
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
                    fontSize: '1.1rem',
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
                        // Build the full enriched workflow record
                        const newWorkflow = {
                          id: data.workflow_id || `wf_${Date.now()}`,
                          intent: intent,
                          createdAt: new Date().toISOString(),
                          nodes: data.nodes || [],
                          agents: data.agents || [],
                          // New enriched fields — persist all panel data
                          execution_logs: data.execution_logs || [],
                          explanation: data.explanation || null,
                          simulation: data.simulation || null,
                          suggestions: data.suggestions || null,
                          documentation: data.documentation || null,
                        };

                        // Prepend to the persistent workflows list
                        const existingWorkflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
                        localStorage.setItem("autoflow_workflows", JSON.stringify([newWorkflow, ...existingWorkflows]));

                        // Append new agents to global agent pool
                        const existingAgents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
                        localStorage.setItem("autoflow_agents", JSON.stringify([...newWorkflow.agents, ...existingAgents]));

                        // Save Memory Engine History (legacy support)
                        const pastHistory = JSON.parse(localStorage.getItem("autoflow_history") || "[]");
                        localStorage.setItem("autoflow_history", JSON.stringify([intent, ...pastHistory.slice(0, 4)]));
                        
                        // Route to dashboard
                        router.push('/dashboard');
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsDeploying(false);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isDeploying}
                  style={{
                    background: 'var(--color-accent)',
                    color: '#020202',
                    border: 'none',
                    padding: '0.8rem 1.8rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    cursor: isDeploying ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1rem', maxWidth: '650px' }}>
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
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ color: 'var(--color-accent)', marginRight: '0.5rem' }}>+</span> 
                    {suggestion}
                  </motion.button>
                ))}
              </div>

              {/* Live Analytics Dock */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginTop: '3rem',
                  padding: '1.5rem 2rem',
                  background: 'rgba(5, 10, 15, 0.5)',
                  border: '1px solid rgba(178, 213, 229, 0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '650px',
                  width: '100%'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>WORKFLOWS DEPLOYED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                    {stats.workflows > 0 ? stats.workflows : '0'}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>ACTIVE AI AGENTS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                    {stats.agents > 0 ? stats.agents : '0'}
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Right Side: Dynamic Interactive Canvas */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem'
        }}>
          {/* Glowing central orb abstraction */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              width: '40vw',
              height: '40vw',
              background: 'radial-gradient(circle, rgba(178, 213, 229, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              zIndex: 0
            }}
          />

          {/* Floating Flow Nodes */}
          <div style={{ position: 'relative', zIndex: 1, height: '60vh', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {nodes.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: activeNode === i || activeNode > i ? 1 : 0.3,
                  x: 0,
                  y: activeNode === i ? -10 : 0
                }}
                transition={{ duration: 0.5 }}
                style={{
                  background: activeNode === i ? 'rgba(178, 213, 229, 0.1)' : 'rgba(2, 2, 2, 0.5)',
                  border: `1px solid ${activeNode === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: activeNode === i ? '0 10px 30px rgba(178, 213, 229, 0.1)' : 'none',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ 
                  background: activeNode === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  color: activeNode === i ? '#020202' : '#fff',
                  width: '40px', height: '40px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  {node.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Process {i + 1}
                  </div>
                  <div style={{ fontSize: '1.2rem', color: activeNode === i ? 'var(--color-accent)' : '#fff', fontWeight: 500 }}>
                    {node.title}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Connecting lines */}
            <div style={{
              position: 'absolute',
              left: '3.3rem',
              top: '4rem',
              bottom: '4rem',
              width: '1px',
              background: 'rgba(255,255,255,0.1)',
              zIndex: -1
            }}>
              <motion.div 
                animate={{ height: `${(activeNode / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 10px var(--color-accent)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
