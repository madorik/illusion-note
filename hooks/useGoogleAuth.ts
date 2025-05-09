import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// 브라우저 인증 세션 완료 처리
WebBrowser.maybeCompleteAuthSession();

// 명시적으로 auth.expo.io 리디렉션 URI 설정
const redirectUri = 'https://auth.expo.io/@mgjeong/illusion-note';
console.log('사용할 리디렉션 URI:', redirectUri);

// 실제 클라이언트 ID는 .env 파일이나 보안 저장소에서 관리해야 함
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID'; // 실제 배포 시 환경변수로 대체

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export default function useGoogleAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expo AuthSession으로 Google 인증 요청 설정
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      expoClientId: GOOGLE_CLIENT_ID,
      androidClientId: GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      // 중요: 명시적으로 리디렉션 URI 설정
      redirectUri: redirectUri
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  // 응답 처리
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // 액세스 토큰으로 사용자 정보 가져오기
  const fetchUserInfo = async (accessToken: string) => {
    try {
      console.log('사용자 정보 요청 중...');
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      const userData = await userInfoResponse.json();
      console.log('사용자 정보 획득 성공:', userData.name, userData.email);
      
      setUserInfo({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        photoUrl: userData.picture,
      });
      
      Alert.alert('로그인 성공', `${userData.name}님 환영합니다!`);
    } catch (e) {
      console.error('사용자 정보 가져오기 오류:', e);
      setError('사용자 정보를 가져오는 중 오류가 발생했습니다');
      Alert.alert('오류', '사용자 정보를 가져오는 중 오류가 발생했습니다');
    }
  };

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('구글 로그인 시작...');

    try {
      console.log('인증 요청 시작, 리디렉션 URI:', redirectUri);
      const result = await promptAsync();
      console.log('인증 결과:', result.type);
      
      if (result.type !== 'success') {
        console.log('로그인 취소됨 또는 실패:', result.type);
        if (result.type === 'error') {
          const errorMsg = result.error?.message || '로그인 중 오류가 발생했습니다';
          console.error('오류 세부정보:', JSON.stringify(result.error, null, 2));
          setError(errorMsg);
          Alert.alert('로그인 오류', errorMsg);
        }
      }
    } catch (e) {
      console.error('구글 로그인 오류:', e);
      let errorMessage = '로그인 중 오류가 발생했습니다';
      
      if (e instanceof Error) {
        errorMessage = e.message;
        console.error('오류 세부 정보:', e.stack);
      }
      
      setError(errorMessage);
      Alert.alert('로그인 오류', `Google 로그인 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [promptAsync]);

  const signOut = useCallback(() => {
    setUserInfo(null);
    console.log('로그아웃 성공');
  }, []);

  return {
    userInfo,
    loading,
    error,
    signIn,
    signOut,
    isReady: !!request,
  };
} 