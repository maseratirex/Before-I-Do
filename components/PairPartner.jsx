import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import PairingInfo from '@/components/PairPartnerInfo';
import SeeRequestsComp from '@/components/PairPartnerRecievedRequests';
import SendRequestsComp from '@/components/PairPartnerSendRequests';
import { auth } from '@/firebaseConfig'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";

const PairPartner = () => {
    const [isPaired, setIsPaired] = useState("");
    const [hasSentRequest, setHasSentRequest] = useState("");
    const [sentRequest, setSentRequest] = useState("");
    const [partnerInitials, setPartnerInitials] = useState("");
    const [partnerEmail, setPartnerEmail] = useState("");
    const [requests, setRequests] = useState([]);

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
          return requests;
        } catch (error) {
          console.error("seePairRequests: Error occurred:", error);
        }
    }

    const seePairStatus = async () => {
        try {
            const seePairStatusFunction = httpsCallable(functions, "seePairStatus");
            const auth = getAuth();
            const myParams = {
                user: auth.currentUser?.uid,
            };
            console.log("Checking pairing status for user:", myParams);
            const result = await seePairStatusFunction(myParams);
            const data = result.data;
            console.log("Pairing status data:", data);
            if (data.success) {
                console.log("Pairing status:", data);
                setIsPaired(data.type == "paired");
                setHasSentRequest(data.type == "requested");
                setSentRequest(data.type == "requested" ? data.partnerRequest : "");
                setPartnerInitials(data.type == "paired" ? data.partnerInitials : "");
                setPartnerEmail(data.type == "paired" ? data.partner : "");
                console.log("Pairing status:", data.type);
                console.log("Pair request email:", data.partnerRequest);
                console.log("isPaired:", isPaired);
            } else {
                console.log("Failed to check pairing status:", data.message);
            }
        }catch (error) {
          console.error("seePairRequests: Error occurred:", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user && user.emailVerified) {
            seePairStatus();
            seePairRequests();
          } else {
            console.log("User is not authenticated or email not verified.");
            console.log("User",auth.currentUser.email,"has verified email:", auth.currentUser.emailVerified)
            router.replace('/auth/login');
          }
        });
    
        return () => unsubscribe(); // Cleanup the listener on unmount
      }, []
    );

    return (
        <View style={styles.container}>
            <PairingInfo isPaired={isPaired} setIsPaired={setIsPaired} hasSentRequest={hasSentRequest} numRecievedRequest={requests.length} setRequests={setRequests} partnerInitials={partnerInitials} setPartnerInitials={setPartnerInitials} partnerEmail={partnerEmail} setPartnerEmail={setPartnerEmail}/>
            <SeeRequestsComp isPaired={isPaired} setIsPaired={setIsPaired} pairRequests={requests} setRequests={setRequests} setPartnerInitials={setPartnerInitials} setPartnerEmail={setPartnerEmail} />
            <SendRequestsComp isPaired={isPaired} hasSentRequest={hasSentRequest} setHasSentRequest={setHasSentRequest} sentRequestEmail={sentRequest} setSentRequest={setSentRequest}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
        // backgroundColor: '#0f0',
        backgroundColor: 'transparent',
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

export default PairPartner;