// Authentication configuration
export const GOOGLE_CLIENT_ID = '575143488385-sduv6gb404h2nqkea32hqui4ntkrfv92.apps.googleusercontent.com';

// Google Cloud Console 설정 안내:
// 1. https://console.cloud.google.com/ 접속
// 2. 프로젝트를 선택하거나 새로 만들기
// 3. 왼쪽 메뉴에서 "API 및 서비스" > "사용자 인증 정보" 선택
// 4. "OAuth 동의 화면" 탭에서 앱 등록 정보 설정
//    - 앱 이름, 로고, 개발자 정보 등 입력
//    - 테스트 사용자 추가 (개발/테스트 중일 경우)
// 5. "사용자 인증 정보" 탭에서 사용자 인증 정보 만들기 > "OAuth 클라이언트 ID" 선택
// 6. 애플리케이션 유형 선택:
//    - 웹 애플리케이션: 웹 앱 개발 시
//    - Android/iOS: 네이티브 앱 개발 시
//
// 7. 승인된 리디렉션 URI 추가 (아래의 형식)
//    - Expo 개발 환경: exp://[개발IP:PORT]/--/oauth2redirect
//    - 예: exp://192.168.0.2:19000/--/oauth2redirect
//
// ⚠️ 중요: 앱에서 출력된 정확한 리디렉션 URI를 그대로 복사하여 등록해야 합니다!

export const AUTH_CONFIG = {
  googleClientId: GOOGLE_CLIENT_ID,
  scopes: ['profile', 'email'],
}; 