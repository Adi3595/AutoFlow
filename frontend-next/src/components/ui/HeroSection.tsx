"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Sparkles, Database, Cpu, Blocks } from 'lucide-react';

const PREDICTIVE_SUGGESTIONS = [
  "Wait for an email, extract invoice, save to DB",
  "Analyze Slack feedback. If negative, create Jira ticket",
  "Summarize daily meeting notes and email the team"
];

export function HeroSection() {
  const router = useRouter();
  const [intent, setIntent] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, agents: 0, nodes: 0 });

  useEffect(() => {
    const loadStats = () => {
      const workflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
      const agents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
      const uniqueAgents = agents.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.name === v.name) === i);
      let totalNodes = 0;
      workflows.forEach((w: any) => totalNodes += (w.nodes?.length || 0));
      
      setStats({ workflows: workflows.length, agents: uniqueAgents.length, nodes: totalNodes });
    };
    loadStats();
  }, []);

  const handleDeploy = async () => {
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
        
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <section id="hero-section" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem',
      position: 'relative',
      zIndex: 10
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        
        {/* BENTO BOX 1: Main Typography (Span 8) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            gridColumn: 'span 8',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '4rem 3rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-accent)',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            fontWeight: 600,
          }}>
            <Sparkles size={14} /> Next-Gen AI Workflow OS
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
            fontWeight: 300, 
            lineHeight: 1.1, 
            margin: '0 0 1.5rem 0',
            fontFamily: 'Ancola, Outfit, sans-serif',
            letterSpacing: '-0.02em',
          }}>
            From natural language to <span style={{ color: 'var(--color-accent)', fontStyle: 'italic', fontWeight: 500 }}>architecture.</span>
          </h1>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '1.15rem', 
            maxWidth: '550px', 
            lineHeight: 1.6,
          }}>
            AutoFlow translates your plain English directly into executing, self-healing backend workflows and AI agent fleets.
          </p>
        </motion.div>

        {/* BENTO BOX 2: Stats (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            gridColumn: 'span 4',
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}
        >
          {/* Stat 1 */}
          <div style={{
            background: 'rgba(178,213,229,0.05)',
            border: '1px solid rgba(178,213,229,0.1)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>ACTIVE AGENTS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff' }}>{stats.agents}</div>
            </div>
            <Cpu size={32} color="var(--color-accent)" opacity={0.5} />
          </div>

          {/* Stat 2 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>WORKFLOWS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff' }}>{stats.workflows}</div>
            </div>
            <Database size={32} color="#fff" opacity={0.2} />
          </div>

          {/* Stat 3 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>TOTAL NODES</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff' }}>{stats.nodes}</div>
            </div>
            <Blocks size={32} color="#fff" opacity={0.2} />
          </div>
        </motion.div>

        {/* BENTO BOX 3: Input Field (Span 12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            gridColumn: 'span 12',
            background: 'rgba(5, 10, 15, 0.8)',
            border: '1px solid rgba(178,213,229,0.3)',
            borderRadius: '24px',
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="What do you want to automate today?" 
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                width: '100%',
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '1.25rem',
                outline: 'none',
                paddingLeft: '1rem'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isDeploying) handleDeploy();
              }}
            />
            <motion.button 
              onClick={handleDeploy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDeploying}
              style={{
                background: 'var(--color-accent)',
                color: '#000',
                border: 'none',
                padding: '1rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '16px',
                cursor: isDeploying ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isDeploying ? 0.7 : 1,
                flexShrink: 0,
              }}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'} 
              {isDeploying ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
            </motion.button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', paddingLeft: '1rem' }}>
            {PREDICTIVE_SUGGESTIONS.map((suggestion, idx) => (
              <button 
                key={idx}
                onClick={() => setIntent(suggestion)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50px',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
