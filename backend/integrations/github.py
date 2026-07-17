import os
import json
import urllib.request
import urllib.error
from integrations.base import BaseIntegration
from services.llm_client import LLMClient

class GitHubIntegration(BaseIntegration):
    def execute(self, action_name: str, intent: str, previous_context: str = "") -> str:
        api_key = os.getenv("GITHUB_API_KEY")
        if not api_key:
            return f"[SIMULATED] (GITHUB_API_KEY not found). Executed: {action_name}"

        prompt = f"""
You are translating a natural language action into a GitHub API payload to create an issue.
Action: "{action_name}"
Intent: "{intent}"
Context: "{previous_context}"

Extract the 'owner', 'repo', 'title', and 'body'.
If you don't know the owner/repo, use 'Adi3595' for owner and 'AutoFlow' for repo.
Return ONLY valid JSON (no markdown):
{{"owner": "Adi3595", "repo": "AutoFlow", "title": "Issue title", "body": "Issue description"}}
"""
        try:
            raw = LLMClient._call_gemini(prompt, json_mode=True)
            payload = json.loads(raw)
            owner = payload.get("owner", "Adi3595")
            repo = payload.get("repo", "AutoFlow")
            title = payload.get("title", "Automated Issue")
            body = payload.get("body", "Created via AutoFlow OS.")
            
            req = urllib.request.Request(
                f'https://api.github.com/repos/{owner}/{repo}/issues',
                data=json.dumps({"title": title, "body": body}).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'AutoFlow-OS'
                },
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                if response.status == 201:
                    result = json.loads(response.read().decode('utf-8'))
                    issue_url = result.get("html_url")
                    return f"[REAL API SUCCESS] Created GitHub Issue in {owner}/{repo}: {issue_url}"
                else:
                    return f"[REAL API ERROR] GitHub API failed with status {response.status}"
                    
        except urllib.error.HTTPError as e:
            return f"[REAL API ERROR] GitHub API HTTP Error: {e.code} - {e.read().decode('utf-8')}"
        except Exception as e:
            return f"[REAL API EXCEPTION] Failed to execute GitHub action: {e}"
