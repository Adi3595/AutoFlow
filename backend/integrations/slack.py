import os
import json
import urllib.request
import urllib.error
from integrations.base import BaseIntegration
from services.llm_client import LLMClient

class SlackIntegration(BaseIntegration):
    def execute(self, action_name: str, intent: str, previous_context: str = "", credentials: dict = None) -> str:
        credentials = credentials or {}
        api_key = credentials.get("SLACK_API_KEY") or os.getenv("SLACK_API_KEY")
        if not api_key:
            return f"[SIMULATED] (SLACK_API_KEY not found). Executed: {action_name}"

        prompt = f"""
You are translating a natural language action into a Slack API payload.
Action: "{action_name}"
Intent: "{intent}"
Context: "{previous_context}"

Extract the 'channel' (e.g. '#general') and 'text' (the message to send).
Return ONLY valid JSON (no markdown):
{{"channel": "#finance", "text": "Hello world"}}
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            payload = json.loads(raw)
            channel = payload.get("channel", "#general")
            text = payload.get("text", "Automated message from AutoFlow OS")
            
            req = urllib.request.Request(
                'https://slack.com/api/chat.postMessage',
                data=json.dumps({"channel": channel, "text": text}).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                if result.get("ok"):
                    return f"[REAL API SUCCESS] Sent Slack message to {channel}: '{text}'"
                else:
                    return f"[REAL API ERROR] Slack API returned error: {result.get('error')}"
                    
        except Exception as e:
            return f"[REAL API EXCEPTION] Failed to execute Slack action: {e}"
