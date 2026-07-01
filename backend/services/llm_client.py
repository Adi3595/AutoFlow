import os
import json
import uuid
import urllib.request
import urllib.error
from typing import List
from models.schemas import WorkflowNode

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
    def generate_workflow_from_intent(intent: str) -> List[WorkflowNode]:
        prompt = f"""
You are an intelligent workflow orchestration engine.
The user has provided the following intent: "{intent}"

Generate a Directed Acyclic Graph (DAG) representing the sequence of operations required to fulfill this intent.

Output exactly valid JSON representing a list of nodes. No markdown wrapping.
Example structure:
[
  {{
    "id": "node_123",
    "type": "trigger",
    "name": "Wait for trigger event",
    "metadata": {{"key": "value"}}
  }},
  {{
    "id": "node_456",
    "type": "action",
    "name": "Perform an action",
    "metadata": {{}}
  }}
]
"""
        try:
            raw_text = LLMClient._call_gemini(prompt, json_mode=True)
            nodes_data = json.loads(raw_text)
            
            nodes = []
            if isinstance(nodes_data, dict) and "error" in nodes_data:
                return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="API Error", metadata={"error": nodes_data["error"]})]

            for item in nodes_data:
                metadata = item.get("metadata", {})
                node = WorkflowNode(
                    id=item.get("id", f"node_{uuid.uuid4().hex[:6]}"),
                    type=item.get("type", "action"),
                    name=item.get("name", "Unknown Action"),
                    metadata=metadata
                )
                nodes.append(node)
                
            return nodes

        except Exception as e:
            print(f"[ERROR] LLM Workflow Generation Failed: {e}")
            return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="LLM Error", metadata={"error": str(e)})]

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
