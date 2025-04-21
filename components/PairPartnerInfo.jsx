import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";


const PairingInfo = ({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest, setRequests, partnerInitials, setPartnerInitials, partnerEmail, setPartnerEmail}) => {
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
                setPartnerInitials("");
                setPartnerEmail("");
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

    const seePairRequests = async () => {
        try {
            const checkPairRequestFunction = httpsCallable(functions, "checkPairRequest");
            const auth = getAuth();
            const myParams = {
            user: auth.currentUser?.uid,
            };
    
            const result = await checkPairRequestFunction(myParams);
            const data = result.data;
            if (data.success) {
            const temp = [];
            for (let i = 0; i < data.emails.length; i++) {
                temp.push({
                    id: i,
                    email: data.emails[i],
                    isDesired: false,
                })
                }
            setRequests(temp);
            console.log("Pair requests:", temp);
            } else {
            setRequests([]);
            }
        } catch (error) {
            console.error("seePairRequests: Error occurred:", error);
        }
    }

    const refreshButton = () => {
        return (
            <TouchableOpacity style={styles.button} onPress={seePairRequests}>
                <Text>Refresh</Text>
            </TouchableOpacity>
        );
    }

    const pairedInfo = () => {
        return (
            <View>
                <Text>{"You are paired with " + partnerInitials + " (" + partnerEmail + ")."}</Text>
                <TouchableOpacity style={styles.button} onPress={unpairUsers}>
                    <Text>Unpair</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const sentRequestInfo = () => {
        return (
            <Text>You have sent a pairing request.</Text>
        );
    }

    const receivedRequestInfo = () => {
        return (
            <Text>You have received {numRecievedRequest} pairing requests.</Text>
        );
    }

    const initialInfo = () => {
        return (
            <Text>You are not paired with anyone.</Text>
        );
    }
    
    return (
        <View style={styles.container}>
        {isPaired ? pairedInfo() : 
         hasSentRequest ? sentRequestInfo() :
         numRecievedRequest > 0 ? receivedRequestInfo() :
         initialInfo()}
        {isPaired? "" : refreshButton()}
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