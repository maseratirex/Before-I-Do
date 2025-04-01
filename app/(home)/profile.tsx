import { View, StyleSheet, TouchableOpacity, Text, Alert, TextInput } from "react-native";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig"; // Ensure this is correctly configured

export default function ProfileScreen() {
  const [email, setEmail] = useState("");

  const sendEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    try {
      const sendEmailFunction = httpsCallable(functions, "sendEmail");
      await sendEmailFunction({ email });
      Alert.alert("Success", "Email sent successfully!");
    } catch (error) {
      Alert.alert("Profile found Errorss", error.message || "Failed to send email.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Partner's Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={sendEmail}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { 
        signOut(auth).catch((error) => {
          Alert.alert('Sign Out Failed', error.message);
        });
      }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

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
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 15,
        color: '#007bff',
        fontSize: 14,
    },
});