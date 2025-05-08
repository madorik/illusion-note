import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from './IconSymbol';

// 메인 앱의 TabBarIcon과 동일한 구현
function TabBarIcon(props: {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  color: string;
}) {
  return <IconSymbol size={28} style={{ marginBottom: -3 }} {...props} />;
}

// 탭 정의
const tabs = [
  { key: 'home', icon: 'house.fill', label: '홈', path: '/(tabs)' },
  { key: 'records', icon: 'book.fill', label: '기록', path: '/(tabs)/records' },
  { key: 'stats', icon: 'chart.line.uptrend.xyaxis.fill', label: '통계', path: '/(tabs)/stats' },
  { key: 'settings', icon: 'gear', label: '설정', path: '/(tabs)/settings' }
];

export function AppTabBar({ activeTab = 'home' }) {
  const handlePress = (path: string) => {
    // iOS에서 햅틱 피드백 제공
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(path);
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <Pressable 
          key={tab.key}
          style={styles.tabItem} 
          onPress={() => handlePress(tab.path)}
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
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
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