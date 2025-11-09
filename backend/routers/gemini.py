from fastapi import APIRouter
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class PromptRequest(BaseModel):
    prompt: str

def format_response(text: str) -> str:
    # Strip extra whitespace
    cleaned = text.strip()

    # Optional: convert double newlines to single for consistency
    cleaned = cleaned.replace('\n\n', '\n')

    # Optional: Replace bullets with emoji bullets
    cleaned = cleaned.replace('* ', '• ')

    return cleaned

@router.post("/gemini")
async def chat_with_gemini(request: PromptRequest):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        system_instruction = (
            "You are an assistant that only answers questions related to the Indian government's "
            "Direct Benefit Transfer (DBT), Aadhaar, and Aadhaar-linked bank accounts. Do not answer anything outside this scope."
        )

        chat = model.start_chat()
        chat.send_message(system_instruction)
        response = chat.send_message(request.prompt)

        # 🔧 Format the bot message before returning
        formatted = format_response(response.text)

        return {"response": formatted}
    except Exception as e:
        return {"error": str(e)}