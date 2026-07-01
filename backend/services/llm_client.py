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
    def generate_workflow_from_intent(intent: str) -> List[WorkflowNode]:
        if not GEMINI_API_KEY:
            print("[WARNING] GEMINI_API_KEY not found. Falling back to mock data.")
            return [
                WorkflowNode(
                    id=f"node_{uuid.uuid4().hex[:6]}",
                    type="trigger",
                    name="API Key Missing",
                    metadata={"error": "Please provide GEMINI_API_KEY in backend environment"}
                )
            ]

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
            
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
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                result_json = json.loads(response.read().decode('utf-8'))
                
            # Parse Gemini API response structure
            try:
                raw_text = result_json['candidates'][0]['content']['parts'][0]['text'].strip()
            except (KeyError, IndexError):
                raise ValueError("Unexpected response structure from Gemini API")
            
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            nodes_data = json.loads(raw_text)
            
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
                
            return nodes

        except urllib.error.URLError as e:
            print(f"[ERROR] LLM Network Failed: {e}")
            return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="Network Error", metadata={"error": str(e)})]
        except Exception as e:
            print(f"[ERROR] LLM Generation Failed: {e}")
            return [WorkflowNode(id=f"node_{uuid.uuid4().hex[:6]}", type="action", name="LLM Error", metadata={"error": str(e)})]
