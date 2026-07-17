"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [intent, setIntent] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Parallax scrolling
  const { scrollY } = useScroll();
  const textY1 = useTransform(scrollY, [0, 500], [0, -100]);
  const textY2 = useTransform(scrollY, [0, 500], [0, -150]);
  const textY3 = useTransform(scrollY, [0, 500], [0, -200]);
  const inputY = useTransform(scrollY, [0, 500], [0, -50]);

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

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.21, 0.47, 0.32, 0.98] as const
      }
    })
  };

  return (
    <section id="hero-section" style={{
      minHeight: '120vh', // extra height for scrolling
      display: 'flex',
      flexDirection: 'column',
      padding: '8rem 4rem',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden'
    }}>
      
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--color-accent)',
        fontSize: '0.9rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '4rem',
        fontWeight: 500,
      }}>
        <Sparkles size={16} /> AutoFlow OS
      </div>

      {/* Massive Typography - Asymmetrical */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <motion.div style={{ y: textY1 }}>
          <motion.h1 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            style={{ 
              fontSize: 'clamp(5rem, 12vw, 10rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              fontFamily: 'Ancola, Outfit, sans-serif',
              letterSpacing: '-0.04em',
              color: '#fff',
            }}
          >
            THINK.
          </motion.h1>
        </motion.div>

        <motion.div style={{ y: textY2, paddingLeft: '10vw' }}>
          <motion.h1 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            style={{ 
              fontSize: 'clamp(5rem, 12vw, 10rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              fontFamily: 'Ancola, Outfit, sans-serif',
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.2)', // Outline effect
              fontStyle: 'italic'
            }}
          >
            BUILD.
          </motion.h1>
        </motion.div>

        <motion.div style={{ y: textY3, paddingLeft: '20vw' }}>
          <motion.h1 
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            style={{ 
              fontSize: 'clamp(5rem, 12vw, 10rem)', 
              fontWeight: 700, 
              lineHeight: 0.85, 
              fontFamily: 'Ancola, Outfit, sans-serif',
              letterSpacing: '-0.04em',
              color: 'var(--color-accent)',
            }}
          >
            SCALE.
          </motion.h1>
        </motion.div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ 
          color: 'rgba(255, 255, 255, 0.5)', 
          fontSize: '1.25rem', 
          maxWidth: '450px', 
          lineHeight: 1.6,
          marginTop: '4rem',
          paddingLeft: '20vw'
        }}
      >
        A revolutionary canvas that translates your natural language directly into self-healing, autonomous backend architecture.
      </motion.p>

      {/* Floating Parallax Input Box */}
      <motion.div 
        style={{ y: inputY }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        <div style={{
          position: 'absolute',
          bottom: '10vh',
          right: '5vw',
          width: '90%',
          maxWidth: '700px',
          background: 'rgba(5, 10, 15, 0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px',
          padding: '1rem',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
        }}>
          <input 
            type="text" 
            placeholder="Type a workflow intent..." 
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
              paddingLeft: '1.5rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isDeploying) handleDeploy();
            }}
          />
          <motion.button 
            onClick={handleDeploy}
            whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
            whileTap={{ scale: 0.95 }}
            disabled={isDeploying}
            style={{
              background: 'var(--color-accent)',
              color: '#000',
              border: 'none',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: isDeploying ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.3s ease'
            }}
          >
            {isDeploying ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
          </motion.button>
        </div>
      </motion.div>

    </section>
  );
}
