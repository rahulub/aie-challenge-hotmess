from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
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
