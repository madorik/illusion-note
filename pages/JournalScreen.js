import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Button, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const JournalScreen = ({ navigation }) => {
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
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            당신의 정정을{'\n'}
            '슬픔' 이예요.
          </Text>
        </View>
        
        <View style={styles.messageBox2}>
          <Text style={styles.messageText}>
            이 상정이는{'\n'}
            '이별 맞춰 서고' 정정이 있어요...
          </Text>
        </View>
        
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            당신의 정정은 아쉬워니다.{'\n'}
            하지만 이렇게도 정정하실 수 있으...
          </Text>
        </View>
        
        <View style={styles.messageBox2}>
          <Text style={styles.messageText}>
            그 사람이 와줄 날 이후로{'\n'}
            당신을 설어해서는 안닌 수 있오.
          </Text>
        </View>
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

export default JournalScreen;