import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SeeRequestsComp = ({ isPaired, setIsPaired, pairRequests }) => {
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
            <View style={styles.container}> 
                <Text style={styles.message}>{pairRequests[0].email} sent you a pair request</Text>
                <TouchableOpacity style={styles.button} onPress={acceptPairRequest}><Text>Accept</Text></TouchableOpacity>
            </View>
        );
    }

    const renderPairRequest = ({ item }) => {
        const toggleIsDesired = (id) => {
          setPairRequests((prev) => {
            const updatedMap = new Map(prev);
            updatedMap.forEach((value, key) => {
              updatedMap.set(key, { ...value, isDesired: key === id ? !value.isDesired : false });
            });
            return updatedMap;
          });
    
          // Update acceptPartner based on the toggled item's isDesired state
          setAcceptPartner((prev) => (item.isDesired ? "" : item.email));
        };
    }

    const multiRecievedRequestsReturn = () => {
        return (
            <View style={styles.container}> 
                <Text style={styles.message}>{pairRequests[0].email} sent you a pair request</Text>
                <FlatList
                    style={styles.list}
                    data={Array.from(pairRequests.values())}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPairRequest}
                />
                <TouchableOpacity style={styles.button} onPress={acceptPairRequest}>
                    <Text style={styles.buttonText}>{"Accept Pair Request from " + acceptPartner}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (isPaired ? <View></View> : numPairRequests==0 ? noRequestsReturn() : numPairRequests==1 ? oneRecievedRequestReturn() : multiRecievedRequestsReturn());
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0ff',
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

export default SeeRequestsComp;