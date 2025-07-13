import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from 'expo-splash-screen';
import { InteractionManager } from 'react-native';
import createLogger from '@/utilities/logger';

export default function LoginScreen() {
  const logger = createLogger('LoginScreen');
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [hasLaidOut, setHasLaidOut] = useState(false);

  const onLayoutRootView = useCallback(() => {
    setHasLaidOut(true);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) {
          // Signed in 
          router.replace('/');
        } else {
          Alert.alert('Please verify your email or resend email verification');
        }
      })
      .catch((error) => {
        Alert.alert('Incorrect email or password');
      });
  };

  useEffect(() => {
    if (!hasLaidOut) return;
  
    // Wait for all interactions first
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      logger.info('Hiding splash screen in 1 s');
  
      const timer = setTimeout(async () => {
        logger.info('Actually hiding splash screen');
        SplashScreen.hide();
      }, 1000);
  
      // clean-up the timer if the component unmounts early
      return () => clearTimeout(timer);
    });
  
    // clean-up the InteractionManager handle
    return () => interactionHandle.cancel();
  }, [hasLaidOut]);

  return (
    <LinearGradient onLayout={onLayoutRootView} colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
          <View style={styles.titleAndButtonsContainer}>
            <Text style={styles.title}>Sign in</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Don't have an account?</Text>
            <Text style={[styles.buttonText, styles.blueText]} onPress={() => { router.push('./createAccount') }}>
              Sign Up
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1, // Occupy the entire screen vertically and horizontally.
    // ScrollView requires a bounded height; flex: 1 informs the LinearGradient's child
    // that the height is the entire screen
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleAndButtonsContainer: {
    paddingTop: 170,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    // marginTop: 170,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    width: '83%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  blueText: {
    color: '#007AFF',
  },
  textContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 40,
  }
});