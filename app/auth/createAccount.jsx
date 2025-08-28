import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import createLogger from '@/utilities/logger';
import { auth, db } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAccountScreen() {
  const logger = createLogger('CreateAccountScreen');
  const [email, setEmail] = useState('');
  const [initials, setInitials] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both an email and password.');
      return;
    }

    if (!initials || initials.trim().length === 0) {
      Alert.alert('Please enter your initials.');
      return;
    }

    try {
      logger.info('Starting account creation process');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      logger.info('Created user with email and password');

      const user = userCredential.user;
      logger.info(`User created with UID: ${user.uid}`);

      // Add user to firestore
      try {
        logger.info('Creating user document in Firestore');
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          initials: initials.trim(),
          email: email,
          isPaired: false,
          partner: null,
          answers: null,
        });
        logger.info('Successfully created user document in Firestore');

        // Save initials to AsyncStorage
        logger.info('Saving initials to AsyncStorage');
        await AsyncStorage.setItem(`initials-${user.uid}`, initials.trim());
        logger.info("Successfully saved initials to AsyncStorage");
      } catch (firestoreError) {
        logger.error('Failed to create user document or save initials:', firestoreError);
        Alert.alert('Error', 'Failed to complete account setup. Please try again.');
        return;
      }

      // Send verification email
      try {
        logger.info("Sending verification email");
        await sendEmailVerification(userCredential.user);
        Alert.alert('Verification Email Sent', 'Please check your email and click the verification link before logging in.');
        router.dismissTo('/auth/login');
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        Alert.alert('Warning', 'Account created but failed to send verification email. You can request a new verification email when logging in.');
        router.dismissTo('/auth/login');
      }
    } catch (error) {
      logger.error('Account creation failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email In Use', 'This email is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'This email is invalid!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Weak Password', 'Password should be at least 6 characters.');
      } else {
        Alert.alert('Error', error.message || 'An error occurred during account creation.');
      }
    }
  };

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView style={styles.root} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Initials"
            keyboardType="default"
            autoCapitalize="characters"
            onChangeText={setInitials}
            value={initials}
            maxLength={3}
            placeholderTextColor="#888"
            spellCheck={false}
          />
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
          <Text style={styles.infoText}>You will be sent a verification email. Please click the link to confirm your email address before logging in.</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
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
    // flexGrow: 1,
    paddingTop: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  title: {
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
  infoText: {
    fontSize: 14,
    width: '75%',
    color: '#4A4A4A',
    textAlign: 'center',
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
});