"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Sparkles } from 'lucide-react';

const PREDICTIVE_SUGGESTIONS = [
  "Wait for an email, extract invoice, save to DB",
  "Analyze Slack feedback. If negative, create Jira ticket",
  "Summarize daily meeting notes and email the team"
];

export function HeroSection() {
  const router = useRouter();
  const [intent, setIntent] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* Spotlight Beams */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100vh',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 40%, rgba(178,213,229,0.15) 50%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '40%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100vh',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 45%, rgba(93,124,196,0.1) 50%, transparent 55%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 10,
        position: 'relative',
        marginTop: '-10vh'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
            fontWeight: 500,
            background: 'rgba(255,255,255,0.05)',
            padding: '0.6rem 1.2rem',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={14} color="var(--color-accent)" />
            AutoFlow Operating System
          </div>

          <h1 style={{ 
            fontSize: 'clamp(3rem, 7vw, 6rem)', 
            fontWeight: 400, 
            lineHeight: 1.1, 
            margin: '0 0 3rem 0',
            fontFamily: 'Ancola, Outfit, sans-serif',
            letterSpacing: '-0.02em',
            maxWidth: '900px',
            textShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            Describe your workflow. <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #fff, var(--color-accent))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}>We'll build the architecture.</span>
          </h1>

          {/* Raycast-style Input Box */}
          <motion.div 
            whileHover={{ boxShadow: '0 0 40px rgba(178, 213, 229, 0.25)' }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(10, 15, 20, 0.95)', 
              border: '1px solid rgba(178, 213, 229, 0.4)', 
              borderRadius: '24px',
              padding: '0.75rem 0.75rem 0.75rem 2rem',
              width: '100%',
              maxWidth: '850px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 4px rgba(178,213,229,0.05)',
              backdropFilter: 'blur(20px)',
              transition: 'box-shadow 0.3s ease',
              position: 'relative',
              zIndex: 20
            }}
          >
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
                fontWeight: 400
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
                background: '#fff',
                color: '#000',
                border: 'none',
                padding: '1.2rem 2.5rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderRadius: '16px',
                cursor: isDeploying ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginLeft: '1rem',
                opacity: isDeploying ? 0.7 : 1,
                flexShrink: 0,
                boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
              }}
            >
              {isDeploying ? 'Deploying...' : 'Deploy'} 
              {isDeploying ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
            </motion.button>
          </motion.div>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.8rem', marginTop: '2rem', maxWidth: '800px', zIndex: 20 }}>
            {PREDICTIVE_SUGGESTIONS.map((suggestion, idx) => (
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                key={idx}
                onClick={() => setIntent(suggestion)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50px',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s ease'
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3D Tilted Floor Grid */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: 0,
        right: 0,
        height: '60vh',
        background: 'linear-gradient(transparent, rgba(178,213,229,0.05) 1px, transparent 1px), linear-gradient(90deg, transparent, rgba(178,213,229,0.05) 1px, transparent 1px)',
        backgroundSize: '4vw 4vw',
        transform: 'perspective(1000px) rotateX(75deg)',
        transformOrigin: 'top',
        zIndex: 0,
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }} />

    </section>
  );
}
