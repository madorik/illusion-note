import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// TabBarIcon - 메인 앱의 TabBarIcon과 동일한 스타일 적용
function TabBarIcon(props: {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  color: string;
}) {
  return <IconSymbol size={28} style={{ marginBottom: -3 }} {...props} />;
}

export function FooterTabs({ activeTab = 'home' }) {
  const tabs = [
    { key: 'home', icon: 'house.fill', label: '홈', path: '/(tabs)' },
    { key: 'records', icon: 'book.fill', label: '기록', path: '/(tabs)/records' },
    { key: 'stats', icon: 'chart.line.uptrend.xyaxis.fill', label: '통계', path: '/(tabs)/stats' },
    { key: 'settings', icon: 'gear', label: '설정', path: '/(tabs)/settings' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity 
          key={tab.key}
          style={styles.tabItem} 
          onPress={() => router.push(tab.path)}
        >
          <TabBarIcon 
            name={tab.icon} 
            color={tab.key === activeTab ? '#8DABD3' : '#8F9BB3'} 
          />
          <Text style={[
            styles.tabText, 
            tab.key === activeTab && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// 메인 앱의 탭 바 스타일과 정확히 일치하도록 조정
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    height: 49,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    color: '#8F9BB3',
  },
  activeTabText: {
    color: '#8DABD3',
  }
}); 