from fastapi import APIRouter, Request, Depends
from models.schemas import DeployRequest, DeployResponse
from services.orchestrator import Orchestrator
from core.security import limiter, verify_api_key

router = APIRouter()

@router.post("/deploy", response_model=DeployResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def deploy_workflow(request: Request, payload: DeployRequest):
    """
    Accepts a natural language intent from the client and returns a 
    compiled, executable workflow DAG.
    Protected by X-API-Key and Rate Limiting.
    """
    response = Orchestrator.parse_intent_to_graph(payload.intent)
    return response
