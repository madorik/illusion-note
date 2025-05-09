import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Mock data for journal entries
const mockJournalEntries = {
  '2025-05-03': [
    { id: '7', title: '봄날의 산책', emotion: '행복', time: '11:30 AM' },
    { id: '8', title: '오랜만의 여유', emotion: '평온', time: '04:45 PM' },
  ],
  '2025-05-10': [
    { id: '9', title: '새 프로젝트 시작', emotion: '기대', time: '09:20 AM' },
    { id: '10', title: '저녁 요리 도전', emotion: '기쁨', time: '07:30 PM' },
  ],
  '2025-05-15': [
    { id: '11', title: '중요한 결정', emotion: '걱정', time: '03:15 PM' },
  ],
  '2025-05-22': [
    { id: '12', title: '친구와의 갈등', emotion: '슬픔', time: '08:40 PM' },
  ],
  '2025-05-27': [
    { id: '13', title: '문제 해결', emotion: '안도', time: '02:25 PM' },
    { id: '14', title: '미래 계획', emotion: '희망', time: '10:10 PM' },
  ],
  '2025-12-01': [
    { id: '1', title: '힘든 하루', emotion: '슬픔', time: '10:30 AM' },
    { id: '2', title: '친구와의 대화', emotion: '기쁨', time: '08:00 PM' },
  ],
  '2025-12-05': [
    { id: '3', title: '시험 준비', emotion: '불안', time: '04:15 PM' },
  ],
  '2025-12-10': [
    { id: '4', title: '가족 모임', emotion: '행복', time: '01:00 PM' },
    { id: '5', title: '생각 정리', emotion: '평온', time: '10:45 PM' },
  ],
  '2025-12-15': [
    { id: '6', title: '새로운 계획', emotion: '기대', time: '09:30 AM' },
  ],
};

