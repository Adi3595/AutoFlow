from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import workflows

app = FastAPI(
    title="AutoFlow OS Backend",
    description="Autonomous workflow orchestration API",
    version="1.0.0"
)

# Configure CORS so the Next.js frontend on localhost:3000 can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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
