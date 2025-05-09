import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';

const HomeScreen = ({ navigation }) => {
  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('MoodInput')}
        >
          <Icon
            style={styles.icon}
            fill='#8DABD3'
            name='plus-circle-outline'
          />
          <Text category='h6'>오늘의 감정 기록하기</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
});

export default HomeScreen;