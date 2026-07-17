"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2, CheckCircle, RefreshCw } from "lucide-react";

interface Message { role: "user" | "ai"; content: string; timestamp: string; }
interface Props {
  workflowId: string;
  intent: string;
  nodes: any[];
  onWorkflowUpdated: (nodes: any[], agents: any[], explanation: string | null) => void;
}

const EXAMPLE_COMMANDS = [
  "Replace Telegram with Slack",
  "Add manager approval before sending email",
  "Run this every Monday at 9am",
  "Add error notification if any step fails",
  "Add retry logic for API calls",
];

export function ConversationalEdit({ workflowId, intent, nodes, onWorkflowUpdated }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "I can modify your workflow using natural language. Try commands like \"Replace Slack with Teams\" or \"Add approval before payment\".", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "af_dev_secret_99";

  const sendEdit = async (command: string) => {
    if (!command.trim() || isEditing) return;
    const userMsg: Message = { role: "user", content: command, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsEditing(true);

    try {
      const res = await fetch(`${apiUrl}/api/workflows/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ workflow_id: workflowId, intent, nodes, edit_command: command })
      });
      const data = await res.json();
      if (data.status === "success") {
        onWorkflowUpdated(data.nodes, data.agents, data.explanation);
        const aiMsg: Message = { role: "ai", content: `✓ ${data.change_description}${data.explanation ? `\n\n${data.explanation}` : ""}`, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error("Edit failed");
      }
    } catch (err) {
      const errMsg: Message = { role: "ai", content: "⚠ I couldn't apply that edit. Please try rephrasing your command.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsEditing(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid rgba(178,213,229,0.08)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <MessageSquare size={18} style={{ color: "var(--color-accent)" }} />
        <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>CONVERSATIONAL EDITOR</h3>
      </div>

      {/* Example commands */}
      <div style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {EXAMPLE_COMMANDS.map(cmd => (
          <button key={cmd} onClick={() => sendEdit(cmd)}
            style={{ background: "rgba(178,213,229,0.05)", border: "1px solid rgba(178,213,229,0.15)", borderRadius: "var(--radius-pill)", padding: "0.25rem 0.75rem", fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all 0.2s" }}>
            {cmd}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: msg.role === "user" ? "rgba(178,213,229,0.2)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", flexShrink: 0, border: `1px solid ${msg.role === "user" ? "rgba(178,213,229,0.3)" : "rgba(255,255,255,0.1)"}` }}>
                {msg.role === "user" ? "U" : "AI"}
              </div>
              <div style={{ maxWidth: "80%", background: msg.role === "user" ? "rgba(178,213,229,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${msg.role === "user" ? "rgba(178,213,229,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-md)", padding: "0.75rem 1rem" }}>
                <p style={{ margin: 0, fontSize: "var(--text-sm)", color: msg.role === "user" ? "var(--color-accent)" : "rgba(255,255,255,0.85)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isEditing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", border: "1px solid rgba(255,255,255,0.1)" }}>AI</div>
              <Loader2 size={16} style={{ color: "var(--color-accent)", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontStyle: "italic" }}>Editing workflow...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "1rem 2rem", borderTop: "1px solid rgba(178,213,229,0.08)", display: "flex", gap: "0.75rem" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendEdit(input)} placeholder="Describe your edit (e.g. 'Add a retry step after Gmail fails')" disabled={isEditing}
          style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(178,213,229,0.15)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", outline: "none" }} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => sendEdit(input)} disabled={isEditing || !input.trim()}
          style={{ width: "44px", height: "44px", background: input.trim() && !isEditing ? "var(--color-accent)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "var(--radius-md)", cursor: input.trim() && !isEditing ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          {isEditing ? <Loader2 size={16} style={{ color: "#020202", animation: "spin 1s linear infinite" }} /> : <Send size={16} style={{ color: input.trim() ? "#020202" : "rgba(255,255,255,0.3)" }} />}
        </motion.button>
      </div>
    </div>
  );
}
