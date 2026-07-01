from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
import database.models as models
from api import workflows

# Create tables in SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AutoFlow OS API",
    description="Backend for the AI-powered workflow operating system.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])

@app.get("/")
async def root():
    return {"status": "AutoFlow OS Backend is Live", "version": "1.0.0"}
