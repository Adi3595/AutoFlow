from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from routers import workflows
from core.security import limiter

app = FastAPI(
    title="AutoFlow OS Backend",
    description="Autonomous workflow orchestration API",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add Rate Limiting Middleware
app.add_middleware(SlowAPIMiddleware)

import os
import json

# Parse CORS origins from env (JSON string) or default to wildcard
cors_origins_str = os.getenv("BACKEND_CORS_ORIGINS", '["*"]')
try:
    cors_origins = json.loads(cors_origins_str)
except Exception:
    cors_origins = ["*"]

# Configure Strict CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True if "*" not in cors_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])

@app.get("/")
async def root():
    return {"status": "online", "message": "AutoFlow OS orchestration engine is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
