"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Download } from "lucide-react";

interface DocData {
  summary: string;
  execution_sequence: string[];
  inputs: string[];
  outputs: string[];
  connected_integrations: string[];
  node_descriptions: Record<string, string>;
}
interface Props { documentation: DocData | null; workflowIntent?: string; isLoading?: boolean; }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-accent)", letterSpacing: "0.1em", marginBottom: "0.75rem", borderBottom: "1px solid rgba(178,213,229,0.08)", paddingBottom: "0.5rem" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function DocumentationPanel({ documentation, workflowIntent, isLoading }: Props) {
  const downloadDoc = () => {
    if (!documentation) return;
    const text = [
      `# AutoFlow Workflow Documentation`,
      `## Intent\n${workflowIntent || "Unknown"}`,
      `## Summary\n${documentation.summary}`,
      `## Execution Sequence\n${documentation.execution_sequence.join("\n")}`,
      `## Inputs\n${documentation.inputs.join("\n")}`,
      `## Outputs\n${documentation.outputs.join("\n")}`,
      `## Integrations\n${documentation.connected_integrations.join(", ")}`,
      `## Node Descriptions\n${Object.entries(documentation.node_descriptions).map(([k,v]) => `- ${k}: ${v}`).join("\n")}`,
    ].join("\n\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "workflow-docs.md"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FileText size={18} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>AUTO DOCUMENTATION</h3>
        </div>
        {documentation && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadDoc}
            style={{ background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-sm)", padding: "0.4rem 0.9rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Download size={12} /> EXPORT .MD
          </motion.button>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1,2,3].map(i => <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i*0.2 }} style={{ height: "4rem", background: "rgba(178,213,229,0.04)", borderRadius: "var(--radius-md)" }} />)}
        </div>
      ) : documentation ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Section title="SUMMARY">
            <p style={{ margin: 0, fontSize: "var(--text-base)", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{documentation.summary}</p>
          </Section>

          <Section title="EXECUTION SEQUENCE">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {documentation.execution_sequence.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--color-accent)", background: "rgba(178,213,229,0.1)", padding: "0.1rem 0.4rem", borderRadius: "3px" }}>{i+1}</span>
                  {step}
                </div>
              ))}
            </div>
          </Section>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <Section title="INPUTS">
              {documentation.inputs.map((inp, i) => <div key={i} style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)", padding: "0.25rem 0" }}>→ {inp}</div>)}
            </Section>
            <Section title="OUTPUTS">
              {documentation.outputs.map((out, i) => <div key={i} style={{ fontSize: "var(--text-sm)", color: "#50fa7b", padding: "0.25rem 0" }}>← {out}</div>)}
            </Section>
          </div>

          <Section title="CONNECTED INTEGRATIONS">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {documentation.connected_integrations.map(int => (
                <span key={int} style={{ background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.25rem 0.75rem", fontSize: "var(--text-sm)", color: "var(--color-accent)" }}>{int}</span>
              ))}
            </div>
          </Section>

          <Section title="NODE DESCRIPTIONS">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {Object.entries(documentation.node_descriptions).map(([id, desc]) => (
                <div key={id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem" }}>
                  <div style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)", marginBottom: "0.25rem" }}>{id}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.75)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </Section>
        </motion.div>
      ) : (
        <div style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
          [NO DOCUMENTATION AVAILABLE — DEPLOY A WORKFLOW FIRST]
        </div>
      )}
    </div>
  );
}
