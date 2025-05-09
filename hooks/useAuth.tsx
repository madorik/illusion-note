import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserInfo } from './useGoogleAuth';

// 세션 관련 상수
const SESSION_KEY = 'auth_session';
const USER_DATA_KEY = 'user_data';

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  login: (user: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 시작 시 저장된 세션에서 사용자 정보 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 세션 ID 확인
        const sessionId = await SecureStore.getItemAsync(SESSION_KEY);
        if (sessionId) {
          // 세션 ID가 있으면 사용자 데이터 로드
          const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
          if (userJson) {
            const userData = JSON.parse(userJson);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('세션에서 사용자 데이터 복원됨:', userData.id);
          }
        }
      } catch (error) {
        console.error('세션에서 사용자 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData: UserInfo) => {
    try {
      // 사용자 데이터 저장
      setUser(userData);
      setIsAuthenticated(true);
      
      // 세션 ID로 사용자 고유 ID 저장
      await SecureStore.setItemAsync(SESSION_KEY, userData.id);
      
      // 사용자 상세 정보 저장
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
      
      console.log('로그인 성공, 사용자 ID:', userData.id);
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 사용자 데이터 및 세션 삭제
      setUser(null);
      setIsAuthenticated(false);
      
      await SecureStore.deleteItemAsync(SESSION_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다');
  }
  return context;
}; 