import os
import json
import urllib.request
import urllib.error
from integrations.base import BaseIntegration
from services.llm_client import LLMClient

class NotionIntegration(BaseIntegration):
    def execute(self, action_name: str, intent: str, previous_context: str = "", credentials: dict = None) -> str:
        credentials = credentials or {}
        api_key = credentials.get("NOTION_API_KEY") or os.getenv("NOTION_API_KEY")
        if not api_key:
            return f"[SIMULATED] (NOTION_API_KEY not found). Executed: {action_name}"

        # We assume NOTION_PAGE_ID is provided by the user in env for testing.
        parent_page_id = os.getenv("NOTION_PAGE_ID")
        
        prompt = f"""
You are translating a natural language action into a Notion API payload to append a block (paragraph) to a page.
Action: "{action_name}"
Intent: "{intent}"
Context: "{previous_context}"

Extract the 'text' to write to Notion.
Return ONLY valid JSON (no markdown):
{{"text": "Content to write to Notion database or page"}}
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            payload = json.loads(raw)
            text = payload.get("text", "Automated entry from AutoFlow OS")
            
            if not parent_page_id:
                return f"[REAL API ERROR] NOTION_PAGE_ID not found in environment. Cannot append '{text}'."

            notion_payload = {
                "children": [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [
                                {
                                    "type": "text",
                                    "text": {
                                        "content": text
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
            
            req = urllib.request.Request(
                f'https://api.notion.com/v1/blocks/{parent_page_id}/children',
                data=json.dumps(notion_payload).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                method='PATCH'
            )
            
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    return f"[REAL API SUCCESS] Appended text to Notion page {parent_page_id}: '{text}'"
                else:
                    return f"[REAL API ERROR] Notion API failed with status {response.status}"
                    
        except urllib.error.HTTPError as e:
            return f"[REAL API ERROR] Notion API HTTP Error: {e.code} - {e.read().decode('utf-8')}"
        except Exception as e:
            return f"[REAL API EXCEPTION] Failed to execute Notion action: {e}"
