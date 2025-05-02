import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from '@react-navigation/elements'

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [initials, setInitials] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const headerHeight = useHeaderHeight?.() ?? 0;   // optional

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both an email and password.');
      return;
    }
    
    // Email verification sent!
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Created user with email and password');

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
        }
        else {
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
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('This email is invalid!');
        }
        console.log(error);
      });
  };

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'} keyboardVerticalOffset={headerHeight}>
        <View style={styles.container}>
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
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 20, color: '#888' }}>When signing up, you will be sent a verification email. Please click the link to confirm your email address before logging in.</Text>
        </View>
      </KeyboardAvoidingView>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    width: '80%',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});