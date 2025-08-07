import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { httpsCallable } from "firebase/functions";
import { Pressable } from 'react-native';
import createLogger from '@/utilities/logger';
import { auth, functions } from "@/firebaseConfig";

export default function IncomingPairRequestsBlock({ setIsPaired, pairRequests, setRequests, setPartnerInitials, setPartnerEmail }) {
    const logger = createLogger('IncomingPairRequestsBlock');

    const numPairRequests = pairRequests.length;
    const [acceptPartner, setAcceptPartner] = useState("");

    const acceptPairRequest = async () => {
        try {
            if (acceptPartner == "" && numPairRequests > 1) {
                return Alert.alert("Error", "Please select a partner to accept.");
            }
            const confirmPairRequestFunction = httpsCallable(functions, "confirmPairing");
            const myParams = {
                email: numPairRequests == 1 ? pairRequests[0].email : acceptPartner,
            }
            const result = await confirmPairRequestFunction(myParams);
            const data = result.data;
            if (data.success) {
                setIsPaired(true);
                Alert.alert("Success", "Successfully confirmed pair request with " + numPairRequests == 1 ? pairRequests[0].email : acceptPartner + ".");
                logger.info("Successfully paired with " + numPairRequests == 1 ? pairRequests[0].email : acceptPartner + ".");
                const seePairStatusFunction = httpsCallable(functions, "seePairStatus");
                const result = await seePairStatusFunction();
                setPartnerInitials(result.data.partnerInitials);
                setPartnerEmail(result.data.partner);
            }
            else {
                Alert.alert("Error", "Failed to confirm pair request: " + data.message);
                logger.error("Failed to confirm pair request:", data.message);
            }
        } catch (error) {
            logger.error("Error confirming pair requests:", error);
        }
    }

    const confirmAcceptPairRequest = () => {
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
                onPress: () => acceptPairRequest(),
            }
            ],
            { cancelable: false }
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

    if(numPairRequests == 0) {
        return <View></View>;
    } else if(numPairRequests == 1) {
        return (
            <View>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.buttonOneRequest} onPress={confirmAcceptPairRequest}>
                    <Text style={styles.buttonText}>
                        {"Accept invite from\n"}
                        <Text style={{ fontWeight: 'normal' }}>{pairRequests[0].email}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View>
                <View style={styles.divider} />
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
                <TouchableOpacity style={styles.button} onPress={confirmAcceptPairRequest}>
                    <Text style={styles.buttonText} >
                        {(acceptPartner == "") ? "Select partner" : "Accept invite from\n"}
                        <Text style={{ fontWeight: 'normal' }}>{acceptPartner}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
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
        width: '100%',
        padding: 8,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
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
        width: "100%",
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
        fontWeight: 'bold',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
    },
    warnPartAccept: {
        color: '#4a4a4a',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    }

});