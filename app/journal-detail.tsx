import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for journal entries content (in a real app, this would come from a database)
const mockJournalData = {
  '1': {
    id: '1', 
    title: '힘든 하루',
    date: '2025-05-01',
    time: '10:30 AM',
    emotion: '슬픔',
    content: '오늘은 정말 힘든 하루였다. 시험 준비도 잘 안되고, 친구와도 약간의 다툼이 있었다. 마음이 무겁고 슬프다.',
    summary: '학업 스트레스와 대인관계 갈등으로 인한 슬픔이 느껴집니다. 이런 날도 있을 수 있다는 것을 인정하고 스스로를 위로해주세요.',
    analysis: '당신의 감정은 충분히 이해할 수 있어요. 마음이 아프고 힘든 것은 자연스러운 감정이에요. 이런 어려운 시간이 지나면 분명히 더 강해진 당신을 만나게 될 거예요. 잊지 마세요, 당신은 혼자가 아니고 충분히 가치 있는 사람입니다.',
    mode: 'comfort'
  },
  '2': {
    id: '2', 
    title: '친구와의 대화',
    date: '2025-05-01',
    time: '08:00 PM',
    emotion: '기쁨',
    content: '오랜만에 친구와 깊은 대화를 나눴다. 서로의 고민을 이야기하고 격려해주면서 마음이 따뜻해졌다. 이런 친구가 있다는 건 정말 행복한 일이다.',
    summary: '의미 있는 대화를 통해 얻은 기쁨과 따뜻함이 느껴집니다. 인간관계에서 오는 긍정적인 감정이 당신에게 큰 의미가 있네요.',
    analysis: '친구와의 깊은 대화는 우리에게 정서적 안정과 행복감을 선사합니다. 이런 관계를 소중히 여기고 꾸준히 가꿔나가는 것이 중요해요. 당신의 따뜻한 마음이 친구에게도 큰 위로가 되었을 거예요.',
    mode: 'comfort'
  },
  '3': {
    id: '3', 
    title: '시험 준비',
    date: '2025-05-08',
    time: '04:15 PM',
    emotion: '불안',
    content: '다가오는 시험이 걱정된다. 준비할 시간은 부족하고 해야 할 일은 많다. 밤을 새워야 할 것 같은데, 건강도 걱정된다.',
    summary: '시험에 대한 불안과 시간 부족으로 인한 스트레스가 느껴집니다. 효율적인 시간 관리와 우선순위 설정이 필요해 보입니다.',
    analysis: '시험 불안은 많은 학생들이 경험하는 일반적인 감정입니다. 연구에 따르면 적절한 불안은 오히려 집중력과 성과를 높일 수 있습니다. 하지만 밤샘 공부는 오히려 기억력과 집중력을 저하시킬 수 있어요. 충분한 수면과 짧은 휴식을 취하며 공부하는 것이 더 효과적입니다.',
    mode: 'fact'
  },
  '4': {
    id: '4', 
    title: '가족 모임',
    date: '2025-05-08',
    time: '01:00 PM',
    emotion: '행복',
    content: '오랜만에 가족 모임을 가졌다. 맛있는 음식과 웃음이 넘치는 시간이었다. 이런 소소한 행복이 삶의 원동력이 된다.',
    summary: '가족과의 시간을 통해 느낀 행복과 만족감이 글에서 느껴집니다. 소중한 추억을 만드는 시간이었네요.',
    analysis: '가족과의 시간은 우리에게 소속감과 안정감을 주는 중요한 요소입니다. 이런 모임은 스트레스를 줄이고 정서적 건강을 향상시키는 데 도움이 됩니다. 앞으로도 이런 소중한 시간을 자주 만들어보세요.',
    mode: 'advice'
  },
  '5': {
    id: '5', 
    title: '생각 정리',
    date: '2023-12-10',
    time: '10:45 PM',
    emotion: '평온',
    content: '오늘은 조용히 나의 생각을 정리하는 시간을 가졌다. 미래에 대한 걱정보다는 현재에 집중하기로 했다. 마음이 한결 가벼워졌다.',
    summary: '자기 성찰을 통해 얻은 마음의 평화가 느껴집니다. 현재에 집중하려는 의지가 당신의 평온함을 가져다 주었네요.',
    analysis: '현재에 집중하는 마음가짐은 정신적 건강에 매우 중요합니다. 매일 5-10분씩 명상이나 생각 정리 시간을 가지면 스트레스 감소와 집중력 향상에 도움이 됩니다. 앞으로도 이런 좋은 습관을 유지해보세요.',
    mode: 'advice'
  },
  '6': {
    id: '6', 
    title: '새로운 계획',
    date: '2023-12-15',
    time: '09:30 AM',
    emotion: '기대',
    content: '새로운 취미를 시작하기로 했다. 오랫동안 관심 있던 그림 그리기를 배우려고 한다. 새로운 시작에 대한 기대감이 크다.',
    summary: '새로운 도전에 대한 기대와 설렘이 느껴집니다. 자기 발전을 향한 긍정적인 마음가짐이 보입니다.',
    analysis: '새로운 취미는 창의성을 발휘하고 스트레스를 해소하는 좋은 방법입니다. 그림 그리기는 특히 마음의 안정과 집중력 향상에 도움이 됩니다. 처음에는 결과보다 과정을 즐기는 것에 집중해보세요. 꾸준히 연습하면 실력이 향상되는 즐거움도 느낄 수 있을 거예요.',
    mode: 'advice'
  }
};

