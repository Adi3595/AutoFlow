"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutTemplate, Download, ChevronRight, Search } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  complexity: "Simple" | "Medium" | "Advanced";
  nodes: any[];
  agents: any[];
}

const TEMPLATES: Template[] = [
  {
    id: "tpl_internship",
    title: "Internship Tracker",
    description: "Monitor Gmail for internship emails, summarize content with AI, extract deadlines, log to Notion, and create Google Calendar reminders.",
    category: "Productivity",
    icon: "🎓",
    complexity: "Medium",
    nodes: [
      { id: "n1", type: "trigger", name: "Monitor Gmail for Internship Emails", metadata: { tool: "Gmail", operation: "watch_inbox", description: "Watches inbox for emails containing internship keywords", next: ["n2"] }},
      { id: "n2", type: "action", name: "Summarize Email with Gemini AI", metadata: { tool: "Gemini AI", operation: "summarize_text", description: "Generates a 3-sentence summary of the email content", next: ["n3"] }},
      { id: "n3", type: "transform", name: "Extract Deadline and Company Name", metadata: { tool: "Gemini AI", operation: "extract_entities", description: "Pulls deadline dates and company names from the summary", next: ["n4"] }},
      { id: "n4", type: "action", name: "Create Notion Database Entry", metadata: { tool: "Notion", operation: "create_page", description: "Adds a new row to the Internships tracker database", next: ["n5"] }},
      { id: "n5", type: "action", name: "Add Google Calendar Reminder", metadata: { tool: "Google Calendar", operation: "create_event", description: "Creates a calendar event 3 days before deadline", next: ["n6"] }},
      { id: "n6", type: "output", name: "Send Telegram Confirmation", metadata: { tool: "Telegram", operation: "send_message", description: "Sends a summary message to your personal Telegram", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Email Intelligence Agent", role: "Data Extraction", description: "Parses and summarizes internship emails" },
      { id: "a2", name: "Calendar Coordination Agent", role: "Scheduling", description: "Manages deadlines and calendar events" },
    ]
  },
  {
    id: "tpl_expense",
    title: "Expense Automation",
    description: "Detect expense emails or Slack messages, extract amounts, categorize them, log to a spreadsheet, and alert finance if over budget.",
    category: "Finance",
    icon: "💸",
    complexity: "Medium",
    nodes: [
      { id: "n1", type: "trigger", name: "Monitor Gmail for Receipt Emails", metadata: { tool: "Gmail", operation: "watch_inbox", description: "Detects receipts and expense notifications", next: ["n2"] }},
      { id: "n2", type: "action", name: "Extract Amount and Vendor", metadata: { tool: "Google Document AI", operation: "parse_receipt", description: "OCR-extracts total amount, date, and vendor name", next: ["n3"] }},
      { id: "n3", type: "transform", name: "Categorize Expense Type", metadata: { tool: "Gemini AI", operation: "classify_expense", description: "Categorizes as Travel, Meals, Software, or Other", next: ["n4"] }},
      { id: "n4", type: "condition", name: "Check if Amount Exceeds ₹10,000", metadata: { tool: "Internal Logic", operation: "threshold_check", description: "Compares expense amount against budget limit", on_true: ["n5"], on_false: ["n6"] }},
      { id: "n5", type: "action", name: "Send Slack Alert to Finance Manager", metadata: { tool: "Slack", operation: "post_message", description: "Sends an approval request to #finance channel", next: ["n6"] }},
      { id: "n6", type: "output", name: "Log to Google Sheets", metadata: { tool: "Google Sheets", operation: "append_row", description: "Appends a new expense row to the tracking spreadsheet", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Receipt Parser Agent", role: "Data Extraction", description: "Extracts structured data from receipts and invoices" },
      { id: "a2", name: "Finance Routing Agent", role: "Approval Logic", description: "Handles budget thresholds and approval routing" },
    ]
  },
  {
    id: "tpl_support",
    title: "Customer Support Triage",
    description: "Read support tickets from email, classify urgency with AI, auto-respond to simple queries, and escalate complex issues to Jira.",
    category: "Support",
    icon: "🎧",
    complexity: "Advanced",
    nodes: [
      { id: "n1", type: "trigger", name: "Monitor Support Email Inbox", metadata: { tool: "Gmail", operation: "watch_inbox", description: "Watches for new support ticket emails", next: ["n2"] }},
      { id: "n2", type: "action", name: "Classify Ticket Urgency with AI", metadata: { tool: "Gemini AI", operation: "classify_text", description: "Rates the ticket Low, Medium, or High urgency", next: ["n3"] }},
      { id: "n3", type: "condition", name: "Check if Urgency is High", metadata: { tool: "Internal Logic", operation: "urgency_check", description: "Decides routing based on urgency classification", on_true: ["n4"], on_false: ["n5"] }},
      { id: "n4", type: "action", name: "Create Jira Bug Ticket", metadata: { tool: "Jira", operation: "create_issue", description: "Creates a high-priority Jira issue and assigns to on-call", next: ["n6"] }},
      { id: "n5", type: "action", name: "Generate AI Auto-Reply", metadata: { tool: "Gemini AI", operation: "generate_response", description: "Writes a personalized response for low-urgency tickets", next: ["n6"] }},
      { id: "n6", type: "output", name: "Send Reply and Log to CRM", metadata: { tool: "HubSpot", operation: "create_contact_note", description: "Sends the reply and logs the interaction in HubSpot CRM", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Triage Intelligence Agent", role: "Classification", description: "Classifies and routes support tickets by urgency" },
      { id: "a2", name: "Response Generation Agent", role: "Communication", description: "Generates empathetic, accurate auto-replies" },
    ]
  },
  {
    id: "tpl_crm",
    title: "CRM Automation",
    description: "Detect new leads from form submissions, enrich with LinkedIn data, score them with AI, add to CRM pipeline, and notify sales rep.",
    category: "Sales",
    icon: "🤝",
    complexity: "Advanced",
    nodes: [
      { id: "n1", type: "trigger", name: "Detect New Form Submission via Webhook", metadata: { tool: "Zapier Webhook", operation: "receive_webhook", description: "Triggers when a lead form is submitted on the website", next: ["n2"] }},
      { id: "n2", type: "action", name: "Enrich Lead Data from LinkedIn", metadata: { tool: "LinkedIn API", operation: "get_profile", description: "Pulls company size, role, and industry from LinkedIn", next: ["n3"] }},
      { id: "n3", type: "transform", name: "Score Lead Quality with AI", metadata: { tool: "Gemini AI", operation: "score_lead", description: "Assigns a 0-100 quality score based on ICP fit", next: ["n4"] }},
      { id: "n4", type: "condition", name: "Check if Score > 70", metadata: { tool: "Internal Logic", operation: "score_check", description: "Routes high-quality leads to priority pipeline", on_true: ["n5"], on_false: ["n6"] }},
      { id: "n5", type: "action", name: "Add to Priority Pipeline in HubSpot", metadata: { tool: "HubSpot", operation: "create_deal", description: "Creates a new deal in the Hot Leads pipeline", next: ["n7"] }},
      { id: "n6", type: "output", name: "Add to Nurture Sequence", metadata: { tool: "Mailchimp", operation: "add_to_list", description: "Adds low-scoring leads to a nurture email campaign", next: [] }},
      { id: "n7", type: "output", name: "Notify Sales Rep on Slack", metadata: { tool: "Slack", operation: "post_dm", description: "Sends a DM to the assigned rep with lead details", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Lead Intelligence Agent", role: "Data Enrichment", description: "Enriches and scores incoming leads" },
      { id: "a2", name: "CRM Pipeline Agent", role: "Sales Operations", description: "Manages deal creation and pipeline routing" },
    ]
  },
  {
    id: "tpl_meetings",
    title: "Meeting Summaries",
    description: "Transcribe meeting recordings, generate structured summaries, extract action items, share with team on Slack, and log to Notion.",
    category: "Productivity",
    icon: "📝",
    complexity: "Simple",
    nodes: [
      { id: "n1", type: "trigger", name: "Detect New Recording in Google Drive", metadata: { tool: "Google Drive", operation: "watch_folder", description: "Watches a Drive folder for new .mp3 or .mp4 files", next: ["n2"] }},
      { id: "n2", type: "action", name: "Transcribe Audio with Whisper AI", metadata: { tool: "OpenAI Whisper", operation: "transcribe_audio", description: "Converts audio to text with speaker diarization", next: ["n3"] }},
      { id: "n3", type: "transform", name: "Generate Meeting Summary", metadata: { tool: "Gemini AI", operation: "summarize_text", description: "Produces a 5-bullet structured summary of key decisions", next: ["n4"] }},
      { id: "n4", type: "action", name: "Extract Action Items and Owners", metadata: { tool: "Gemini AI", operation: "extract_tasks", description: "Identifies tasks, responsible persons, and due dates", next: ["n5"] }},
      { id: "n5", type: "action", name: "Post Summary to Slack Channel", metadata: { tool: "Slack", operation: "post_message", description: "Sends formatted summary to #meetings-summaries channel", next: ["n6"] }},
      { id: "n6", type: "output", name: "Log to Notion Meeting Database", metadata: { tool: "Notion", operation: "create_page", description: "Creates a structured meeting page in Notion", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Transcription Agent", role: "Audio Processing", description: "Handles audio transcription and speaker detection" },
      { id: "a2", name: "Summary Intelligence Agent", role: "Content Generation", description: "Generates concise meeting summaries and action items" },
    ]
  },
  {
    id: "tpl_invoice",
    title: "Invoice Processing",
    description: "Detect invoice emails, extract amounts and vendors, check approval thresholds, send for approval, then auto-pay or log pending.",
    category: "Finance",
    icon: "🧾",
    complexity: "Advanced",
    nodes: [
      { id: "n1", type: "trigger", name: "Monitor Gmail for Invoice Emails", metadata: { tool: "Gmail", operation: "watch_inbox", description: "Watches for emails with invoice PDF attachments", next: ["n2"] }},
      { id: "n2", type: "action", name: "Extract Invoice Data from PDF", metadata: { tool: "Google Document AI", operation: "parse_document", description: "OCR-extracts amount, vendor, due date, and line items", next: ["n3"] }},
      { id: "n3", type: "condition", name: "Check if Amount Exceeds $500", metadata: { tool: "Internal Logic", operation: "threshold_check", description: "Routes to approval if above auto-pay threshold", on_true: ["n4"], on_false: ["n5"] }},
      { id: "n4", type: "action", name: "Send Slack Approval Request", metadata: { tool: "Slack", operation: "post_message", description: "Posts interactive approval block to #finance", next: ["n6"] }},
      { id: "n5", type: "action", name: "Auto-Process Payment via Stripe", metadata: { tool: "Stripe", operation: "create_payment", description: "Automatically processes low-value invoices", next: ["n6"] }},
      { id: "n6", type: "output", name: "Log Invoice to Accounting Database", metadata: { tool: "PostgreSQL", operation: "insert_row", description: "Stores invoice record with status in the accounts table", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Invoice Intelligence Agent", role: "Data Extraction", description: "Parses invoice documents and extracts structured data" },
      { id: "a2", name: "Payment Processing Agent", role: "Finance Automation", description: "Handles payment routing and approval workflows" },
    ]
  },
  {
    id: "tpl_social",
    title: "Social Media Automation",
    description: "Generate daily social posts from RSS feeds using AI, schedule them, post to Twitter/LinkedIn, and track engagement.",
    category: "Marketing",
    icon: "📱",
    complexity: "Simple",
    nodes: [
      { id: "n1", type: "trigger", name: "Fetch Latest Articles from RSS Feed", metadata: { tool: "RSS Feed", operation: "fetch_feed", description: "Retrieves the top 3 articles from configured feeds", next: ["n2"] }},
      { id: "n2", type: "transform", name: "Summarize Article for Social Post", metadata: { tool: "Gemini AI", operation: "generate_text", description: "Creates an engaging 280-character Twitter post", next: ["n3"] }},
      { id: "n3", type: "action", name: "Schedule Post for Optimal Time", metadata: { tool: "Buffer", operation: "create_scheduled_post", description: "Schedules post for the highest engagement time slot", next: ["n4"] }},
      { id: "n4", type: "action", name: "Post to Twitter via API", metadata: { tool: "Twitter API", operation: "create_tweet", description: "Publishes the tweet with relevant hashtags", next: ["n5"] }},
      { id: "n5", type: "action", name: "Cross-Post to LinkedIn", metadata: { tool: "LinkedIn API", operation: "create_post", description: "Adapts and posts a longer version to LinkedIn", next: ["n6"] }},
      { id: "n6", type: "output", name: "Log Performance to Analytics Sheet", metadata: { tool: "Google Sheets", operation: "append_row", description: "Records post URL, reach, and engagement metrics", next: [] }},
    ],
    agents: [
      { id: "a1", name: "Content Generation Agent", role: "Creative Writing", description: "Creates platform-optimized social media content" },
      { id: "a2", name: "Distribution Agent", role: "Publishing", description: "Manages multi-platform posting and scheduling" },
    ]
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
const COMPLEXITY_COLORS: Record<string, string> = { Simple: "#50fa7b", Medium: "#ffb86c", Advanced: "#ff79c6" };

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [importing, setImporting] = useState<string | null>(null);

  const filtered = TEMPLATES.filter(t =>
    (category === "All" || t.category === category) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const importTemplate = (template: Template) => {
    setImporting(template.id);
    const existing: any[] = JSON.parse(localStorage.getItem("autoflow_workflows") || "[]");
    const newWorkflow = {
      id: `wf_${Date.now()}`,
      intent: template.description,
      createdAt: new Date().toISOString(),
      nodes: template.nodes,
      agents: template.agents,
      execution_logs: [],
      explanation: `I'll execute the ${template.title} template, ${template.description.toLowerCase()}`,
    };
    localStorage.setItem("autoflow_workflows", JSON.stringify([newWorkflow, ...existing]));
    setTimeout(() => { setImporting(null); router.push("/dashboard"); }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "transparent", color: "var(--color-text)" }}>
      {/* Header */}
      <header style={{ padding: "1.25rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <LayoutTemplate size={18} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "var(--font-display)" }}>
            AutoFlow<span style={{ color: "var(--color-accent)" }}>.</span>Templates
          </h1>
          <span style={{ fontSize: "var(--text-xs)", background: "rgba(178,213,229,0.08)", border: "1px solid rgba(178,213,229,0.2)", borderRadius: "var(--radius-pill)", padding: "0.2rem 0.8rem", color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>
            {TEMPLATES.length} ready-to-use
          </span>
        </div>
        <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
          <motion.button whileHover={{ x: -3 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
            <ArrowLeft size={14} /> DASHBOARD
          </motion.button>
        </Link>
      </header>

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        {/* Search + filter */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <Search size={14} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-faint)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(178,213,229,0.15)", borderRadius: "var(--radius-md)", padding: "0.65rem 0.9rem 0.65rem 2.4rem", color: "#fff", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ background: category === cat ? "rgba(178,213,229,0.12)" : "rgba(255,255,255,0.02)", border: `1px solid ${category === cat ? "rgba(178,213,229,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: "var(--radius-pill)", padding: "0.4rem 1rem", color: category === cat ? "var(--color-accent)" : "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", cursor: "pointer", transition: "all 0.15s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((template, i) => (
            <motion.div key={template.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius-lg)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "2rem" }}>{template.icon}</div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: COMPLEXITY_COLORS[template.complexity], background: `${COMPLEXITY_COLORS[template.complexity]}15`, border: `1px solid ${COMPLEXITY_COLORS[template.complexity]}30`, borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem" }}>{template.complexity}</span>
                  <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)", background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-pill)", padding: "0.15rem 0.6rem" }}>{template.category}</span>
                </div>
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "var(--text-lg)", fontWeight: 600, color: "#fff", fontFamily: "var(--font-display)" }}>{template.title}</h3>
                <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{template.description}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {Array.from(new Set(template.nodes.map((n: any) => n.metadata?.tool).filter(Boolean))).slice(0, 4).map((tool: any) => (
                  <span key={tool} style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)", background: "rgba(255,255,255,0.04)", borderRadius: "3px", padding: "0.15rem 0.5rem" }}>{tool}</span>
                ))}
                {template.nodes.length > 4 && <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--color-text-faint)" }}>+{template.nodes.length - 4} more</span>}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => importTemplate(template)} disabled={importing === template.id}
                  style={{ flex: 1, padding: "0.65rem", background: importing === template.id ? "rgba(80,250,123,0.15)" : "var(--color-accent)", color: importing === template.id ? "#50fa7b" : "#020202", border: "none", borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "all 0.2s" }}>
                  {importing === template.id ? "✓ IMPORTED" : <><Download size={14}/> IMPORT</>}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
