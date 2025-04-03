import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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