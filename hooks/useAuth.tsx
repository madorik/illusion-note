import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
    // 여기서 저장된 토큰이나 인증 정보를 확인할 수 있습니다
    // 예: AsyncStorage에서 토큰 확인
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 실제 구현에서는 저장된 토큰을 확인하고 서버에 검증 요청을 보냅니다
      // 현재는 간단한 mock 구현
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      // 실제 로그인 로직 구현
      // 예: Google 로그인, 이메일/비밀번호 로그인 등
      
      // Mock 사용자 데이터
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'User Name'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // 실제 로그아웃 로직 구현
      // 예: 토큰 삭제, 서버에 로그아웃 요청 등
      
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