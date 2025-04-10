import { View, StyleSheet, TouchableOpacity, Text, Alert, TextInput } from "react-native";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig"; // Ensure this is correctly configured
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");

  const sendEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    try {
      const sendPairRequestFunction = httpsCallable(functions, "pairRequest");
      const auth = getAuth();
      console.log("user signed in", auth.currentUser?.email);
      const myParams = {
        email: email,
        user: auth.currentUser?.uid,
      }
      const result = await sendPairRequestFunction(myParams);
      console.log("send request info:", JSON.stringify(result));
      Alert.alert("Success", JSON.stringify(result));
    } catch (error) {
      console.log("Error checking pair requests:", error);
      Alert.alert("Profile found Errors", error.message || "Failed to send email.");
    }
  };

  const seePairRequests = async () => {
    try {
      const checkPairRequestFunction = httpsCallable(functions, "checkPairRequest");
      const auth = getAuth();
      const myParams = {
        user: auth.currentUser?.uid,
      }
      const result = await checkPairRequestFunction(myParams);
      console.log("get request info:", JSON.stringify(result));
      Alert.alert("Success", JSON.stringify(result));
      
      //const result = await checkPairRequestFunction({ user: user.uid});
      //console.log("Pair Requests:", result);
    } catch (error) {
      console.log("Error checking pair requests:", error);
      Alert.alert("Profile found Errors", error.message || "Failed to send email.");
    }
  }

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
      <TouchableOpacity style={styles.button} onPress={seePairRequests}>
        <Text style={styles.buttonText}>See Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {
        const auth = getAuth(); 
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