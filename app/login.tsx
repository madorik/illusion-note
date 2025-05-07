import { router, Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GoogleIcon = () => (
  <Image 
    source={require('../assets/images/icon.png')} 
    style={{width: 24, height: 24, marginRight: 8}} 
  />
);

const AppleIcon = () => (
  <Image 
    source={require('../assets/images/adaptive-icon.png')} 
    style={{width: 24, height: 24, marginRight: 8}} 
  />
);

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.topSection}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>
          감정을 기록하고{'\n'}
          저장하고 싶다면{'\n'}
          로그인하세요
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => router.push('/(tabs)')}
        >
          <GoogleIcon />
          <Text>Google로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => router.push('/(tabs)')}
        >
          <AppleIcon />
          <Text>Apple로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.textLink}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.linkText}>로그인 없이 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  socialButton: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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