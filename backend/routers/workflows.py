from fastapi import APIRouter, Request, Depends
from models.schemas import DeployRequest, DeployResponse, EditRequest, EditResponse, SimulateRequest
from services.orchestrator import Orchestrator
from core.security import limiter, verify_api_key

router = APIRouter()


@router.post("/deploy", response_model=DeployResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def deploy_workflow(request: Request, payload: DeployRequest):
    """
    Accepts a natural language intent and returns a compiled, executable
    workflow DAG enriched with explanation, simulation, suggestions, and docs.
    Protected by X-API-Key and Rate Limiting.
    """
    response = Orchestrator.parse_intent_to_graph(payload.intent)
    return response


@router.post("/edit", response_model=EditResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("10/minute")
async def edit_workflow(request: Request, payload: EditRequest):
    """
    Applies a natural language edit command to an existing workflow.
    Example payload: { "workflow_id": "wf_abc", "intent": "...", 
                       "nodes": [...], "edit_command": "Replace Telegram with Slack" }
    """
    response = Orchestrator.edit_workflow(payload)
    return response


@router.post("/simulate", dependencies=[Depends(verify_api_key)])
@limiter.limit("10/minute")
async def simulate_workflow(request: Request, payload: SimulateRequest):
    """
    Returns a simulation preview (timing, warnings, steps) without executing the workflow.
    """
    result = Orchestrator.simulate_workflow(payload)
    return {"status": "simulated", "data": result}
