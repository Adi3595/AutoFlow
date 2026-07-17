import uuid
from typing import List
from models.schemas import (
    WorkflowNode, DeployResponse, EditRequest, EditResponse, SimulateRequest
)
from services.llm_client import LLMClient
from execution_engine.engine import ExecutionEngine


class Orchestrator:

    @staticmethod
    def parse_intent_to_graph(intent: str) -> DeployResponse:
        """
        Calls Gemini to parse intent into a structured execution DAG,
        runs it, and enriches the response with explanation, simulation,
        suggestions, and auto-documentation.
        """
        workflow_id = f"wf_{uuid.uuid4().hex[:8]}"

        nodes, agents = LLMClient.generate_workflow_from_intent(intent)
        execution_logs = ExecutionEngine.run(intent, nodes)

        # Enrich response with all new AI features (non-blocking — fallback on error)
        explanation = LLMClient.generate_explanation(intent, nodes)
        simulation_data = LLMClient.generate_simulation(intent, nodes)
        suggestions_data = LLMClient.generate_suggestions(intent, nodes)
        documentation_data = LLMClient.generate_documentation(intent, nodes, agents)

        # Parse enrichment data into schema models
        from models.schemas import (
            SimulationResult, SimulationStep, WorkflowSuggestion,
            WorkflowDocumentation
        )

        try:
            simulation = SimulationResult(
                total_estimated_ms=simulation_data.get("total_estimated_ms", 3000),
                services_involved=simulation_data.get("services_involved", []),
                warnings=simulation_data.get("warnings", []),
                dependency_summary=simulation_data.get("dependency_summary", ""),
                steps=[
                    SimulationStep(**step) for step in simulation_data.get("steps", [])
                ]
            )
        except Exception:
            simulation = None

        try:
            suggestions = [
                WorkflowSuggestion(**s) for s in suggestions_data
                if isinstance(s, dict)
            ]
        except Exception:
            suggestions = []

        try:
            documentation = WorkflowDocumentation(**documentation_data)
        except Exception:
            documentation = None

        return DeployResponse(
            status="success",
            workflow_id=workflow_id,
            nodes=nodes,
            agents=agents,
            execution_logs=execution_logs,
            message="DAG compiled and executed successfully via Gemini 2.5 Flash.",
            explanation=explanation,
            simulation=simulation,
            suggestions=suggestions,
            documentation=documentation,
        )

    @staticmethod
    def edit_workflow(request: EditRequest) -> EditResponse:
        """
        Applies a natural language edit command to an existing workflow.
        """
        node_dicts = request.nodes

        new_nodes, new_agents, change_description = LLMClient.edit_workflow_with_nl(
            intent=request.intent,
            nodes=node_dicts,
            edit_command=request.edit_command
        )

        explanation = LLMClient.generate_explanation(request.intent, new_nodes)

        return EditResponse(
            status="success",
            workflow_id=request.workflow_id,
            nodes=new_nodes,
            agents=new_agents,
            change_description=change_description,
            explanation=explanation,
        )

    @staticmethod
    def simulate_workflow(request: SimulateRequest) -> dict:
        """
        Returns a simulation preview without executing the workflow.
        """
        simulation_data = LLMClient.generate_simulation(
            intent=request.intent,
            nodes=request.nodes
        )
        return simulation_data
