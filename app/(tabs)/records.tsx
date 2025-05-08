import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const calendarHeight = new Animated.Value(isCalendarExpanded ? 1 : 0);
  
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
    // Navigate to journal detail screen with entry data
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
        
        {/* Journal Entries List - Now Scrollable */}
        {selectedEntries.length > 0 ? (
          <FlatList
            ListHeaderComponent={() => (
              <Text style={styles.entriesTitle}>
                {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일의 기록
              </Text>
            )}
            data={selectedEntries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.entriesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.entriesContainer}>
            <Text style={styles.entriesTitle}>
              {selectedDate.split('-')[1]}월 {selectedDate.split('-')[2]}일의 기록
            </Text>
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
          </View>
        )}
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
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
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
    marginBottom: 20,
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
}); 