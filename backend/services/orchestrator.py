import uuid
from typing import List
from models.schemas import WorkflowNode, DeployResponse
from services.llm_client import LLMClient

class Orchestrator:
    @staticmethod
    def parse_intent_to_graph(intent: str) -> DeployResponse:
        """
        Calls the Gemini 2.5 Flash model to parse the natural language intent 
        into a structured execution DAG.
        """
        
        # Generate a unique workflow ID
        workflow_id = f"wf_{uuid.uuid4().hex[:8]}"
        
        # Call the real LLM engine!
        nodes = LLMClient.generate_workflow_from_intent(intent)
        
        return DeployResponse(
            status="success",
            workflow_id=workflow_id,
            nodes=nodes,
            message="DAG compiled successfully via Gemini 2.5 Flash."
        )
