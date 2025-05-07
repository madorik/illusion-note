import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <IconSymbol
              style={styles.userIcon}
              name="person"
              color="#8F9BB3"
              size={32}
            />
            <View>
              <Text>user@example.com</Text>
              <Text style={styles.hintText}>email</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>로그아웃</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>데이터 저장하기</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>주간 감정 변화</Text>
          <View style={styles.chart}>
            <Text style={styles.chartText}>차트 데이터가 이곳에 표시됩니다</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  userCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    marginRight: 16,
  },
  hintText: {
    color: '#8F9BB3',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    height: 180,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    color: '#8F9BB3',
  },
}); 