import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";


const PairingInfo = ({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest, setRequests, partnerInitials, setPartnerInitials, partnerEmail, setPartnerEmail }) => {
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

    const isPairedReturn = () => {
        return (
            <View>
                <Text style={styles.title}>Pair Partner</Text>
                <Text>{"You are paired with " + partnerInitials + " (" + partnerEmail + ")."}</Text>
                <TouchableOpacity style={styles.button} onPress={unpairUsers}>
                    <Text>Unpair</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isNotPairedReturn = () => {
        return (
            <>
                <View style={styles.notPairedContainer}>
                    <Text style={styles.title}>Pair Partner</Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={seePairRequests}>
                        <MaterialIcons name="refresh" size={36} />
                    </TouchableOpacity>
                </View>
                {hasSentRequest ? (
                    <>
                        <Text>You have sent a pairing request.</Text>
                    </>
                ) : numRecievedRequest > 0 ? (
                    <>
                        <Text>You have received {numRecievedRequest} pairing requests.</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.description}>Enter your partner's email to send them a pair request:</Text>
                    </>
                )}
            </>
        );
    }

    return (
        <View>
            {isPaired ? isPairedReturn() : isNotPairedReturn()}
        </View>
    );
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
    description: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        alignItems: 'center',
        borderRadius: 5,
    },
    notPairedContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default PairingInfo;