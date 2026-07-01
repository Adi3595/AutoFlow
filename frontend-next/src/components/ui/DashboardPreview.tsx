"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Activity, Cpu, Database, Zap } from 'lucide-react';

export function DashboardPreview() {
  const [liveStats, setLiveStats] = useState({
    agents: 0,
    workflows: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      const workflows = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
      const agents = JSON.parse(localStorage.getItem("autoflow_agents") || "[]");
      const uniqueAgents = agents.filter((v: any, i: number, a: any[]) =>
        a.findIndex((t: any) => t.name === v.name) === i
      );
      setLiveStats({ workflows: workflows.length, agents: uniqueAgents.length });
    };

    // Load on mount
    loadStats();

    // Also refresh every 3s in case user deploys in another tab
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'ACTIVE AGENTS',
      value: liveStats.agents > 0 ? String(liveStats.agents) : '0',
      isLive: true,
      icon: <Cpu color="var(--color-accent)" size={24} />
    },
    {
      label: 'WORKFLOWS',
      value: liveStats.workflows > 0 ? String(liveStats.workflows) : '0',
      isLive: true,
      icon: <Network color="var(--color-accent)" size={24} />
    },
    {
      label: 'DATA SYNC',
      value: '99.9%',
      isLive: false,
      icon: <Database color="var(--color-accent)" size={24} />
    },
    {
      label: 'LATENCY',
      value: '12ms',
      isLive: false,
      icon: <Activity color="var(--color-accent)" size={24} />
    },
  ];

  return (
    <section id="dashboard" aria-label="Dashboard Preview" style={{ 
      minHeight: '100vh', 
      background: '#020202', 
      borderTop: '1px solid rgba(255,255,255,0.05)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      padding: '4rem 2rem', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Live Flow Architecture</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', maxWidth: '600px' }}>
          Abandon the terminal logs. Visualize your entire dynamic infrastructure in real-time as data streams through intelligent nodes.
        </p>
      </div>
      
      {/* Massive Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', marginBottom: '4rem' }}>
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: `1px solid ${metric.isLive ? 'rgba(178,213,229,0.15)' : 'rgba(255,255,255,0.05)'}`, 
              padding: '2rem', 
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* LIVE indicator pulse for dynamic stats */}
            {metric.isLive && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: liveStats.agents > 0 || liveStats.workflows > 0 ? '#0f0' : 'rgba(255,255,255,0.2)' }}
                />
                <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: liveStats.agents > 0 || liveStats.workflows > 0 ? '#0f0' : 'rgba(255,255,255,0.2)' }}>LIVE</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{metric.label}</div>
              {metric.icon}
            </div>

            <motion.div
              key={metric.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: '3.5rem', color: metric.isLive ? 'var(--color-accent)' : '#fff', fontWeight: 300, lineHeight: 1, fontFamily: 'monospace' }}
            >
              {metric.value}
            </motion.div>

            {metric.isLive && (liveStats.agents === 0 && liveStats.workflows === 0) && (
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                Deploy a workflow to start tracking
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Visual Network Graph */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        height: '400px', 
        background: 'rgba(178,213,229,0.02)', 
        border: '1px solid rgba(178,213,229,0.1)', 
        borderRadius: '32px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Core Node */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 3 }} 
          style={{ width: '80px', height: '80px', background: 'var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 0 40px var(--color-accent)' }}
        >
          <Zap size={32} color="#020202" />
        </motion.div>

        {/* Pulsing rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            animate={{ scale: [1, 3], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: ring * 0.6 }}
            style={{ position: 'absolute', width: '100px', height: '100px', border: '1px solid var(--color-accent)', borderRadius: '50%' }}
          />
        ))}

        {/* Orbiting Satellite Nodes */}
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            style={{ position: 'absolute', width: '300px', height: '300px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', transform: `rotate(${deg}deg)` }}
          >
            <div style={{ width: '24px', height: '24px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 15px #fff' }} />
          </motion.div>
        ))}

        {/* Connecting Paths */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <circle cx="50%" cy="50%" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="50%" cy="50%" r="250" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2,8" />
        </svg>

      </div>
    </section>
  );
}
