import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from 'expo-splash-screen';
import { InteractionManager } from 'react-native';
import createLogger from '@/utilities/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "@/firebaseConfig";

export default function LoginScreen() {
  const logger = createLogger('LoginScreen');

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

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        Alert.alert('Please verify your email or resend email verification');
        return;
      }
      await handleSuccessfulLogin(userCredential.user.uid);
      router.replace('/');
    } catch (error) {
      Alert.alert('Incorrect email or password');
    }
  };

  const handleSuccessfulLogin = async (userId) => {
    logger.info("Email verified. Handling successful login");
    const submittedStorageKey = userId + 'assessment-submitted';
    const assessmentSubmittedResponse = await AsyncStorage.getItem(submittedStorageKey);
    if (assessmentSubmittedResponse !== null) {
      logger.info("Assessment already submitted");
      return; // Successful login handled a previous time, no need to load answers
    }

    await loadUserData(userId);
  }

  const loadUserData = async (userId) => {
    logger.info("Loading user data from Firestore");
    const userDocSnap = await getDoc(doc(db, "users", userId));
    if (!userDocSnap.exists()) {
      logger.info("User data not found in Firestore");
      await markAssessmentAsNotSubmitted(userId);
      return;
    }

    const answers = userDocSnap.data().answers;
    if (answers === null) {
      logger.info("Firestore answers not found");
      await markAssessmentAsNotSubmitted(userId);
    } else {
      logger.info("Firestore answers found");
      await markAssessmentAsSubmitted(userId);
      await saveAnswersToLocalStorage(userId, answers);
    }

    const userInitials = userDocSnap.data().initials;
    if (userInitials === null) {
      logger.warn("No initials found in Firestore");
      return;
    }
    await saveUserInitials(userId, userInitials);
    logger.info("Saved initials to AsyncStorage");
  }

  const markAssessmentAsNotSubmitted = async (userId) => {
    logger.info("Storing assessment submitted in local storage as false");
    try {
      const submittedStorageKey = userId + 'assessment-submitted'
      await AsyncStorage.setItem(submittedStorageKey, JSON.stringify(false));
    } catch (e) {
      logger.error('Failed to save assessment status', e);
    }
  }

  const markAssessmentAsSubmitted = async (userId) => {
    logger.info("Storing assessment submitted in local storage as true");
    try {
      const submittedStorageKey = userId + 'assessment-submitted'
      await AsyncStorage.setItem(submittedStorageKey, JSON.stringify(true));
    } catch (e) {
      logger.error('Failed to save assessment status', e);
    }
  }

  const saveAnswersToLocalStorage = async (userId, answers) => {
    logger.info("Storing answers in local storage");
    const sectionNames = ["Personality", "Family", "Couple", "Cultural"];
    for (let sectionName of sectionNames) {
      const sectionStorageKey = `answers-${userId}-${sectionName}`;
      try {
        await AsyncStorage.setItem(sectionStorageKey, JSON.stringify(answers[sectionName]));
        logger.info(`Saved answers for ${sectionName} in local storage`);
      } catch (error) {
        logger.error(`Error saving answers for ${sectionName} in local storage:`, error);
      }
    }
  }

  const saveUserInitials = async (userId, initials) => {
    logger.info("Storing initials in local storage");
    try {
      await AsyncStorage.setItem(`initials-${userId}`, initials);
    } catch (e) {
      logger.error('Failed to save initials', e);
    }
  }

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
              spellCheck={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              placeholderTextColor="#888"
              spellCheck={false}
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