import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { useAuth } from '../hooks/useAuth';
import { UserInfo } from '../hooks/useGoogleAuth';

export default function LoginScreen() {
  const { login, isAuthenticated } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSuccess = async (userInfo: UserInfo) => {
    try {
      setIsLoggingIn(true);
      console.log('로그인 성공 핸들러 실행. 사용자:', userInfo.name);
      
      await login(userInfo);
      console.log('useAuth.login 완료. 인증 상태:', isAuthenticated);
      
      Alert.alert('로그인 성공', `환영합니다, ${userInfo.name}님!`);
      
      // 메인 앱 화면으로 이동
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error) {
      console.error('로그인 저장 오류:', error);
      Alert.alert('오류', '로그인 과정을 완료하지 못했습니다');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginFail = (error: string) => {
    console.error('로그인 실패:', error);
    Alert.alert('로그인 실패', error);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.topSection}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>
          감정을 기록하고{'\n'}
          저장하고 싶다면{'\n'}
          로그인하세요
        </Text>
        <Text style={styles.subtitle}>
          일상 속 감정을 기록하고 관리해보세요
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <GoogleSignInButton
          onLoginSuccess={handleLoginSuccess}
          onLoginFail={handleLoginFail}
        />
        {isLoggingIn && (
          <Text style={styles.loadingText}>로그인 처리 중...</Text>
        )}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity 
          style={styles.guestButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.guestButtonText}>로그인 없이 시작</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        로그인하면 이용약관 및 개인정보처리방침에 동의하게 됩니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  topSection: {
    marginTop: 80,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8F9BB3',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#5B86E5',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#8F9BB3',
    fontSize: 14,
  },
  guestButton: {
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  guestButtonText: {
    color: '#5B86E5',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#8F9BB3',
    fontSize: 12,
  },
}); 