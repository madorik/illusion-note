import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Layout, Text, Button, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const MoodInputScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { id: 'happy', emoji: '😊', text: '어좋' },
    { id: 'neutral', emoji: '😐', text: '보통' },
    { id: 'tired', emoji: '😔', text: '지침' },
    { id: 'sad', emoji: '😢', text: '지친함' },
    { id: 'angry', emoji: '😠', text: '트러움' },
  ];

  const periods = [
    { id: 'morning', text: '아침 일찍' },
    { id: 'afternoon', text: '점심 후반' },
    { id: 'evening', text: '저녁임' },
  ];

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        title=''
      />
      
      <View style={styles.content}>
        <Text style={styles.title} category='h5'>
          오늘 당신의 정정을{'\n'}
          들려주세요
        </Text>
        
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>
            수마음을 자유롭게 적어보세요...
          </Text>
        </View>
        
        <View style={styles.moodContainer}>
          {moods.map((mood) => (
            <TouchableOpacity 
              key={mood.id}
              style={[
                styles.moodItem,
                selectedMood === mood.id && styles.selectedMood
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text style={styles.moodText}>{mood.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.periodContainer}>
          {periods.map((period) => (
            <TouchableOpacity 
              key={period.id}
              style={styles.periodItem}
            >
              <View style={styles.periodDot} />
              <Text>{period.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Button 
          style={styles.aiButton}
          onPress={() => navigation.navigate('Journal')}
        >
          AI 분석 하기
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    lineHeight: 32,
  },
  inputBox: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  inputText: {
    color: '#8F9BB3',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodItem: {
    alignItems: 'center',
    width: 60,
  },
  selectedMood: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    padding: 4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
  },
  periodContainer: {
    marginBottom: 24,
  },
  periodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8F9BB3',
    marginRight: 8,
  },
  aiButton: {
    backgroundColor: '#8DABD3',
    borderColor: '#8DABD3',
    borderRadius: 8,
  },
});

export default MoodInputScreen;