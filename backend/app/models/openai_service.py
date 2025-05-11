import os
import openai
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    """OpenAI API 연동을 위한 서비스 클래스"""
    
    def __init__(self):
        # OpenAI API 키 설정
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # GPT-4.1 nano 모델 (gpt-4o-mini가 nano에 해당)
        
        # 모드별 프롬프트 템플릿
        self.prompt_templates = {
            "chat": "다음은 사용자의 일기입니다: {text}\n\n위 내용에 대해 공감하며 대화하듯이 응답해주세요.",
            "analyze": "다음은 사용자의 일기입니다: {text}\n\n이 글에서 느껴지는 감정과 심리상태를 분석해주세요.",
            "summarize": "다음은 사용자의 일기입니다: {text}\n\n이 내용을 간결하게 요약해주세요."
        }
    
    def generate_response(self, text, mode="chat", context=""):
        """
        입력된 텍스트에 대한 OpenAI 응답 생성
        
        Args:
            text: 사용자가 입력한 텍스트
            mode: 응답 생성 모드 ('chat', 'analyze', 'summarize')
            context: 추가 컨텍스트 정보
            
        Returns:
            dict: 응답 및 분석 정보
        """
        if not text:
            return {"response": "텍스트를 입력해주세요.", "analysis": None}

        # 프롬프트 생성
        prompt = self.prompt_templates.get(mode, self.prompt_templates["chat"]).format(text=text)
        if context:
            prompt += f"\n추가 컨텍스트: {context}"
        
        try:
            # OpenAI API 호출
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "당신은 일기장 앱을 사용하는 사용자와 대화하는 AI 비서입니다. 사용자의 감정에 공감하고 도움이 되는 응답을 제공합니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            # 응답 텍스트 추출
            response_text = response.choices[0].message.content.strip()
            
            # 모드가 분석인 경우 간단한 분석 결과 생성
            analysis = None
            if mode == "analyze":
                # 실제로는 감정 분석 결과를 체계적으로 가공해야 함
                # 간단한 구현을 위해 임시 구조로 반환
                analysis = {
                    "sentiment": "긍정적" if "행복" in response_text or "좋은" in response_text else "부정적" if "슬픔" in response_text or "불안" in response_text else "중립적",
                    "keywords": response_text.split()[:5],  # 간단한 예시: 첫 5개 단어를 키워드로
                    "summary": response_text[:100] + "..." if len(response_text) > 100 else response_text
                }
            
            return {
                "response": response_text,
                "analysis": analysis
            }
            
        except Exception as e:
            # 에러 로깅 추가 가능
            return {"response": f"응답 생성 중 오류가 발생했습니다: {str(e)}", "analysis": None} 