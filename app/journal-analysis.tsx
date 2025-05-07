import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function JournalAnalysisScreen() {
  const params = useLocalSearchParams();
  const selectedMode = params.mode as string || 'comfort'; // 'comfort', 'fact', 'advice'
  const [emotion, setEmotion] = useState(params.emotion as string || '슬픔');
  const [summary, setSummary] = useState(params.summary as string || '');
  const [response, setResponse] = useState(params.response as string || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // 모드별 데이터
  const modeData = {
    comfort: {
      title: '위로',
      color: '#8DABD3',
      icon: 'heart.fill',
    },
    fact: {
      title: '팩트',
      color: '#67B68C',
      icon: 'doc.text.fill',
    },
    advice: {
      title: '조언',
      color: '#E48F66',
      icon: 'lightbulb.fill',
    }
  };

  // 기본 응답 사용 (API에서 데이터를 받지 못했을 경우)
  useEffect(() => {
    // 파라미터로 전달된 값이 없으면 기본값 설정
    if (!params.summary) {
      setSummary("당신의 감정은 '" + emotion + "'이에요. 이 감정에는 깊은 느낌이 있어요. 글에서 표현된 감정에 대해 분석해보았습니다.");
    }
    
    if (!params.response) {
      if (selectedMode === 'comfort') {
        setResponse("당신의 감정은 충분히 이해할 수 있어요. 마음이 아프고 힘든 것은 자연스러운 감정이에요. 이런 어려운 시간이 지나면 분명히 더 강해진 당신을 만나게 될 거예요. 잊지 마세요, 당신은 혼자가 아니고 충분히 가치 있는 사람입니다.");
      } else if (selectedMode === 'fact') {
        setResponse("이별 후의 슬픔은 평균적으로 3-6개월 지속됩니다. 연구에 따르면 이별 후 우리 뇌에서는 실제 물리적 고통과 비슷한 신경 반응이 일어납니다. 이는 정상적인 감정 처리 과정이며, 시간이 약이라는 말은 과학적으로도 증명된 사실입니다.");
      } else {
        setResponse("지금은 자신을 돌보는 시간을 가지세요. 규칙적인 생활, 충분한 휴식, 건강한 식습관이 도움이 됩니다. 새로운 취미나 활동에 참여하는 것도 좋은 방법입니다. 친구나 가족과 대화하며 감정을 표현하고, 필요하다면 전문가의 도움도 고려해보세요.");
      }
    }
  }, [params, emotion, selectedMode]);
  
  // 현재 선택된 모드의 데이터
  const currentMode = modeData[selectedMode as keyof typeof modeData];

  const saveJournal = () => {
    setIsSaving(true);
    
    // 실제로는 여기서 저장 API를 호출하면 됩니다
    // 현재는 가상의 저장 과정을 시뮬레이션
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        '저장 완료',
        '감정 일기가 저장되었습니다.',
        [
          { text: '홈으로', onPress: () => router.push('/(tabs)') }
        ]
      );
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionTitle}>분석된 감정</Text>
          <View style={styles.emotionBadge}>
            <Text style={styles.emotionText}>{emotion}</Text>
          </View>
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>감정 분석 요약</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
        
        <View style={[styles.analysisCard, { borderColor: currentMode.color }]}>
          <View style={[styles.modeHeader, { backgroundColor: currentMode.color }]}>
            <IconSymbol name={currentMode.icon} size={20} color="#fff" />
            <Text style={styles.modeTitle}>{currentMode.title}</Text>
          </View>
          <Text style={styles.analysisText}>{response}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.savingButton]}
          onPress={saveJournal}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? '저장 중...' : '저장하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  emotionTitle: {
    fontSize: 16,
    color: '#2E3A59',
    marginRight: 10,
  },
  emotionBadge: {
    backgroundColor: 'rgba(141, 171, 211, 0.2)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#8DABD3',
  },
  emotionText: {
    color: '#8DABD3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 10,
  },
  summaryText: {
    lineHeight: 24,
    color: '#2E3A59',
    fontSize: 15,
    backgroundColor: '#F7F9FC',
    padding: 16,
    borderRadius: 12,
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#8DABD3',
    overflow: 'hidden',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#8DABD3',
  },
  modeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisText: {
    lineHeight: 24,
    color: '#2E3A59',
    fontSize: 15,
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#8DABD3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savingButton: {
    backgroundColor: '#AABFD3',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingVertical: 10,
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