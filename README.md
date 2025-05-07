# Illusion Note - 감정 일기 앱

Illusion Note는 감정 일기를 작성하고 AI가 분석해주는 모바일 애플리케이션입니다.

## 주요 기능

- 사용자의 감정 기록
- 감정에 따른 AI 분석 제공 (위로, 팩트, 조언 모드)
- 감정 일기 저장 및 관리

## 시작하기

### 프론트엔드 (React Native/Expo)

1. 의존성 설치:
```
npm install
```

2. 개발 서버 실행:
```
npm start
```

3. Expo Go 앱으로 테스트:
- iOS 또는 Android 기기에 Expo Go 앱을 설치
- 개발 서버에서 제공하는 QR 코드를 스캔

### 백엔드 (FastAPI)

1. 의존성 설치:
```
cd backend
pip install -r requirements.txt
```

2. 백엔드 서버 실행:
```
# Windows
run_backend.bat

# 또는 직접 실행
cd backend
python run.py
```

## 프로젝트 구조

- `/app`: Expo Router 기반 앱 화면
  - `/(tabs)`: 탭 기반 네비게이션 화면
  - `/mood-input.tsx`: 감정 입력 화면
  - `/journal-analysis.tsx`: 감정 분석 결과 화면

- `/backend`: FastAPI 백엔드
  - `/app/models`: 감정 분석 모델
  - `/app/routes`: API 엔드포인트

## API 엔드포인트

- `POST /api/analyze`: 감정 분석 
  - 요청 본문: `{ "text": "일기 내용", "mood_id": "감정 ID", "mode": "모드" }`
  - 응답: `{ "detected_emotion": "감지된 감정", "summary": "요약", "response": "모드별 응답" }`

# Welcome to your Expo app 👋

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
