import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions, db } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";



const PairingInfo = ({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest, setRequests, partnerInitials, setPartnerInitials, partnerEmail, setPartnerEmail }) => {
    const [userInitial, setUserInitial] = useState('');
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
                    setPartnerEmail(statusData.partnerData);
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
                        console.log("Pair requests:", temp);
                    } else {
                        setRequests([]);
                    }
                }
            }
            else {
                console.log("Failed to check pair status:", statusData.message);
            }
        } catch (error) {
            console.error("seePairRequests: Error occurred:", error);
        }
    }

    const getUserInitials = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInitial(data.initials);
        }
    }

    useEffect(() => {
        getUserInitials();
    }, []);


    const isPairedReturn = () => {
        return (
            <View style={{ alignItems: 'center', marginTop: 5 }}>
                <Text style={styles.title}>Paired</Text>
                <View style={styles.overlapContainer}>
                    <View style={[styles.circle, styles.leftCircle]}>
                        <Text style={styles.initialsText}>{userInitial}</Text>
                    </View>
                    <View style={[styles.circle, styles.rightCircle,]}>
                        <Text style={styles.initialsText}>{partnerInitials}</Text>
                    </View>
                </View>
                {/* <Text style={{ marginTop: 10 }}>
                    You are paired with {partnerInitials} ({partnerEmail}).
                </Text> */}
                <TouchableOpacity style={styles.button} onPress={unpairUsers}>
                    <Text style={styles.buttonText}>Unpair{'\n'}{partnerEmail}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const isNotPairedReturn = () => {
        return (
            <>
                <View style={styles.notPairedContainer}>
                    <Text style={styles.title}>Pair Partner</Text>
                    <Text style={styles.pairDescription}>Discover your relationship’s strengths together</Text>
                    <View style={styles.divider} />
                    <View style={styles.refreshBox}>
                        <Text style={styles.refreshText}>Check for invites</Text>
                        <TouchableOpacity style={styles.refreshButton} onPress={seePairRequests}>
                            <MaterialIcons name="refresh" size={36} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                </View>
                {hasSentRequest ? (
                    <>
                        {/* <Text>You have sent a pairing request.</Text> */}
                    </>
                ) : numRecievedRequest > 0 ? (
                    <>
                        {/* <Text>You have received {numRecievedRequest} pairing requests.</Text> */}
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
    notPairedContainer: {
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "left",
        alignSelf: "flex-start",
        paddingLeft: '5%',
    },
    overlapContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },

    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFDDE7',
        position: 'relative',
        zIndex: 1,
        borderWidth: 5,
        borderColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 7,
    },

    leftCircle: {
        marginRight: -10, // creates the overlap
        zIndex: 2,
    },

    rightCircle: {
        zIndex: 1,
        backgroundColor: '#DD90A8',
    },

    initialsText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
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
        paddingHorizontal: 10,
    },

    refreshText: {
        fontWeight: 'bold',
        color: '#4a4a4a',
    },

    pairDescription: {
        textAlign: "left",
        alignSelf: "flex-start",
        paddingLeft: '5%',
        color: '#4a4a4a',
        paddingTop: 7,
    }
});

export default PairingInfo;