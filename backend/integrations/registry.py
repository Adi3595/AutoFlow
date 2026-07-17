from typing import Optional
from integrations.base import BaseIntegration
from integrations.slack import SlackIntegration
from integrations.github import GitHubIntegration
from integrations.notion import NotionIntegration

class IntegrationRegistry:
    """
    Central registry mapping tool names to real integration handlers.
    """
    
    _registry = {
        "slack": SlackIntegration,
        "github": GitHubIntegration,
        "notion": NotionIntegration,
    }

    @classmethod
    def get_integration(cls, tool_name: str) -> Optional[BaseIntegration]:
        """
        Returns an instance of the integration if it exists and is configured, 
        otherwise returns None.
        """
        if not tool_name:
            return None
            
        tool_key = str(tool_name).strip().lower()
        integration_cls = cls._registry.get(tool_key)
        
        if integration_cls:
            return integration_cls()
            
        return None
