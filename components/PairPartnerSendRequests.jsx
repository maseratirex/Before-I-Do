import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

const SendRequestsComp = ({ isPaired, hasSentRequest, setHasSentRequest, sentRequestEmail, setSentRequest }) => {
    const [email, setEmail] = useState("");

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
            const data = result.data;
            if (data.success) {
                setHasSentRequest(true) // Update the state to indicate that a request has been sent
                setSentRequest(email) // Update the state to indicate that a request has been sent
                Alert.alert("Success", "Pair request sent successfully.");
                console.log("Pair request sent successfully.");
            }
            else {
                Alert.alert("Error", "Failed to send pair request: " + data.message);
                console.log("Failed to send pair request:", data.message);
            }
        } catch (error) {
            console.log("Error sending pair requests:", error);
        }
    };

    const cancelPairRequest = async () => {
        try {
            const cancelPairRequestFunction = httpsCallable(functions, "cancelPairingRequest");
            const auth = getAuth();
            const myParams = {
                user: auth.currentUser?.uid,
            }
            const result = await cancelPairRequestFunction(myParams);
            const data = result.data;
            if (data.success) {
                setHasSentRequest(false) // Update the state to indicate that a request has been sent
                setSentRequest("") // Update the state to indicate that a request has been sent
                Alert.alert("Success", "Pair request cancelled successfully.");
                console.log("Pair request cancelled successfully.");
            }
            else {
                Alert.alert("Error", "Failed to cancel pair request: " + data.message);
                console.log("Failed to cancel pair request:", data.message);
            }
        } catch (error) {
            console.log("Error cancelling pair requests:", error);
        }
    };

    const sentRequestReturn = () => {
        return (
            <View style={styles.container}> 
                <Text style={styles.title}>Pairing Request Sent</Text>
                <Text style={styles.message}>You have already sent a pairing request to {sentRequestEmail}.</Text>
                <TouchableOpacity style={styles.button} onPress={cancelPairRequest}>
                    <Text style={styles.buttonText}>Cancel Request</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const noSentRequestReturn = () => {
        return (
            <View style={styles.container}> 
                <Text style={styles.title}>Partner Email</Text>
                <View style={styles.emailRequest}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.button} onPress={sendPairRequest}>
                        <Text style={styles.buttonText}>Send Pair Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (isPaired ? <View></View> : (hasSentRequest ? sentRequestReturn() : noSentRequestReturn()));
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "90%",
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: "white",
      borderRadius: 16,
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 6,
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
        fontSize: 15,
        fontWeight: "bold",
        color: "#4a4a4a",
        paddingBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9,
        marginRight: 15,
    },
    button: {
        width: '100%',
        padding: 8,
        backgroundColor: '#FF9FB8',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
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
    emailRequest: {
        // flexDirection: 'row',
  },
    message: {
        marginBottom: 20,

    },
});

export default SendRequestsComp;