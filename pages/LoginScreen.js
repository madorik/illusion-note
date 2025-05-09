import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';

const GoogleIcon = (props) => (
  <Image 
    source={require('../assets/google-icon.png')} 
    style={{width: 24, height: 24, marginRight: 8}} 
  />
);

const AppleIcon = (props) => (
  <Image 
    source={require('../assets/apple-icon.png')} 
    style={{width: 24, height: 24, marginRight: 8}} 
  />
);

const LoginScreen = ({ navigation }) => {
  return (
    <Layout style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require('../assets/journal-icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title} category='h4'>
          기록을 인정하고{'\n'}
          저장하고 실다면{'\n'}
          로그인하세요
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.socialButton}
          appearance='outline'
          accessoryLeft={GoogleIcon}
          onPress={() => navigation.navigate('Main')}
        >
          Google로 로그인
        </Button>

        <Button
          style={styles.socialButton}
          appearance='outline'
          accessoryLeft={AppleIcon}
          onPress={() => navigation.navigate('Main')}
        >
          Apple로 로그인
        </Button>

        <TouchableOpacity 
          style={styles.textLink}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.linkText}>로그인 없이 시작</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  socialButton: {
    marginVertical: 8,
    borderRadius: 8,
  },
  textLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#8F9BB3',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;