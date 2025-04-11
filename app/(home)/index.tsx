import { View, StyleSheet, Text, Button, TouchableOpacity, Alert, FlatList, TextInput } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebaseConfig'
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  var pairRequestsArray: string[] = [];
  var pairRequestTimesArray: string[] = [];
  const length = 0;
  const [pairRequests, setPairRequests] = useState(
    new Map(
      Array.from({ length }, (_, i) => [
        i,
        {
          id: i,
          email: "",
          timestamp: "",
          isDesired: false,
        },
      ])
    )
  );
  var sentRequest = "";

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });

  const sendPairRequest = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    try {
      const sendPairRequestFunction = httpsCallable(functions, "pairRequest");
      const auth = getAuth();
      const myParams = {
        email: email,
        user: auth.currentUser?.uid,
      }
      const result = await sendPairRequestFunction(myParams);
      const data = result.data as { success: boolean; message?: string };
      if (data.success) {
        Alert.alert("Success", "Pair request sent successfully.");
        console.log("Pair request sent successfully.");
        sentRequest = email;
      }
      else {
        Alert.alert("Error", "Failed to send pair request: " + data.message);
        console.log("Failed to send pair request:", data.message);
      }
    } catch (error) {
      console.log("Error sending pair requests:", error);
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
      const data = result.data as { success: boolean; message?: string; emails?: string[]; timestamps?: string[] };
      if (data.success) {
        pairRequestsArray = data.emails || [];
        pairRequestTimesArray = data.timestamps || [];
      }
      else {
        pairRequestsArray = [];
        pairRequestTimesArray = [];
      }
      for (let i = 0; i < pairRequestsArray.length; i++) {
        const pairRequest = {
          id: i,
          email: pairRequestsArray[i],
          timestamp: pairRequestTimesArray[i],
          isDesired: false,
        };
        setPairRequests((prev) => new Map(prev).set(i, pairRequest));
      }
    } catch (error) {
      console.log("Error checking pair requests:", error);
    }
  }

  const acceptPairRequest = async (email: string) => {
    try {
      const confirmPairRequestFunction = httpsCallable(functions, "confirmPairing");
      const auth = getAuth();
      const myParams = {
        email: email,
        user: auth.currentUser?.uid,
      }
      const result = await confirmPairRequestFunction(myParams);
      const data = result.data as { success: boolean; message?: string };
      if (data.success) {
        Alert.alert("Success", "Successfully confirmed pair request with " + email + ".");
        console.log("Successfully paired with " + email + ".");
      }
      else {
        Alert.alert("Error", "Failed to confirm pair request: " + data.message);
        console.log("Failed to confirm pair request:", data.message);
      }
    } catch (error) {
      console.log("Error confirming pair requests:", error);
    }
  }

  seePairRequests();

  const renderPairRequest = ({ item }: { item: { id: number; email: string; timestamp: string; isDesired: boolean } }) => {
    return (
      <View style={styles.smallContainer}>
        <Text style={styles.emailText}>{item.email + " at " + item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>    
      <TouchableOpacity style={styles.button} onPress={() => { router.push('/directory') }}>
        <Text style={styles.buttonText}>Take Assessment</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Pair with Partner</Text>
      <FlatList
        style={styles.list}
        data={Array.from(pairRequests.values())}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPairRequest}
      />
      <Text style={styles.title}>Enter Partner's Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={sendPairRequest}>
        <Text style={styles.buttonText}>Send Pair Request</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{"Current Pair Request: " + sentRequest}</Text>
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
    list: {
      width: '100%',
      flexGrow: 0,
    },
    smallContainer: {
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
    emailText: {
      marginTop: 15,
      color: '#000000',
      fontSize: 14,
  },
});