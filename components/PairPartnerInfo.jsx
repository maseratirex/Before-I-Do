import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const PairingInfo = ({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest }) => {
    const unpairUsers = async () => {
        try {
            const unpairFunction = httpsCallable(functions, "unpair");
            const auth = getAuth();
            const myParams = {
                user: auth.currentUser?.uid,
            }
            const result = await unpairFunction(myParams);
            const data = result.data;
            if (data.success) {
                setIsPaired(false);
                Alert.alert("Success", "Successfully unpaired.");
                console.log("Successfully unpaired.");
            }
            else {
                Alert.alert("Error", "Failed to unpair: " + data.message);
                console.log("Failed to unpair:", data.message);
            }
        } catch (error) {
            console.log("Error unpairing:", error);
        }
    }
    
    return (
        <View style={styles.container}>
        {isPaired ? <View><Text>You are paired with someone.</Text><TouchableOpacity style={styles.button} onPress={unpairUsers}><Text>Unpair</Text></TouchableOpacity></View> : 
         hasSentRequest ? <Text>You have sent a pairing request.</Text> :
         numRecievedRequest > 0 ? <Text> You have received {numRecievedRequest} pairing requests.</Text> :
         <Text>You are not paired with anyone.</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f',
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

export default PairingInfo;