export default function JournalDetailScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const [entry, setEntry] = useState(null);
  
  // Mode colors
  const modeColors = {
    comfort: '#8DABD3',
    fact: '#67B68C',
    advice: '#E48F66',
  };
  
  // Mode icons
  const modeIcons = {
    comfort: 'heart.fill',
    fact: 'doc.text.fill',
    advice: 'lightbulb.fill',
  };
  
  useEffect(() => {
    // In a real app, fetch the journal entry from a database
    if (id && mockJournalData[id]) {
      setEntry(mockJournalData[id]);
    }
  }, [id]);
  
  if (!entry) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>기록을 불러오는 중...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{entry.title}</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{entry.date}</Text>
          <Text style={styles.timeText}>{entry.time}</Text>
        </View>
        
        <View style={styles.emotionContainer}>
          <Text style={styles.sectionTitle}>감정</Text>
          <View style={styles.emotionBadge}>
            <Text style={styles.emotionText}>{entry.emotion}</Text>
          </View>
        </View>
        
        <View style={styles.journalContainer}>
          <Text style={styles.sectionTitle}>나의 기록</Text>
          <View style={styles.journalTextContainer}>
            <Text style={styles.journalText}>{entry.content}</Text>
          </View>
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>감정 분석 요약</Text>
          <Text style={styles.summaryText}>{entry.summary}</Text>
        </View>
        
        <View style={[
          styles.analysisCard, 
          { borderColor: modeColors[entry.mode] || '#8DABD3' }
        ]}>
          <View style={[
            styles.modeHeader, 
            { backgroundColor: modeColors[entry.mode] || '#8DABD3' }
          ]}>
            <IconSymbol 
              name={modeIcons[entry.mode] || 'heart.fill'} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.modeTitle}>
              {entry.mode === 'comfort' ? '위로' : 
               entry.mode === 'fact' ? '팩트' : 
               entry.mode === 'advice' ? '조언' : '분석'}
            </Text>
          </View>
          <Text style={styles.analysisText}>{entry.analysis}</Text>
        </View>
      </ScrollView>
    </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8F9BB3',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: '500',
  },
  journalContainer: {
    marginBottom: 20,
  },
  journalTextContainer: {
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  journalText: {
    fontSize: 16,
    color: '#2E3A59',
    lineHeight: 24,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#2E3A59',
    lineHeight: 24,
    marginTop: 8,
  },
  analysisCard: {
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisText: {
    padding: 16,
    fontSize: 16,
    color: '#2E3A59',
    lineHeight: 24,
  },
}); 