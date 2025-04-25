import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

const SeeRequestsComp = ({ setIsPaired, pairRequests,  setRequests, setPartnerInitials, setPartnerEmail}) => {
    const numPairRequests = pairRequests.length;
    const [acceptPartner, setAcceptPartner] = useState("");

    const acceptPairRequest = async () => {
        try {
            if (acceptPartner == "" && numPairRequests > 1) {
                return Alert.alert("Error", "Please select a partner to accept.");
            }
            const confirmPairRequestFunction = httpsCallable(functions, "confirmPairing");
            const auth = getAuth();
            const myParams = {
                email: numPairRequests==1 ? pairRequests[0].email : acceptPartner,
                user: auth.currentUser?.uid,
            }
            const result = await confirmPairRequestFunction(myParams);
            const data = result.data;
            if (data.success) {
                setIsPaired(true);
                Alert.alert("Success", "Successfully confirmed pair request with " + numPairRequests==1 ? pairRequests[0].email : acceptPartner + ".");
                console.log("Successfully paired with " + numPairRequests==1 ? pairRequests[0].email : acceptPartner + ".");
                const seePairStatusFunction = httpsCallable(functions, "seePairStatus");
                const auth = getAuth();
                const myParams = {
                    user: auth.currentUser?.uid,
                };
                const result = await seePairStatusFunction(myParams);
                setPartnerInitials(result.data.partnerInitials);
                setPartnerEmail(result.data.partner);
            }
            else {
                Alert.alert("Error", "Failed to confirm pair request: " + data.message);
                console.log("Failed to confirm pair request:", data.message);
            }
        } catch (error) {
            console.log("Error confirming pair requests:", error);
        }
    }

    const noRequestsReturn = () => {
        return (
            <View></View>
        );
    }

    const oneRecievedRequestReturn = () => {
        return (
            <View> 
                <Text style={styles.message}>{pairRequests[0].email} sent you a pair request</Text>
                <TouchableOpacity style={styles.button} onPress={acceptPairRequest}>
                    <Text style={styles.buttonText}>
                        Accept
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleListAccepting = useCallback((index) => {
        setRequests((prevRequests) => {
            return prevRequests.map((request, i) => {
                if (i === index) {
                    const isDesired = !request.isDesired;
                    setAcceptPartner(isDesired ? request.email : "");
                    return { ...request, isDesired };
                }
                return { ...request, isDesired: false };
            });
        });
    }, [setRequests, setAcceptPartner]);

    const multiRecievedRequestsReturn = () => {
        return (
            <View> 
                <Text style={styles.message}>You have the following pair requests:</Text>
                {pairRequests.map((request, index) => (
                    <View key={index}>
                        <Text style={styles.item}>{request.email} sent you a request</Text>
                        <TouchableOpacity style={styles.button} onPress={() => handleListAccepting(index)}>
                            <Text style={styles.buttonText}>{request.isDesired ? "unselect" : "select"}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity style={styles.button} onPress={acceptPairRequest}>
                    <Text style={styles.buttonText}>{"Accept Pair Request from " + acceptPartner}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return numPairRequests==0 ? noRequestsReturn() : numPairRequests==1 ? oneRecievedRequestReturn() : multiRecievedRequestsReturn();
}

const styles = StyleSheet.create({
    container: {
      width: "83%",
      paddingVertical: 20,
      paddingHorizontal: 15,
      backgroundColor: "white",
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    button: {
        padding: 8,
        backgroundColor: '#FF9FB8',
        alignItems: 'center',
        borderRadius: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
    },
    message: {
    },
});

export default SeeRequestsComp;