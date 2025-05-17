import { AppTabBar } from '@/components/ui/AppTabBar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function MoodInputScreen() {
  const [selectedMode, setSelectedMode] = useState('comfort');  // 기본값 comfort로 설정
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // API 서버 도메인 설정
  const serverDomain = 'https://illusion-note-api.vercel.app';
  
  // 개발 모드에서만 에러 디버깅용
  const DEBUG = true;
  
  const modes = [
    { id: 'comfort', text: '위로' },
    { id: 'fact', text: '팩트' },
    { id: 'advice', text: '조언' },
  ];

  const analyzeEmotion = async () => {
    // 키보드 닫기
    Keyboard.dismiss();
    
    if (!inputText.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    // API 요청 파라미터 생성
    const requestData = {
      text: inputText,
      response_type: selectedMode || 'comfort',
      mood_id: '', // 빈 값으로 설정 (API에서 필요한 경우)
      mode: 'chat', // 채팅 모드로 변경
      context: '' // 빈 컨텍스트로 설정 (API에서 필요한 경우)
    };
    
    const requestBody = JSON.stringify(requestData);
    console.log('[API 요청 시작] 요청 본문:', requestBody);

    try {
      // 메인 요청 타임아웃 설정 (30초)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('[API 타임아웃] 요청 시간 초과로 중단');
        controller.abort();
      }, 30000);
      
      console.log('[API 요청 시작]', new Date().toISOString());
      const apiUrl = `${serverDomain}/api/emotion/openai`;
      console.log('[API 요청 URL]', apiUrl);
      
      // 연결 테스트용 간단한 요청
      try {
        const testResponse = await fetch(`${serverDomain}/health`, { 
          method: 'GET',
          cache: 'no-cache',
          headers: { 'Accept': 'application/json' }
        });
        console.log('[서버 연결 테스트]', testResponse.status, testResponse.ok);
      } catch (testError) {
        console.error('[서버 연결 테스트 실패]', testError.message);
      }
      
      // 실제 API 요청
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody,
        signal: controller.signal
      });
      
      // 타임아웃 제거
      clearTimeout(timeoutId);
      
      console.log('[API 응답 상태]', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('[API 오류]', response.status, response.statusText);
        let errorText = '';
        try {
          const errorData = await response.text();
          console.error('[API 오류 응답]', errorData);
          errorText = errorData;
        } catch (err) {
          errorText = '응답 데이터를 읽을 수 없습니다';
        }
        throw new Error(`서버 응답이 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorText}`);
      }

      // 응답 JSON 파싱
      const responseText = await response.text();
      console.log('[API 응답 원본]', responseText);
      
      const data = JSON.parse(responseText);
      console.log('[API 응답 파싱 결과]', JSON.stringify(data, null, 2));
      
      // API 호출 실패 시 기본 데이터 사용
      if (!data) {
        console.warn('[API 응답] 데이터가 없습니다. 기본값 사용');
        // 기본 응답 생성
        const defaultData = {
          mode: selectedMode || 'comfort',
          emotion: '알 수 없음',
          summary: '감정 분석을 수행할 수 없습니다.',
          response: '죄송합니다, 현재 감정 분석을 수행할 수 없습니다.',
          analyze_text: '감정 분석이 제대로 이루어지지 않았습니다.'
        };
        
        console.log('[네비게이션] 기본 응답으로 이동', defaultData);
        router.push({
          pathname: '/journal-analysis',
          params: defaultData
        });
        return;
      }
      
      // API 응답 형식을 확인 - 필드가 없는 경우 기본값 설정
      const processedData = {
        emotion: data.emotion || '알 수 없음',
        summary: data.summary || '감정 분석 요약을 가져올 수 없습니다.',
        response: data.response || '감정 분석 응답을 가져올 수 없습니다.',
        analyze_text: data.analyze_text || data.response || '감정 분석 텍스트를 가져올 수 없습니다.'
      };
      
      // 필수 필드가 모두 있는지 확인하고 로그
      console.log('[API 데이터 처리 결과]', JSON.stringify(processedData, null, 2));
      
      // 적절한 데이터 구성
      const navigationData = {
        mode: selectedMode || 'comfort',
        emotion: processedData.emotion,
        summary: processedData.summary,
        response: processedData.response,
        analyze_text: processedData.analyze_text
      };
      
      console.log('[네비게이션] 분석 결과 페이지로 이동', navigationData);
      
      // 분석 결과 페이지로 이동
      router.push({
        pathname: '/journal-analysis',
        params: navigationData
      });
    } catch (error) {
      console.error('[API 호출 에러]', error.message);
      
      // 디버그 모드에서 상세 오류 표시
      if (DEBUG) {
        Alert.alert('API 오류 (디버그)', `오류: ${error.name}\n메시지: ${error.message}`);
      } else {
        // 사용자용 친절한 오류 메시지
        Alert.alert('연결 오류', '서버에 연결할 수 없습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
      }
      
      // 오류 발생 시 기본 데이터로 이동
      const errorData = {
        mode: selectedMode || 'comfort',
        emotion: '알 수 없음',
        summary: '감정 분석을 수행할 수 없습니다.',
        response: '죄송합니다, 현재 감정 분석을 수행할 수 없습니다.',
        analyze_text: '감정 분석이 제대로 이루어지지 않았습니다.'
      };
      
      console.log('[네비게이션] 오류 발생 - 기본 응답으로 이동', errorData);
      
      router.push({
        pathname: '/journal-analysis',
        params: errorData
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        {/* KeyboardAwareScrollView는 키보드가 나타날 때 자동으로 스크롤을 조정함 */}
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          extraScrollHeight={100}
          extraHeight={120}
          keyboardOpeningTime={0}
        >
          <Text style={styles.title}>
            오늘 당신의 감정을{'\n'}
            들려주세요
          </Text>
          
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="마음을 자유롭게 적어보세요..."
              placeholderTextColor="#8F9BB3"
              multiline
              numberOfLines={4}
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
          
          <View style={styles.modeSelectContainer}>
            {modes.map((mode) => (
              <TouchableOpacity 
                key={mode.id}
                style={[
                  styles.modeButton,
                  selectedMode === mode.id && styles.selectedModeButton
                ]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <Text style={[
                  styles.modeText,
                  selectedMode === mode.id && styles.selectedModeText
                ]}>{mode.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.aiButton, isLoading && styles.disabledButton]}
            onPress={analyzeEmotion}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '분석 중...' : 'AI 분석 하기'}
            </Text>
          </TouchableOpacity>
          
          {/* 여백 추가로 스크롤 영역 확보 */}
          <View style={styles.paddingView} />
        </KeyboardAwareScrollView>

        <AppTabBar activeTab="home" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 32,
    color: '#2E3A59',
  },
  inputBox: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    minHeight: 100,
  },
  textInput: {
    fontSize: 16,
    color: '#2E3A59',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modeSelectContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '30%',
  },
  selectedModeButton: {
    backgroundColor: 'rgba(141, 171, 211, 0.2)',
    borderWidth: 1,
    borderColor: '#8DABD3',
  },
  modeText: {
    fontSize: 15,
    color: '#2E3A59',
  },
  selectedModeText: {
    fontWeight: 'bold',
    color: '#8DABD3',
  },
  aiButton: {
    backgroundColor: '#8DABD3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#AABFD3',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paddingView: {
    height: 120,  // 하단 여백 증가
  },
}); 