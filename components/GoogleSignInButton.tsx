import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import useGoogleAuth from '../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  onLoginSuccess?: (userInfo: any) => void;
  onLoginFail?: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onLoginSuccess,
  onLoginFail,
}) => {
  const { signIn, loading, error, userInfo } = useGoogleAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (userInfo && onLoginSuccess) {
      onLoginSuccess(userInfo);
      setIsProcessing(false);
    }
  }, [userInfo, onLoginSuccess]);

  React.useEffect(() => {
    if (error && onLoginFail) {
      onLoginFail(error);
      setIsProcessing(false);
    }
  }, [error, onLoginFail]);

  const handleSignIn = async () => {
    try {
      setIsProcessing(true);
      await signIn();
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setIsProcessing(false);
    }
  };

  const isDisabled = loading || isProcessing;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={handleSignIn}
      disabled={isDisabled}
    >
      <View style={styles.buttonContent}>
        <View style={styles.googleIconContainer}>
          <FontAwesome name="google" size={18} color="#FFFFFF" />
        </View>
        {isDisabled ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4285F4" />
            <Text style={styles.loadingText}>로그인 중...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Google로 로그인</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    marginVertical: 10,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default GoogleSignInButton; 