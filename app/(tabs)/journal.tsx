import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            당신의 감정은{'\n'}
            '슬픔'이에요.
          </Text>
        </View>
        
        <View style={styles.messageBox2}>
          <Text style={styles.messageText}>
            이 감정에는{'\n'}
            '이별을 맞이하고' 있는 느낌이 있어요...
          </Text>
        </View>
        
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            당신의 감정은 아쉬워요.{'\n'}
            하지만 이렇게도 생각하실 수 있어요...
          </Text>
        </View>
        
        <View style={styles.messageBox2}>
          <Text style={styles.messageText}>
            그 사람이 떠난 이후로도{'\n'}
            당신은 스스로를 사랑해야 해요.
          </Text>
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
  messageBox: {
    backgroundColor: '#D6E4FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageBox2: {
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    lineHeight: 24,
  },
}); 