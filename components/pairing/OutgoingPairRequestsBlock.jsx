import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import createLogger from '@/utilities/logger';

export default function OutgoingPairRequestsBlock({ hasSentRequest, setHasSentRequest, sentRequestEmail, setSentRequest }) {
    const [email, setEmail] = useState("");
    const logger = createLogger('OutgoingPairRequestsBlock');

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
                logger.info("Pair request sent successfully.");
            }
            else {
                Alert.alert("Error", "Failed to send pair request: " + data.message);
                logger.error("Failed to send pair request:", data.message);
            }
        } catch (error) {
            logger.error("Error sending pair requests:", error);
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
                logger.info("Pair request cancelled successfully.");
            }
            else {
                Alert.alert("Error", "Failed to cancel pair request: " + data.message);
                logger.error("Failed to cancel pair request:", data.message);
            }
        } catch (error) {
            logger.error("Error cancelling pair requests:", error);
        }
    };

    const confirmSendPairRequest = () => {
        Alert.alert(
            'Confirm pairing',
            'Pairing will share your questionnaire responses',
            [
            { 
                text: 'Cancel',
                onPress: () => logger.info('Cancelled pairing'), 
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => sendPairRequest(),
            }
            ],
            { cancelable: false }
        );
    }

    if(hasSentRequest) {
        return (
            <View>
                <View style={styles.divider} />
                <View style={styles.spacing}>
                    <Text style={styles.subheading}>Invite partner</Text>
                    <Text style={styles.body}>You have sent a pairing request to {sentRequestEmail}.</Text>
                    <TouchableOpacity style={styles.button} onPress={cancelPairRequest}>
                        <Text style={styles.buttonText}>Cancel Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <View>
                <View style={styles.divider} />
                <View style={styles.spacing}>
                    <Text style={styles.subheading}>Invite Partner</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.button} onPress={confirmSendPairRequest}>
                        <Text style={styles.buttonText}>Send Request</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 10,
    },
    spacing: {
        gap: 10,
    },
    subheading: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#4a4a4a",
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9,
    },
    button: {
        padding: 8,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,

    },
    buttonText: {
        color: '#4a4a4a',
        fontSize: 15,
        lineHeight: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    invitePartnerBox: {
        width: "100%",
    },
    body: {
        color: '#4a4a4a',
    },
});
