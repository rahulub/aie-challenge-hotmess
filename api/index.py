from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
# Allow specific origins from env, or allow all in development
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")

if allowed_origins_env == "*":
    # Allow all origins - use explicit list for better compatibility
    # For production, you should set specific origins in ALLOWED_ORIGINS env var
    allowed_origins = ["*"]
    allow_creds = False
else:
    # Split comma-separated origins
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
    allow_creds = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_creds,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["*"],
    max_age=3600,
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "ok", "message": "Hot Mess Coach API is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "api_key_configured": bool(os.getenv("OPENAI_API_KEY"))}

@app.options("/api/chat")
async def chat_options(request):
    """Handle CORS preflight requests"""
    # Get the origin from the request
    origin = request.headers.get("Origin", "")
    
    # Determine allowed origin based on ALLOWED_ORIGINS env var
    if allowed_origins_env == "*":
        allow_origin = "*"
    elif origin in allowed_origins:
        allow_origin = origin
    else:
        # If origin not in allowed list, don't allow (but this shouldn't happen if middleware is working)
        allow_origin = allowed_origins[0] if allowed_origins else "*"
    
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
            "Access-Control-Max-Age": "3600",
            "Access-Control-Allow-Credentials": "true" if allow_creds else "false",
        }
    )

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        user_message = request.message
        openai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a supportive mental coach."},
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": openai_response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")

@app.get("/api/chat")
def chat_get():
    return {
        "error": "This endpoint requires a POST request",
        "example": {
            "method": "POST",
            "url": "/api/chat",
            "body": {"message": "hi"}
        }
    }
