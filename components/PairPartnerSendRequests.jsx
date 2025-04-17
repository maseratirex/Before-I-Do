import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SendRequestsComp = ({ isPaired, hasSentRequest, setHasSentRequest }) => {
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

    const sentRequestReturn = () => {
        return (
            <View style={styles.container}> 
                <Text style={styles.title}>Pairing Request Sent</Text>
                <Text style={styles.message}>You have already sent a pairing request.</Text>
            </View>
        );
    }

    const noSentRequestReturn = () => {
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
                <TouchableOpacity style={styles.button} onPress={sendPairRequest}>
                    <Text style={styles.buttonText}>Send Pair Request</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (isPaired ? <View></View> : (hasSentRequest ? sentRequestReturn() : noSentRequestReturn()));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ff0',
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

export default SendRequestsComp;