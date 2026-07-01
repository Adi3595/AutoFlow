from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database import models
from pydantic import BaseModel
from typing import List

router = APIRouter()

class WorkflowDeployRequest(BaseModel):
    intent: str

@router.post("/deploy")
async def deploy_workflow(request: WorkflowDeployRequest, db: Session = Depends(get_db)):
    """
    Mock endpoint to simulate deploying an OS workflow from natural language intent.
    In Phase 2, this will hit LangChain and parse the intent into a DAG.
    """
    # Create a dummy workflow to verify DB connection
    new_workflow = models.Workflow(
        title="AI Generated Workflow",
        description=f"Generated from intent: {request.intent}",
        status="active"
    )
    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)

    return {
        "status": "success", 
        "message": "Workflow OS deployed and saved to SQLite DB successfully.", 
        "workflow_id": new_workflow.id,
        "parsed_intent": request.intent
    }
