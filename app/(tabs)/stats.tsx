import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;
const BAR_HEIGHT = 24;
const MAX_BAR_WIDTH = CHART_WIDTH - 80;

// 감정별 색상 정의
const EMOTION_COLORS = {
  '기쁨': '#5BC1B9',
  '슬픔': '#8DABD3',
  '불안': '#E48F66',
  '행복': '#67B68C',
  '평온': '#A593E0',
  '지침': '#C4C4C4',
  '기대': '#FFD166'
};

// 임시 감정 데이터 (실제 앱에서는 API나 로컬 저장소에서 가져옴)
const MOCK_EMOTION_DATA = {
  '2023-12-01': [
    { emotion: '슬픔', count: 2 },
    { emotion: '기쁨', count: 1 },
  ],
  '2023-12-02': [
    { emotion: '불안', count: 1 },
    { emotion: '평온', count: 1 },
  ],
  '2023-12-03': [
    { emotion: '행복', count: 2 },
  ],
  '2023-12-04': [
    { emotion: '기쁨', count: 1 },
    { emotion: '불안', count: 1 },
  ],
  '2023-12-05': [
    { emotion: '슬픔', count: 1 },
    { emotion: '지침', count: 1 },
  ],
  '2023-12-06': [
    { emotion: '기대', count: 2 },
    { emotion: '불안', count: 1 },
  ],
  '2023-12-07': [
    { emotion: '평온', count: 3 },
  ]
};

// 최근 7일간의 날짜를 생성하는 함수
const getRecentDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
};

// 주간 데이터 계산 함수
const calculateWeeklyData = () => {
  const dates = getRecentDates();
  const emotionCounts = {};
  
  // 감정별 초기화
  Object.keys(EMOTION_COLORS).forEach(emotion => {
    emotionCounts[emotion] = 0;
  });
  
  // 날짜별 감정 누적
  dates.forEach(date => {
    if (MOCK_EMOTION_DATA[date]) {
      MOCK_EMOTION_DATA[date].forEach(item => {
        emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + item.count;
      });
    }
  });
  
  // 결과 배열로 변환
  return Object.keys(emotionCounts)
    .filter(emotion => emotionCounts[emotion] > 0)
    .map(emotion => ({
      emotion,
      count: emotionCounts[emotion]
    }))
    .sort((a, b) => b.count - a.count); // 많은 순으로 정렬
};

// 월간 데이터 계산 함수 (실제로는 이 달의 데이터만 사용한다고 가정)
const calculateMonthlyData = () => {
  // 여기서는 간단히 동일한 데이터를 사용
  return calculateWeeklyData();
};

// 일별 차트 컴포넌트
const DailyChart = ({ date }) => {
  const formattedDate = date.split('-').slice(1).join('.');
  const emotions = MOCK_EMOTION_DATA[date] || [];
  const totalCount = emotions.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <View style={styles.dailyChartContainer}>
      <Text style={styles.dateLabel}>{formattedDate}</Text>
      
      {emotions.length > 0 ? (
        <View style={styles.barContainer}>
          {emotions.map((item, index) => {
            const percentage = (item.count / totalCount) * 100;
            const barWidth = (item.count / totalCount) * MAX_BAR_WIDTH;
            
            return (
              <View key={index} style={styles.barRow}>
                <Text style={styles.emotionLabel}>{item.emotion}</Text>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: barWidth, 
                        backgroundColor: EMOTION_COLORS[item.emotion] || '#ccc' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>기록 없음</Text>
        </View>
      )}
    </View>
  );
};

// 요약 차트 컴포넌트
const SummaryChart = ({ data, title }) => {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <View style={styles.summaryChartContainer}>
      <Text style={styles.summaryTitle}>{title}</Text>
      
      {data.length > 0 ? (
        <View style={styles.barContainer}>
          {data.map((item, index) => {
            const percentage = (item.count / totalCount) * 100;
            const barWidth = (item.count / totalCount) * MAX_BAR_WIDTH;
            
            return (
              <View key={index} style={styles.barRow}>
                <Text style={styles.emotionLabel}>{item.emotion}</Text>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: barWidth, 
                        backgroundColor: EMOTION_COLORS[item.emotion] || '#ccc' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>데이터 없음</Text>
        </View>
      )}
    </View>
  );
};

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState('daily');
  const [recentDates, setRecentDates] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  
  useEffect(() => {
    // 최근 7일 날짜 로드
    setRecentDates(getRecentDates());
    
    // 주간 및 월간 통계 계산
    setWeeklyData(calculateWeeklyData());
    setMonthlyData(calculateMonthlyData());
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>감정 통계</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'daily' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('daily')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'daily' && styles.activeTabText
          ]}>일별</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'weekly' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'weekly' && styles.activeTabText
          ]}>주간</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'monthly' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'monthly' && styles.activeTabText
          ]}>월간</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'daily' && (
          <View style={styles.dailyContainer}>
            <Text style={styles.sectionTitle}>최근 7일간의 감정 변화</Text>
            
            {recentDates.map((date, index) => (
              <DailyChart key={index} date={date} />
            ))}
          </View>
        )}
        
        {activeTab === 'weekly' && (
          <View style={styles.summaryContainer}>
            <SummaryChart data={weeklyData} title="이번 주 감정 요약" />
            
            <View style={styles.infoBox}>
              <IconSymbol name="info.circle" size={20} color="#8DABD3" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                최근 7일간의 감정 데이터를 기반으로 분석한 결과입니다.
              </Text>
            </View>
            
            <View style={styles.emotionLegend}>
              {Object.keys(EMOTION_COLORS).map((emotion, index) => (
                <View key={index} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.colorIndicator, 
                      { backgroundColor: EMOTION_COLORS[emotion] }
                    ]} 
                  />
                  <Text style={styles.legendText}>{emotion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'monthly' && (
          <View style={styles.summaryContainer}>
            <SummaryChart data={monthlyData} title="이번 달 감정 요약" />
            
            <View style={styles.infoBox}>
              <IconSymbol name="info.circle" size={20} color="#8DABD3" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                이번 달의 감정 데이터를 기반으로 분석한 결과입니다.
              </Text>
            </View>
            
            <View style={styles.emotionLegend}>
              {Object.keys(EMOTION_COLORS).map((emotion, index) => (
                <View key={index} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.colorIndicator, 
                      { backgroundColor: EMOTION_COLORS[emotion] }
                    ]} 
                  />
                  <Text style={styles.legendText}>{emotion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#8DABD3',
  },
  tabText: {
    fontSize: 16,
    color: '#8F9BB3',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 20,
  },
  dailyContainer: {
    marginBottom: 20,
  },
  dailyChartContainer: {
    marginBottom: 24,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 12,
  },
  barContainer: {
    width: '100%',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emotionLabel: {
    width: 40,
    fontSize: 14,
    color: '#2E3A59',
  },
  barBackground: {
    height: BAR_HEIGHT,
    backgroundColor: '#EAEAEA',
    borderRadius: BAR_HEIGHT / 2,
    width: MAX_BAR_WIDTH,
    overflow: 'hidden',
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  percentageText: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    color: '#8F9BB3',
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8F9BB3',
    fontSize: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryChartContainer: {
    marginBottom: 24,
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(141, 171, 211, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#2E3A59',
    lineHeight: 20,
  },
  emotionLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#2E3A59',
  },
}); 