import { HelloWave } from '@/components/HelloWave';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// 화면 너비
const { width } = Dimensions.get('window');

// 더미 데이터 - 감정 통계 (이모지 추가)
const emotionStats = [
  { emotion: '행복', count: 12, emoji: '😊', color: '#64A1F4' },
  { emotion: '평온', count: 8, emoji: '😌', color: '#9DC9F5' },
  { emotion: '슬픔', count: 5, emoji: '😢', color: '#B9B9B9' },
  { emotion: '불안', count: 3, emoji: '😰', color: '#F5A76C' }
];

// 동기부여 문구
const motivationalQuotes = [
  "오늘의 감정을 기록하면, 내일의 나를 더 잘 이해할 수 있어요.",
  "작은 감정도 소중해요. 당신의 모든 순간을 기록해 보세요.",
  "감정을 알아차리는 것이 마음 돌보기의 첫 걸음입니다.",
  "당신의 이야기가 누군가에게 위로가 될 수 있어요.",
  "기록은 자신을 발견하는 여정입니다."
];

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('안녕하세요');
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // 시간에 따른 인사말 설정
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting('좋은 아침이에요');
    } else if (hours >= 12 && hours < 18) {
      setGreeting('좋은 오후에요');
    } else {
      setGreeting('좋은 저녁이에요');
    }
    
    // 랜덤 동기부여 문구 선택
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    
    // 페이드인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5B86E5', '#36D1DC']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{greeting}</Text>
            <HelloWave />
            <Text style={styles.subGreeting}>오늘의 감정을 기록해 보세요</Text>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* 동기부여 카드 */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteIconContainer}>
              <IconSymbol
                name="quote.bubble.fill"
                color="#FFFFFF"
                size={16}
              />
            </View>
            <Text style={styles.quoteText}>{quote}</Text>
          </View>
          
          {/* 최근 감정 통계 */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>이번 달 감정 요약</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/stats')}>
                <Text style={styles.seeMoreText}>더보기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emotionStatsContainer}>
              {emotionStats.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.emotionItem}
                  onPress={() => router.push('/(tabs)/stats')}
                >
                  <Text style={styles.emojiText}>{item.emoji}</Text>
                  <View style={styles.emotionTextContainer}>
                    <Text style={styles.emotionCount}>{item.count}</Text>
                    <Text style={styles.emotionLabel}>{item.emotion}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 최근 활동 미리보기 */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>최근 일기</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/records')}>
                <Text style={styles.seeMoreText}>더보기</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.recentEntry}
              onPress={() => router.push('/(tabs)/records')}
            >
              <View style={styles.recentEntryHeader}>
                <Text style={styles.recentEntryDate}>어제</Text>
                <View style={[styles.emotionTag, { backgroundColor: '#36D1DC' }]}>
                  <Text style={styles.emotionTagText}>평온</Text>
                </View>
              </View>
              <Text style={styles.recentEntryTitle}>차분한 하루</Text>
              <Text style={styles.recentEntrySummary} numberOfLines={2}>
                오늘은 비교적 평온한 하루를 보냈다. 아침에 일어나 여유롭게 커피를 마시며 책을 읽었고...
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => router.push('/mood-input')}
        activeOpacity={0.9}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.plusIcon}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // 플로팅 버튼 공간 확보
  },
  contentContainer: {
    padding: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#5B86E5',
    fontWeight: '600',
  },
  emotionStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    width: (width - 100) / 4,
  },
  emojiText: {
    fontSize: 28,
    marginBottom: 6,
  },
  emotionTextContainer: {
    alignItems: 'center',
  },
  emotionCount: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emotionLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginTop: 2,
  },
  quoteCard: {
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    paddingLeft: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#5B86E5',
  },
  quoteIconContainer: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#5B86E5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quoteText: {
    fontSize: 16,
    color: '#333333',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  recentEntry: {
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  recentEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentEntryDate: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  emotionTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  emotionTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recentEntryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  recentEntrySummary: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 999,
  },
  buttonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5B86E5',
  },
  plusIcon: {
    fontSize: 30,
    color: '#5B86E5',
    fontWeight: 'bold',
    marginTop: -2, // 시각적 정렬을 위한 조정
  }
});
