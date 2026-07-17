from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DeployRequest(BaseModel):
    intent: str = Field(..., min_length=10, max_length=2000, description="Natural language intent describing the desired workflow")

class EditRequest(BaseModel):
    workflow_id: str
    intent: str
    nodes: List[Dict[str, Any]]
    edit_command: str = Field(..., min_length=3, max_length=500)

class SimulateRequest(BaseModel):
    intent: str
    nodes: List[Dict[str, Any]]

class WorkflowNode(BaseModel):
    id: str
    type: str = Field(..., description="trigger | action | condition | transform | output")
    name: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Agent(BaseModel):
    id: str
    name: str
    role: str
    description: str
    status: Optional[str] = "idle"
    current_task: Optional[str] = None

class SimulationStep(BaseModel):
    node_id: str
    node_name: str
    estimated_duration_ms: int
    tool: Optional[str] = None
    possible_output: Optional[str] = None

class SimulationResult(BaseModel):
    total_estimated_ms: int
    services_involved: List[str]
    warnings: List[str]
    steps: List[SimulationStep]
    dependency_summary: str

class WorkflowSuggestion(BaseModel):
    title: str
    description: str
    category: str  # "reliability" | "notifications" | "analytics" | "approval" | "optimization"
    priority: str  # "high" | "medium" | "low"

class WorkflowDocumentation(BaseModel):
    summary: str
    execution_sequence: List[str]
    inputs: List[str]
    outputs: List[str]
    connected_integrations: List[str]
    node_descriptions: Dict[str, str]

class WorkflowVersion(BaseModel):
    version: int
    saved_at: str
    intent: str
    nodes: List[Dict[str, Any]]
    change_summary: str

class DeployResponse(BaseModel):
    status: str
    workflow_id: str
    nodes: List[WorkflowNode]
    agents: List[Agent] = Field(default_factory=list)
    execution_logs: List[str] = Field(default_factory=list)
    message: Optional[str] = None
    # New fields — all optional so existing clients are not broken
    explanation: Optional[str] = None
    simulation: Optional[SimulationResult] = None
    suggestions: Optional[List[WorkflowSuggestion]] = None
    documentation: Optional[WorkflowDocumentation] = None

class EditResponse(BaseModel):
    status: str
    workflow_id: str
    nodes: List[WorkflowNode]
    agents: List[Agent] = Field(default_factory=list)
    change_description: str
    explanation: Optional[str] = None
