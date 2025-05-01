import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { Pressable } from 'react-native';

const SeeRequestsComp = ({ setIsPaired, pairRequests, setRequests, setPartnerInitials, setPartnerEmail }) => {
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
                email: numPairRequests == 1 ? pairRequests[0].email : acceptPartner,
                user: auth.currentUser?.uid,
            }
            const result = await confirmPairRequestFunction(myParams);
            const data = result.data;
            if (data.success) {
                setIsPaired(true);
                Alert.alert("Success", "Successfully confirmed pair request with " + numPairRequests == 1 ? pairRequests[0].email : acceptPartner + ".");
                console.log("Successfully paired with " + numPairRequests == 1 ? pairRequests[0].email : acceptPartner + ".");
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
                <Text style={styles.warnPartAccept}>Accepting an invite shares your data with them</Text>
                <Text style={styles.messageOne}>{pairRequests[0].email} sent you a pair request</Text>
                <TouchableOpacity style={styles.buttonOneRequest} onPress={acceptPairRequest}>
                    <Text style={styles.buttonText}>
                        Accept
                    </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
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
                <Text style={styles.warnPartAccept}>Accepting an invite shares your data with them</Text>
                {/* <Text style={styles.message}>You have the following pair requests:</Text> */}
                {pairRequests.map((request, index) => (
                    <Pressable
                        key={index}
                        style={styles.radioItem}
                        onPress={() => setAcceptPartner(request.email)}
                    >
                        <View style={styles.radioCircle}>
                            {acceptPartner === request.email && <View style={styles.selectedDot} />}
                        </View>
                        <Text style={styles.item}>{request.email} </Text>
                    </Pressable>
                ))}
                <TouchableOpacity style={styles.button} onPress={acceptPairRequest}>
                    <Text style={styles.buttonText} >
                        {(acceptPartner == "") ? "Select partner" : "Accept invite from\n"}
                        <Text style={{ fontWeight: 'normal' }}>{acceptPartner}</Text>
                    </Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>
        );
    }

    return numPairRequests == 0 ? noRequestsReturn() : numPairRequests == 1 ? oneRecievedRequestReturn() : multiRecievedRequestsReturn();
}

const styles = StyleSheet.create({
    container: {
        width: "83%",
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
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
        width: '94%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#4a4a4a',
        fontSize: 15,
        lineHeight: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonOneRequest: {
        width: '94%',
        padding: 8,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        borderRadius: 8,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    message: {
        padding: 15,
    },

    messageOne: {
        padding: 15,
        fontWeight: 'bold',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        margin: 10,
    },

    radioCircle: {
        backgroundColor: '#FFF',
        height: 22,
        width: 22,
        borderRadius: 12.5,
        borderWidth: 2,
        borderColor: '#4A4A4A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    selectedDot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#4A4A4A',
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 10,
        marginTop: 20,
    },
    warnPartAccept: {
        marginLeft: 5,
        color: '#4a4a4a',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 10,
    }

});

export default SeeRequestsComp;