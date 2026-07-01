"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code, Database, Cpu, Loader2 } from 'lucide-react';

export function HeroSection() {
  const [activeNode, setActiveNode] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState("");

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
              fontFamily: 'Outfit, sans-serif',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <motion.button 
                onClick={async () => {
                  setIsDeploying(true);
                  setDeployMessage("");
                  try {
                    const response = await fetch("http://localhost:8000/api/workflows/deploy", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ intent: "Initialize core automation system" })
                    });
                    const data = await response.json();
                    if (data.status === "success") {
                      setDeployMessage(`Deployed! ID: ${data.workflow_id}`);
                    }
                  } catch (e) {
                    setDeployMessage("Connection to backend failed.");
                  } finally {
                    setIsDeploying(false);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isDeploying}
                id="btn-deploy-os"
                style={{
                  background: 'var(--color-accent)',
                  color: '#020202',
                  border: 'none',
                  padding: '1.4rem 3.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  cursor: isDeploying ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 10px 30px rgba(178, 213, 229, 0.2)',
                  opacity: isDeploying ? 0.7 : 1
                }}
              >
                {isDeploying ? 'Deploying...' : 'Deploy'} 
                {isDeploying ? <Loader2 size={20} className="animate-spin" /> : <ArrowUpRight size={20} />}
              </motion.button>

              {deployMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: 'var(--color-accent)', fontSize: '0.9rem', paddingLeft: '1rem', fontFamily: 'monospace' }}
                >
                  {deployMessage}
                </motion.div>
              )}
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
