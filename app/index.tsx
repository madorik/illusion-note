import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    // 로그인 화면으로 리다이렉트
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, color: '#333' }}>Loading...</Text>
    </View>
  );
} 