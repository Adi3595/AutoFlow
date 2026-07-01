from services.llm_client import LLMClient

class UniversalAgent:
    @staticmethod
    def execute(node_name: str, intent: str, context: str = "") -> str:
        """
        The Universal Agent takes a specific DAG node and dynamically uses
        Gemini to 'execute' the logic required by that node.
        """
        return LLMClient.execute_action(action_name=node_name, intent=intent, previous_context=context)
