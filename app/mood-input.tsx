import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function MoodInputScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedMode, setSelectedMode] = useState('comfort');  // 기본값 comfort로 설정
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const moods = [
    { id: 'happy', emoji: '😊', text: '좋음' },
    { id: 'neutral', emoji: '😐', text: '보통' },
    { id: 'sad', emoji: '😔', text: '슬픔' },
    { id: 'tired', emoji: '😑', text: '지침' },
    { id: 'angry', emoji: '😠', text: '불안' },
  ];

  const modes = [
    { id: 'comfort', text: '위로' },
    { id: 'fact', text: '팩트' },
    { id: 'advice', text: '조언' },
  ];

  const analyzeEmotion = async () => {
    // 키보드 닫기
    Keyboard.dismiss();
    
    if (!selectedMood) {
      Alert.alert('알림', '감정을 선택해주세요.');
      return;
    }

    if (!inputText.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 웹 환경에서 API 호출 문제 해결 (CORS 문제 방지)
      // const response = await fetch('http://localhost:8000/api/analyze', {
      
      // 로컬 IP 사용 (실제 배포 시 서버 IP로 변경 필요)
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          mood_id: selectedMood,
          mode: selectedMode || 'comfort',
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답이 실패했습니다.');
      }

      const data = await response.json();
      
      // API 호출 실패 시 기본 데이터 사용
      if (!data) {
        // 기본 응답 생성
        const defaultEmotion = moods.find(mood => mood.id === selectedMood)?.text || '알 수 없음';
        const defaultSummary = `당신의 감정은 '${defaultEmotion}'이에요. 입력하신 내용에서 '${defaultEmotion}' 감정이 느껴집니다.`;
        
        let defaultResponse = '';
        if (selectedMode === 'comfort') {
          defaultResponse = "당신의 감정은 충분히 이해할 수 있어요. 마음이 아프고 힘든 것은 자연스러운 감정이에요.";
        } else if (selectedMode === 'fact') {
          defaultResponse = "감정은 우리 삶의 중요한 부분입니다. 모든 감정은 그 나름의 의미가 있어요.";
        } else {
          defaultResponse = "자신을 돌보는 시간을 가지세요. 규칙적인 생활, 충분한 휴식, 건강한 식습관이 도움이 됩니다.";
        }
        
        router.push({
          pathname: '/journal-analysis',
          params: { 
            mode: selectedMode || 'comfort',
            emotion: defaultEmotion,
            summary: defaultSummary,
            response: defaultResponse
          }
        });
        return;
      }
      
      // 분석 결과 페이지로 이동
      router.push({
        pathname: '/journal-analysis',
        params: { 
          mode: selectedMode || 'comfort',
          emotion: data.detected_emotion,
          summary: data.summary,
          response: data.response
        }
      });
    } catch (error) {
      console.error('API 호출 에러:', error);
      
      // 오류 발생 시 기본 데이터로 이동
      const defaultEmotion = moods.find(mood => mood.id === selectedMood)?.text || '알 수 없음';
      const defaultSummary = `당신의 감정은 '${defaultEmotion}'이에요. 입력하신 내용에서 '${defaultEmotion}' 감정이 느껴집니다.`;
      
      let defaultResponse = '';
      if (selectedMode === 'comfort') {
        defaultResponse = "당신의 감정은 충분히 이해할 수 있어요. 마음이 아프고 힘든 것은 자연스러운 감정이에요.";
      } else if (selectedMode === 'fact') {
        defaultResponse = "감정은 우리 삶의 중요한 부분입니다. 모든 감정은 그 나름의 의미가 있어요.";
      } else {
        defaultResponse = "자신을 돌보는 시간을 가지세요. 규칙적인 생활, 충분한 휴식, 건강한 식습관이 도움이 됩니다.";
      }
      
      router.push({
        pathname: '/journal-analysis',
        params: { 
          mode: selectedMode || 'comfort',
          emotion: defaultEmotion,
          summary: defaultSummary,
          response: defaultResponse
        }
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
          
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity 
                key={mood.id}
                style={[
                  styles.moodItem,
                  selectedMood === mood.id && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <View style={[
                  styles.emojiCircle,
                  selectedMood === mood.id && { borderColor: '#8DABD3' }
                ]}>
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                </View>
                <Text style={styles.moodText}>{mood.text}</Text>
              </TouchableOpacity>
            ))}
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

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
            <IconSymbol name="house.fill" size={24} color="#8DABD3" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/records')}>
            <IconSymbol name="book.fill" size={24} color="#8F9BB3" />
            <Text style={styles.tabText}>Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/(tabs)/settings')}>
            <IconSymbol name="gear" size={24} color="#8F9BB3" />
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
        </View>
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
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  moodItem: {
    alignItems: 'center',
    width: 60,
  },
  emojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMood: {
    opacity: 1,
  },
  emoji: {
    fontSize: 24,
  },
  moodText: {
    fontSize: 12,
    color: '#2E3A59',
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
    height: 100,  // 하단 여백
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#8F9BB3',
  }
}); 