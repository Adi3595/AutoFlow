import uuid
from typing import List
from models.schemas import WorkflowNode, DeployResponse
from services.llm_client import LLMClient
from execution_engine.engine import ExecutionEngine

class Orchestrator:
    @staticmethod
    def parse_intent_to_graph(intent: str) -> DeployResponse:
        """
        Calls the Gemini 2.5 Flash model to parse the natural language intent 
        into a structured execution DAG, and then executes it.
        """
        workflow_id = f"wf_{uuid.uuid4().hex[:8]}"
        
        nodes = LLMClient.generate_workflow_from_intent(intent)
        execution_logs = ExecutionEngine.run(intent, nodes)
        
        return DeployResponse(
            status="success",
            workflow_id=workflow_id,
            nodes=nodes,
            execution_logs=execution_logs,
            message="DAG compiled and executed successfully via Gemini 2.5 Flash."
        )