// Get current date
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate dates for calendar
const generateCalendarDates = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  
  const startDay = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
  const calendarDays = [];
  
  // Add empty days to align first day of month correctly
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: '', date: '' });
  }
  
  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = String(i).padStart(2, '0');
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${dayStr}`;
    calendarDays.push({ 
      day: i, 
      date: dateStr,
      hasEntries: mockJournalEntries[dateStr] ? true : false,
      entries: mockJournalEntries[dateStr] || []
    });
  }
  
  return calendarDays;
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const { width } = Dimensions.get('window');
const DAY_SIZE = (width - 40) / 7; // Calendar cell size

export default function RecordsScreen() {
  const today = new Date();
  // Use 2025 as the default year to match our mock data
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(5); // May
  const [selectedDate, setSelectedDate] = useState('2025-05-10'); // A date with mock data
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const calendarHeight = new Animated.Value(isCalendarExpanded ? 1 : 0);
  
  // 애니메이션 및 슬라이드 관련 상태
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [slideDirection, setSlideDirection] = useState(null);
  
  useEffect(() => {
    const days = generateCalendarDates(selectedYear, selectedMonth);
    setCalendarDays(days);
    
    // Set entries for selected date if available
    if (mockJournalEntries[selectedDate]) {
      setSelectedEntries(mockJournalEntries[selectedDate]);
    } else {
      setSelectedEntries([]);
    }
  }, [selectedYear, selectedMonth, selectedDate]);

  // 날짜 변경 함수 (일자 기준) - 완전히 재작성
  const changeDate = (direction) => {
    // 현재 선택된 날짜를 Date 객체로 변환
    const currentDateParts = selectedDate.split('-');
    const currentDate = new Date(
      parseInt(currentDateParts[0]), 
      parseInt(currentDateParts[1]) - 1, // 월은 0-11로 표현
      parseInt(currentDateParts[2])
    );
    
    // 이전 또는 다음 날짜로 이동
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 새 날짜 정보 추출
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 다시 1-12로 변환
    const day = currentDate.getDate();
    
    // 날짜 형식으로 변환
    const newDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 월이 변경되었으면 캘린더 데이터도 업데이트
    if (month !== selectedMonth || year !== selectedYear) {
      setSelectedYear(year);
      setSelectedMonth(month);
    }
    
    setSelectedDate(newDateStr);
  };
  
  // 슬라이드 애니메이션 실행 - 개선
  const animateSlide = (direction) => {
    setSlideDirection(direction);
    
    // 시작 위치 설정
    slideAnim.setValue(direction === 'prev' ? -300 : 300);
    
    // 애니메이션 실행
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  };
  
  // 통합된 날짜 이동 핸들러 - 새 함수 추가
  const handleDateChange = (direction) => {
    // 날짜 변경만 수행
    changeDate(direction);
  };
  
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(12);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };
  
  const selectDate = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const viewJournalDetail = (entry) => {
    router.push({
      pathname: '/journal-detail',
      params: { 
        id: entry.id,
        title: entry.title,
        emotion: entry.emotion
      }
    });
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.entryItem}
      onPress={() => viewJournalDetail(item)}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <Text style={styles.entryTime}>{item.time}</Text>
      </View>
      <View style={styles.entryFooter}>
        <View style={styles.emotionBadge}>
          <Text style={styles.emotionText}>{item.emotion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const toggleCalendar = () => {
    const toValue = isCalendarExpanded ? 0 : 1;
    Animated.timing(calendarHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  // 날짜 네비게이션 컴포넌트 - 수정
  const DateNavigation = () => (
    <View style={styles.dateNavigationContainer}>
      <TouchableOpacity 
        onPress={() => handleDateChange('prev')}
        style={styles.dateNavigationButton}
      >
        <IconSymbol name="chevron.left" size={20} color="#8DABD3" />
      </TouchableOpacity>
      
      <View style={styles.dateDisplayContainer}>
        <Text style={styles.currentDateText}>
          {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={() => handleDateChange('next')}
        style={styles.dateNavigationButton}
      >
        <IconSymbol name="chevron.right" size={20} color="#8DABD3" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 기록</Text>
      </View>
      
      <View style={styles.content}>
        {/* Calendar Header with Toggle */}
        <View style={styles.calendarHeader}>
          <View style={styles.calendarHeaderRow}>
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <IconSymbol name="chevron.left" size={24} color="#2E3A59" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{selectedYear}년 {selectedMonth}월</Text>
            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <IconSymbol name="chevron.right" size={24} color="#2E3A59" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Animated.View style={[
          styles.calendarContainer,
          {
            maxHeight: calendarHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 260]
            }),
            opacity: calendarHeight,
            overflow: 'hidden'
          }
        ]}>
          {/* Weekday Headers */}
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day, index) => (
              <View key={index} style={styles.weekdayCell}>
                <Text style={[
                  styles.weekdayText,
                  index === 0 ? styles.sundayText : null,
                  index === 6 ? styles.saturdayText : null
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  selectedDate === item.date ? styles.selectedDayCell : null,
                  !item.day ? styles.emptyCell : null
                ]}
                onPress={() => item.day ? selectDate(item.date) : null}
                disabled={!item.day}
              >
                {item.day ? (
                  <>
                    <Text style={[
                      styles.dayText,
                      selectedDate === item.date ? styles.selectedDayText : null,
                      index % 7 === 0 ? styles.sundayText : null,
                      index % 7 === 6 ? styles.saturdayText : null
                    ]}>
                      {item.day}
                    </Text>
                    {item.hasEntries && (
                      <View style={styles.entryDot} />
                    )}
                  </>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        {/* Divider with Toggle Button */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={toggleCalendar}
          >
            <Text style={styles.toggleText}>
              {isCalendarExpanded ? '접기' : '펼치기'}
            </Text>
            <IconSymbol 
              name="chevron.left" 
              size={18} 
              color="#8DABD3" 
              style={{ 
                transform: [{ rotate: isCalendarExpanded ? '90deg' : '-90deg' }], 
                marginLeft: 4 
              }}
            />
          </TouchableOpacity>
          <View style={styles.dividerLine} />
        </View>
        
        {/* 날짜 네비게이션 표시 */}
        <DateNavigation />
        
        {/* 스와이프 가능한 일기 컨테이너 */}
        <Animated.View 
          style={[
            styles.swipeContainer,
          ]}
        >
          {selectedEntries.length > 0 ? (
            <FlatList
              data={selectedEntries}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.entriesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="doc.text" size={40} color="#8F9BB3" />
              <Text style={styles.emptyText}>이 날에는 기록이 없습니다.</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => router.push('/mood-input')}
              >
                <Text style={styles.createButtonText}>새 기록 작성하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  calendarHeader: {
    marginBottom: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    width: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  sundayText: {
    color: '#E73D57',
  },
  saturdayText: {
    color: '#4CA6FF',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedDayCell: {
    backgroundColor: '#8DABD3',
    borderRadius: DAY_SIZE / 2,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  entryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E48F66',
    marginTop: 4,
  },
  entriesContainer: {
    flex: 1,
  },
  entriesList: {
    paddingBottom: 40,
    flex: 1,
  },
  entryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  entryTime: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  entryFooter: {
    flexDirection: 'row',
  },
  emotionBadge: {
    backgroundColor: 'rgba(141, 171, 211, 0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  emotionText: {
    fontSize: 12,
    color: '#8DABD3',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8F9BB3',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#8DABD3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  toggleButton: {
    width: 90,
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  toggleText: {
    fontSize: 13,
    color: '#8DABD3',
    fontWeight: '500',
  },
  
  // 새로 추가된 스타일
  swipeContainer: {
    flex: 1,
    width: '100%',
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  dateNavigationButton: {
    padding: 10,
  },
  dateDisplayContainer: {
    backgroundColor: '#F5F9FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B86E5',
    textAlign: 'center',
  },
}); 