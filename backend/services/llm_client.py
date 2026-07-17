import os
import json
import uuid
import urllib.request
import urllib.error
from typing import List, Tuple
from models.schemas import WorkflowNode, Agent

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class LLMClient:
    
    @staticmethod
    def _call_gemini(prompt: str, json_mode: bool = False) -> str:
        """
        Kept the method name _call_gemini so we don't have to rename all calls, 
        but we are actually using Groq for massive rate-limit bypassing.
        """
        if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_key_here":
            return '{"error": "GROQ_API_KEY not found"}' if json_mode else "ERROR: GROQ_API_KEY not found"

        url = "https://api.groq.com/openai/v1/chat/completions"
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
            # Groq requires the prompt to explicitly mention JSON if response_format is set
            payload["messages"][0]["content"] += "\nEnsure you output in valid JSON."
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {GROQ_API_KEY}'
            },
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                result_json = json.loads(response.read().decode('utf-8'))
                
            raw_text = result_json['choices'][0]['message']['content'].strip()
            
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

    # ─── Feature 1: AI Workflow Explanation ───────────────────────
    @staticmethod
    def generate_explanation(intent: str, nodes: list) -> str:
        node_names = [getattr(n, 'name', n.get('name', '') if isinstance(n, dict) else '') for n in nodes]
        steps_text = "\n".join(f"  {i+1}. {name}" for i, name in enumerate(node_names))
        prompt = f"""
You are AutoFlow, an AI workflow operating system.
The user asked you to automate: "{intent}"
You generated a workflow with these steps:
{steps_text}
Write a friendly, clear explanation (2-4 sentences) of what AutoFlow will do.
Use "I'll" to personify AutoFlow. Be specific about tools and actions. No bullet points.
Return plain text only.
"""
        try:
            return LLMClient._call_gemini(prompt, json_mode=False)
        except Exception:
            return f"I'll automate this workflow by executing {len(nodes)} intelligent steps to fulfill your request."

    # ─── Feature 2: Workflow Simulation ───────────────────────────
    @staticmethod
    def generate_simulation(intent: str, nodes: list) -> dict:
        node_list = [{"id": getattr(n, 'id', n.get('id', '') if isinstance(n, dict) else ''), "name": getattr(n, 'name', n.get('name', '') if isinstance(n, dict) else ''), "type": getattr(n, 'type', n.get('type', '') if isinstance(n, dict) else ''), "tool": (getattr(n, 'metadata', {}) or (n.get('metadata', {}) if isinstance(n, dict) else {})).get("tool", "")} for n in nodes]
        prompt = f"""
You are an AI workflow simulator. Analyze this workflow for: "{intent}"
Nodes: {json.dumps(node_list)}
Return ONLY valid JSON (no markdown) with schema:
{{"total_estimated_ms":4200,"services_involved":["Gmail","Notion"],"warnings":["Gmail OAuth may expire"],"dependency_summary":"Linear pipeline description","steps":[{{"node_id":"node_001","node_name":"Node Name","estimated_duration_ms":800,"tool":"Gmail","possible_output":"Email object with metadata"}}]}}
Generate realistic estimates and 1-3 actionable warnings.
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            return json.loads(raw)
        except Exception:
            return {"total_estimated_ms": len(nodes)*800,"services_involved": list({n["tool"] for n in node_list if n["tool"]}),"warnings":["Simulation unavailable — using estimates"],"dependency_summary":f"Sequential pipeline of {len(nodes)} nodes","steps":[{"node_id":n["id"],"node_name":n["name"],"estimated_duration_ms":800,"tool":n["tool"],"possible_output":"Data passed to next node"} for n in node_list]}

    # ─── Feature 4: AI Suggestions ────────────────────────────────
    @staticmethod
    def generate_suggestions(intent: str, nodes: list) -> list:
        node_names = [getattr(n, 'name', n.get('name', '') if isinstance(n, dict) else '') for n in nodes]
        prompt = f"""
