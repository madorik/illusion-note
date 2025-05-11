from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.openai_service import OpenAIService

router = APIRouter(prefix="/api/openai", tags=["openai"])

# 싱글톤 OpenAI 서비스 인스턴스
openai_service = OpenAIService()

class JournalEntry(BaseModel):
    text: str
    mode: str = "chat"  # chat, analyze, summarize
    context: str = ""

class OpenAIResponse(BaseModel):
    response: str
    analysis: dict = None

@router.post("/generate", response_model=OpenAIResponse)
async def generate_response(journal: JournalEntry):
    try:
        # OpenAI API 호출
        result = openai_service.generate_response(
            text=journal.text,
            mode=journal.mode,
            context=journal.context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 