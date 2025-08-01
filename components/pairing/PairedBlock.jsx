import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { httpsCallable } from "firebase/functions";
import { doc, getDoc } from "firebase/firestore";
import createLogger from '@/utilities/logger'; 
import { auth, db, functions } from "@/firebaseConfig";

export default function PairedBlock({ isPaired, setIsPaired, hasSentRequest, numRecievedRequest, setRequests, partnerInitials, setPartnerInitials, partnerEmail, setPartnerEmail }) {
    const logger = createLogger('PairedBlock');

    const [userInitial, setUserInitial] = useState('');

    const unpairUsers = async () => {
        try {
            const unpairFunction = httpsCallable(functions, "unpair");
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
                logger.info("Successfully unpaired.");
            }
            else {
                Alert.alert("Error", "Failed to unpair: " + data.message);
                logger.error("Failed to unpair:", data.message);
            }
        } catch (error) {
            logger.error("Error unpairing:", error);
        }
    }

    const confirmUnpairUsers = () => {
        Alert.alert(
            'Confirm unpairing',
            'Unpairing will remove your access to your partner\'s data and your partner\'s access to your data',
            [
                {
                    text: 'Cancel',
                    onPress: () => logger.info('Cancelled pairing'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => unpairUsers(),
                }
            ],
            { cancelable: false }
        );
    }

    const getUserInitials = async () => {
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
            <TouchableOpacity style={styles.button} onPress={confirmUnpairUsers}>
                <Text style={styles.buttonText}>
                    Unpair{'\n'}
                    <Text style={{ fontWeight: 'normal' }}>{partnerEmail}</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        width: "100%",
    },

    buttonText: {
        color: '#4a4a4a',
        fontSize: 15,
        lineHeight: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
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
});