You are an AI workflow consultant reviewing automation for: "{intent}"
Current nodes: {json.dumps(node_names)}
Generate 4-6 intelligent improvement suggestions. Return ONLY valid JSON array (no markdown):
[{{"title":"Add Retry Logic","description":"Retry failed API calls up to 3 times with exponential backoff.","category":"reliability","priority":"high"}}]
Categories: reliability|notifications|analytics|approval|optimization|security. Priorities: high|medium|low.
Make suggestions specific to this workflow.
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            return json.loads(raw)
        except Exception:
            return [{"title":"Add Retry Logic","description":"Retry failed steps automatically.","category":"reliability","priority":"high"},{"title":"Add Completion Notification","description":"Notify via Slack when workflow finishes.","category":"notifications","priority":"medium"}]

    # ─── Feature 15: Auto Documentation ───────────────────────────
    @staticmethod
    def generate_documentation(intent: str, nodes: list, agents: list) -> dict:
        node_data = [{"id": getattr(n, 'id', n.get('id', '') if isinstance(n, dict) else ''), "name": getattr(n, 'name', n.get('name', '') if isinstance(n, dict) else ''), "type": getattr(n, 'type', n.get('type', '') if isinstance(n, dict) else ''), "tool": (getattr(n, 'metadata', {}) or {}).get("tool", "")} for n in nodes]
        agent_names = [getattr(a, 'name', a.get('name', '') if isinstance(a, dict) else '') for a in agents]
        prompt = f"""
Generate workflow documentation for: "{intent}"
Nodes: {json.dumps(node_data[:8])} Agents: {json.dumps(agent_names)}
Return ONLY valid JSON (no markdown):
{{"summary":"2-3 sentence description","execution_sequence":["Step 1: ..."],"inputs":["Gmail inbox access"],"outputs":["Notion entry"],"connected_integrations":["Gmail","Notion"],"node_descriptions":{{"node_001":"What this node does"}}}}
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            return json.loads(raw)
        except Exception:
            tools = list({n["tool"] for n in node_data if n["tool"]})
            return {"summary":f"Automates: {intent}. Executes {len(nodes)} steps.","execution_sequence":[f"Step {i+1}: {n['name']}" for i,n in enumerate(node_data)],"inputs":["User intent","API credentials"],"outputs":["Workflow results"],"connected_integrations":tools,"node_descriptions":{n["id"]:n["name"] for n in node_data}}

    # ─── Feature 3: Conversational Workflow Editing ────────────────
    @staticmethod
    def edit_workflow_with_nl(intent: str, nodes: list, edit_command: str) -> "tuple":
        node_data = [{"id": getattr(n,'id',n.get('id','')), "type": getattr(n,'type',n.get('type','')), "name": getattr(n,'name',n.get('name','')), "metadata": getattr(n,'metadata',n.get('metadata',{}))} for n in nodes]
        prompt = f"""
You are an AI workflow editor. Apply this edit to the workflow.
Intent: "{intent}" | Edit command: "{edit_command}"
Current nodes: {json.dumps(node_data)}
Return ONLY valid JSON (no markdown):
{{"nodes":[{{"id":"node_001","type":"trigger","name":"Node Name","metadata":{{"tool":"Gmail","operation":"watch_inbox","description":"What it does","next":["node_002"]}}}}],"agents":[{{"id":"agent_001","name":"Agent Name","role":"Role","description":"What it does"}}],"change_description":"What was changed"}}
Rules: preserve existing nodes unless explicitly removed. Add new nodes for new steps. Keep 5-10 nodes total. Update next arrays for DAG integrity.
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            data = json.loads(raw)
            new_nodes = [WorkflowNode(id=item.get("id",f"node_{uuid.uuid4().hex[:6]}"),type=item.get("type","action"),name=item.get("name","Node"),metadata=item.get("metadata",{})) for item in data.get("nodes",[])]
            new_agents = [Agent(id=item.get("id",f"agent_{uuid.uuid4().hex[:6]}"),name=item.get("name","Agent"),role=item.get("role","Execution"),description=item.get("description","Executes tasks.")) for item in data.get("agents",[])]
            return new_nodes, new_agents, data.get("change_description", f"Applied: {edit_command}")
        except Exception as e:
            print(f"[ERROR] Conversational edit failed: {e}")
            orig = [WorkflowNode(id=n["id"],type=n["type"],name=n["name"],metadata=n["metadata"]) for n in node_data]
            return orig, [], f"Edit could not be applied: {str(e)}"
