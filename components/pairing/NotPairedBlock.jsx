import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions, db } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import createLogger from '@/utilities/logger';

export default function NotPairedBlock({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest, setRequests, partnerInitials, setPartnerInitials, partnerEmail, setPartnerEmail }) {
    const logger = createLogger('NotPairedBlock');

    const updatePairStatus = async () => {
        try {
            const checkPairStatusFunction = httpsCallable(functions, "seePairStatus");
            const auth = getAuth();
            const myParams = {
                user: auth.currentUser?.uid,
            };

            const statusResult = await checkPairStatusFunction(myParams);
            const statusData = statusResult.data;
            if (statusData.success) {
                if (statusData.type == "paired") {
                    setIsPaired(true);
                    setPartnerInitials(statusData.partnerInitials);
                    setPartnerEmail(statusData.partner);
                }
                else {
                    setIsPaired(false);
                    setPartnerInitials("");
                    setPartnerEmail("");
                    const checkPairRequestFunction = httpsCallable(functions, "checkPairRequest");
                    const requestsResult = await checkPairRequestFunction(myParams);
                    const requestsData = requestsResult.data;
                    if (requestsData.success) {
                        const temp = [];
                        for (let i = 0; i < requestsData.emails.length; i++) {
                            temp.push({
                                id: i,
                                email: requestsData.emails[i],
                                isDesired: false,
                            })
                        }
                        setRequests(temp);
                        logger.debug("Pair requests:", temp);
                    } else {
                        setRequests([]);
                    }
                }
            }
            else {
                logger.error("Failed to check pair status:", statusData.message);
            }
        } catch (error) {
            logger.error("seePairRequests: Error occurred:", error);
        }
    }

    return (
        <View>
            <>
                <Text style={styles.title}>Pair Partner</Text>
                <Text style={styles.body}>Discover your relationship’s strengths together</Text>
                <View style={styles.notPairedContainer}>
                    <View style={styles.divider} />
                    <View style={styles.refreshBox}>
                        <Text style={styles.refreshText}>Check for invites</Text>
                        <TouchableOpacity style={styles.refreshButton} onPress={updatePairStatus}>
                            <MaterialIcons name="refresh" size={36} />
                        </TouchableOpacity>
                    </View>
                </View>
                { /* TODO: Why are there empty conditionals? */ }
                {/* {hasSentRequest ? ( */}
                    {/* <Text>You have sent a pairing request.</Text> */ }
                {/* ) : numRecievedRequest > 0 ? ( */}
                        {/* <Text>You have received {numRecievedRequest} pairing requests.</Text> */ }
                {/* ) : ( */}
                            {/* <Text style={styles.description}>Enter your partner's email to send them a pair request:</Text> */}
                {/* )} */}
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    description: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
    },
    notPairedContainer: {
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 10,
    },

    refreshBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    refreshText: {
        fontWeight: 'bold',
        color: '#4a4a4a',
    },

    body: {
        color: '#4a4a4a',
        paddingTop: 7,
    }
});