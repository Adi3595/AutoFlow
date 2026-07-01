from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DeployRequest(BaseModel):
    intent: str = Field(..., min_length=10, max_length=1000, description="Natural language intent describing the desired workflow")
    
class WorkflowNode(BaseModel):
    id: str
    type: str = Field(..., description="The type of the node, e.g., 'trigger', 'action', 'condition'")
    name: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Agent(BaseModel):
    id: str
    name: str
    role: str
    description: str
    
class DeployResponse(BaseModel):
    status: str
    workflow_id: str
    nodes: List[WorkflowNode]
    agents: List[Agent] = Field(default_factory=list)
    execution_logs: List[str] = Field(default_factory=list)
    message: Optional[str] = None
