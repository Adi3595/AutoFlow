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
      
      // Load any OAuth tokens saved from the Integrations page
      const credentials: Record<string, string> = {};
      const githubToken = localStorage.getItem('autoflow_token_github');
      const slackToken = localStorage.getItem('autoflow_token_slack');
      if (githubToken) credentials['GITHUB_API_KEY'] = githubToken;
      if (slackToken) credentials['SLACK_API_KEY'] = slackToken;

      const response = await fetch(`${apiUrl}/api/workflows/deploy`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "af_dev_secret_99"
        },
        body: JSON.stringify({ intent: intent, credentials: credentials })
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
      } else {
        alert("Deployment failed: " + (data.detail || data.message || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Deployment failed: " + (e as Error).message);
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

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '10vw',
        paddingRight: '10vw',
        marginTop: '2rem',
        gap: '4rem',
        flexWrap: 'wrap'
      }}>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: '1.25rem', 
            maxWidth: '500px', 
            lineHeight: 1.6,
            flex: '1 1 400px'
          }}
        >
          A revolutionary canvas that translates your natural language directly into self-healing, autonomous backend architecture.
        </motion.p>

        {/* Floating Parallax Input Box */}
        <motion.div 
          style={{ y: inputY, flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 30px 60px rgba(0,0,0,0.6), 0 0 0px rgba(178, 213, 229, 0)', 
                '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(178, 213, 229, 0.5)', 
                '0 30px 60px rgba(0,0,0,0.6), 0 0 0px rgba(178, 213, 229, 0)'
              ],
              borderColor: ['rgba(255,255,255,0.2)', 'rgba(178, 213, 229, 0.8)', 'rgba(255,255,255,0.2)']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '100%',
              maxWidth: '700px',
              background: 'rgba(5, 10, 15, 0.75)',
              border: '2px solid',
              borderRadius: '100px',
              padding: '1rem',
              backdropFilter: 'blur(24px)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
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
          </motion.div>

          {/* Suggestion Pills */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingLeft: '1.5rem' }}>
             {["Build a scalable RAG backend", "Create a Stripe checkout webhook", "Automate KYC flow"].map((suggestion, idx) => (
                <button
                   key={idx}
                   onClick={() => setIntent(suggestion)}
                   style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.5)',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-mono)'
                   }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                     e.currentTarget.style.color = '#fff';
                     e.currentTarget.style.borderColor = 'var(--color-accent)';
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                     e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                     e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                   }}
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
