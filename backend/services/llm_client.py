import os
import json
import uuid
import urllib.request
import urllib.error
from typing import List, Tuple
from models.schemas import WorkflowNode, Agent

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class LLMClient:
    
    @staticmethod
    def _call_gemini(prompt: str, json_mode: bool = False) -> str:
        if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_key_here":
            return '{"error": "GEMINI_API_KEY not found"}' if json_mode else "ERROR: GEMINI_API_KEY not found"

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        if json_mode:
            payload["generationConfig"] = {"responseMimeType": "application/json"}
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                result_json = json.loads(response.read().decode('utf-8'))
                
            raw_text = result_json['candidates'][0]['content']['parts'][0]['text'].strip()
            
            if json_mode:
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                    
            return raw_text
        except urllib.error.URLError as e:
            raise Exception(f"Network Error: {e}")
        except (KeyError, IndexError) as e:
            raise Exception(f"Unexpected response structure: {e}")


    @staticmethod
    def generate_workflow_from_intent(intent: str) -> Tuple[List[WorkflowNode], List[Agent]]:
        prompt = f"""
You are an expert workflow automation architect. The user wants to automate: "{intent}"

Your task is to design a complete, production-ready automation workflow as a Directed Acyclic Graph (DAG).

STRICT REQUIREMENTS:
1. Generate between 5 and 10 nodes. Never fewer than 5.
2. Every workflow MUST start with a "trigger" node and end with at least one "output" node.
3. Use REAL tool names (Gmail, Slack, Notion, Jira, GitHub, PostgreSQL, PagerDuty, Twilio, Stripe, etc.)
4. Node types must be one of: "trigger", "action", "condition", "transform", "output"
5. Include a "condition" node whenever the workflow has branching logic (if/else, check, validate).
6. Each node must have a clear, specific name describing the exact operation (e.g. "Parse Gmail Attachment for Invoice", NOT just "Parse Email").
7. The metadata for each node must include: "tool" (the service used), "operation" (the API call or action), and "description" (1 sentence explaining what it does).

NODE SEQUENCE RULES:
- trigger → actions/transforms → optional conditions → outputs
- Conditions must have at least two downstream paths (e.g., "on_true", "on_false")
- The workflow must be logically complete — every path must end with an output node.

Also generate 2-4 specialized AI Agents. Each agent is responsible for a domain of the workflow.

Output ONLY valid JSON. No markdown, no explanation. Follow this exact schema:
{{
  "nodes": [
    {{
      "id": "node_001",
      "type": "trigger",
      "name": "Monitor Gmail for New Invoices",
      "metadata": {{
        "tool": "Gmail",
        "operation": "watch_inbox",
        "description": "Watches the inbox for emails with attachments matching invoice keywords.",
        "next": ["node_002"]
      }}
    }},
    {{
      "id": "node_002",
      "type": "action",
      "name": "Extract Invoice Data from Attachment",
      "metadata": {{
        "tool": "Google Document AI",
        "operation": "parse_document",
        "description": "Uses Document AI to extract line items, totals, and vendor from the PDF.",
        "next": ["node_003"]
      }}
    }},
    {{
      "id": "node_003",
      "type": "condition",
      "name": "Check if Invoice Total > $500",
      "metadata": {{
        "tool": "Internal Logic",
        "operation": "threshold_check",
        "description": "Evaluates if the extracted invoice total exceeds the approval threshold.",
        "on_true": ["node_004"],
        "on_false": ["node_005"]
      }}
    }},
    {{
      "id": "node_004",
      "type": "action",
      "name": "Send Slack Approval Request to Finance",
      "metadata": {{
        "tool": "Slack",
        "operation": "post_message",
        "description": "Posts an interactive approval card to the #finance Slack channel.",
        "next": ["node_006"]
      }}
    }},
    {{
      "id": "node_005",
      "type": "output",
      "name": "Auto-Approve and Save to Notion Database",
      "metadata": {{
        "tool": "Notion",
        "operation": "create_page",
        "description": "Automatically logs small invoices to the accounting Notion database.",
        "next": []
      }}
    }},
    {{
      "id": "node_006",
      "type": "output",
      "name": "Log Pending Approval to PostgreSQL",
      "metadata": {{
        "tool": "PostgreSQL",
        "operation": "insert_row",
        "description": "Records the invoice as pending in the approvals table.",
        "next": []
      }}
    }}
  ],
  "agents": [
    {{
      "id": "agent_001",
      "name": "Document Intelligence Agent",
      "role": "Data Extraction",
      "description": "Specializes in parsing structured data from PDFs, emails, and spreadsheets using OCR and NLP."
    }},
    {{
      "id": "agent_002",
      "name": "Finance Routing Agent",
      "role": "Decision & Approval",
      "description": "Handles conditional logic, threshold checks, and approval routing across financial workflows."
    }}
  ]
}}

Now generate a complete workflow for: "{intent}"
"""
        try:
            raw_text = LLMClient._call_gemini(prompt, json_mode=True)
            data = json.loads(raw_text)
            
            if "error" in data:
                return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="API Error", metadata={"error": data["error"]})], []

            nodes_data = data.get("nodes", [])
            agents_data = data.get("agents", [])
            
            nodes = []
            for item in nodes_data:
                metadata = item.get("metadata", {})
                node = WorkflowNode(
                    id=item.get("id", f"node_{uuid.uuid4().hex[:6]}"),
                    type=item.get("type", "action"),
                    name=item.get("name", "Unknown Action"),
                    metadata=metadata
                )
                nodes.append(node)
                
            agents = []
            for item in agents_data:
                agent = Agent(
                    id=item.get("id", f"agent_{uuid.uuid4().hex[:6]}"),
                    name=item.get("name", "Generic Agent"),
                    role=item.get("role", "Execution"),
                    description=item.get("description", "Executes tasks.")
                )
                agents.append(agent)
                
            return nodes, agents

        except Exception as e:
            print(f"[ERROR] LLM Workflow Generation Failed: {e}")
            return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="LLM Error", metadata={"error": str(e)})], []

    @staticmethod
    def execute_action(action_name: str, intent: str, previous_context: str = "") -> str:
        prompt = f"""
You are the execution agent for an AI workflow operating system.
Your current task is to execute the following action node: "{action_name}"

The overall user intent is: "{intent}"
Previous Execution Context (if any): "{previous_context}"

Perform the action requested by the node. If it requires writing an email, write the email. If it requires summarizing text, summarize it. If it requires making a decision, make it.
Do not wrap your response in markdown. Just return the pure text result of the execution.
"""
        try:
            return LLMClient._call_gemini(prompt, json_mode=False)
        except Exception as e:
            return f"Execution Failed: {e}"

    @staticmethod
    def heal_action(action_name: str, intent: str, error: str, previous_context: str = "") -> str:
        prompt = f"""
You are the execution agent for an AI workflow operating system.
You previously tried to execute the node: "{action_name}" for the intent: "{intent}"
However, it FAILED with this error: "{error}"

Previous Execution Context (if any): "{previous_context}"

Analyze the error, correct your approach, bypass the failure, and return a successful execution result.
Do not wrap your response in markdown. Just return the pure text result of the execution.
"""
        try:
            return LLMClient._call_gemini(prompt, json_mode=False)
        except Exception as e:
            return f"Self-Healing Failed: {e}"
