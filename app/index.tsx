import { Redirect } from 'expo-router';

export default function Index() {
  // 루트 경로('/')에 접근하면 자동으로 로그인 화면으로 리다이렉트
  return <Redirect href="/login" />;
} 