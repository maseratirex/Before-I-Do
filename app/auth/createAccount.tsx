import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import createLogger from '@/utilities/logger';

export default function CreateAccountScreen() {
  const logger = createLogger('CreateAccountScreen');
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState('');
  const [initials, setInitials] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both an email and password.');
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        logger.info('Created user with email and password');

        //add user to firestore
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
              initials: initials,
              email: email,
              isPaired: false,
              partner: null,
              personalityDynamics: null,
              familyDynamics: null,
              coupleDynamics: null,
              cultureDynamics: null,
          });
        } else {
            throw new Error("User not authenticated");
        }
        });

        sendEmailVerification(userCredential.user)
          .then(() => {
            Alert.alert('Sent verification email');
            router.dismissTo('/auth/login');
          });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('This email is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('This email is invalid!');
        } else {
          Alert.alert(error.message);
        }
      });
  };

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
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
          />
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
          <Text style={styles.infoText}>You will be sent a verification email. Please click the link to confirm your email address before logging in.</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
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