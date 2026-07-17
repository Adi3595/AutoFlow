"use client";

import React, { useEffect, useRef } from "react";

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = 40; // Spacing between dots
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    const dots: { x: number, y: number, baseRadius: number }[] = [];

    // Calculate grid offsets to center the grid
    const offsetX = (width - cols * spacing) / 2;
    const offsetY = (height - rows * spacing) / 2;

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        dots.push({
          x: offsetX + i * spacing,
          y: offsetY + j * spacing,
          baseRadius: 1.5,
        });
      }
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      dots.length = 0; // Clear array
      const newCols = Math.floor(width / spacing);
      const newRows = Math.floor(height / spacing);
      const newOffsetX = (width - newCols * spacing) / 2;
      const newOffsetY = (height - newRows * spacing) / 2;

      for (let i = 0; i <= newCols; i++) {
        for (let j = 0; j <= newRows; j++) {
          dots.push({
            x: newOffsetX + i * spacing,
            y: newOffsetY + j * spacing,
            baseRadius: 1.5,
          });
        }
      }
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 250;
        let radius = dot.baseRadius;
        let opacity = 0.15; // Base very dim opacity

        if (distance < maxDist) {
          // Increase size and opacity based on proximity
          const intensity = 1 - (distance / maxDist);
          radius = dot.baseRadius + (intensity * 2.5);
          opacity = 0.15 + (intensity * 0.85);
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(178, 213, 229, ${opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        background: "var(--color-bg)" // solid dark background
      }}
    />
  );
}
