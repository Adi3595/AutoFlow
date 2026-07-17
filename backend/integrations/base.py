from abc import ABC, abstractmethod

class BaseIntegration(ABC):
    """
    Base class for all real API integrations.
    """
    
    @abstractmethod
    def execute(self, action_name: str, intent: str, previous_context: str = "", credentials: dict = None) -> str:
        """
        Translates the action description into concrete API calls and executes them.
        Returns a string representation of the execution result.
        """
        pass
