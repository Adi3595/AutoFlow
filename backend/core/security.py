import os
from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

API_KEY = os.getenv("AUTOFLOW_API_KEY", "auto-flow-3595")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

async def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key
