import { useAuth } from '@/hooks/useAuth';
import { router, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GoogleIcon = () => (
  <View style={styles.googleIconContainer}>
    <Text style={styles.googleLetter}>G</Text>
  </View>
);

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Handle Google login via WebBrowser
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // expo-web-browser를 사용하여 브라우저에서 Google 로그인 열기
      const result = await WebBrowser.openBrowserAsync(
        'https://illusion-note-api.vercel.app/api/auth/google',
        {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        }
      );
      
      if (result.type === 'opened') {
        // 브라우저가 열림 - 실제 구현에서는 딥링크나 다른 방법으로 토큰을 받아야 함
        Alert.alert('알림', 'Google 로그인을 진행해주세요.');
      }
      
      // Mock 로그인 처리 (실제 구현에서는 서버에서 토큰을 받아 처리)
      await login();
      router.push('/(tabs)');
      
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('오류', 'Google 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest login
  const handleGuestLogin = () => {
    router.push('/(tabs)');
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
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#DB4437" style={{ marginRight: 12 }} />
          ) : (
            <GoogleIcon />
          )}
          <Text style={styles.buttonText}>Google로 로그인</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity 
          style={styles.guestButton}
          onPress={handleGuestLogin}
          disabled={isLoading}
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
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DB4437',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleLetter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
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