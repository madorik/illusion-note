import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Google Sign-In 설정
GoogleSignin.configure({
  webClientId: '360964278077-hr6nu21t8uuug5kurvbsdlcdjtmukrm8.apps.googleusercontent.com', // Firebase console에서 가져온 웹 클라이언트 ID
});

// Auth 컨텍스트 타입 정의
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
}

// 사용자 타입 정의
interface User {
  id: string;
  email: string;
  name: string;
  photo?: string;
}

// Auth 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        if (userInfo) {
          setUser({
            id: userInfo.user.id,
            email: userInfo.user.email,
            name: userInfo.user.name || '',
            photo: userInfo.user.photo || undefined,
          });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Google Play Services 확인
      await GoogleSignin.hasPlayServices();
      
      // Google 로그인 시작
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo) {
        setUser({
          id: userInfo.user.id,
          email: userInfo.user.email,
          name: userInfo.user.name || '',
          photo: userInfo.user.photo || undefined,
        });
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Some other error happened');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 