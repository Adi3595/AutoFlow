from fastapi import APIRouter
from models.schemas import DeployRequest, DeployResponse
from services.orchestrator import Orchestrator

router = APIRouter()

@router.post("/deploy", response_model=DeployResponse)
async def deploy_workflow(request: DeployRequest):
    """
    Accepts a natural language intent from the client and returns a 
    compiled, executable workflow DAG.
    """
    response = Orchestrator.parse_intent_to_graph(request.intent)
    return response
