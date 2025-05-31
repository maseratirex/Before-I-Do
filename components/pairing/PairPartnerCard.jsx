import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import PairedBlock from '@/components/pairing/PairedBlock';
import NotPairedBlock from '@/components/pairing/NotPairedBlock';
import IncomingPairRequestsBlock from '@/components/pairing/IncomingPairRequestsBlock';
import OutgoingPairRequestsBlock from '@/components/pairing/OutgoingPairRequestsBlock';
import { auth } from '@/firebaseConfig'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { functions } from "@/firebaseConfig";
import { httpsCallable } from "firebase/functions";

export default function PairPartnerCard() {
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
    } catch (error) {
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
        console.log("User", auth.currentUser.email, "has verified email:", auth.currentUser.emailVerified)
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []
  );

  if(isPaired) {
    return <View style={styles.card}>
      <PairedBlock isPaired={isPaired} setIsPaired={setIsPaired} hasSentRequest={hasSentRequest} numRecievedRequest={requests.length} setRequests={setRequests} partnerInitials={partnerInitials} setPartnerInitials={setPartnerInitials} partnerEmail={partnerEmail} setPartnerEmail={setPartnerEmail} />
    </View>
  } else {
    return <View style={styles.card}>
      <NotPairedBlock isPaired={isPaired} setIsPaired={setIsPaired} hasSentRequest={hasSentRequest} numRecievedRequest={requests.length} setRequests={setRequests} partnerInitials={partnerInitials} setPartnerInitials={setPartnerInitials} partnerEmail={partnerEmail} setPartnerEmail={setPartnerEmail} />
      <IncomingPairRequestsBlock setIsPaired={setIsPaired} pairRequests={requests} setRequests={setRequests} setPartnerInitials={setPartnerInitials} setPartnerEmail={setPartnerEmail} />
      <OutgoingPairRequestsBlock hasSentRequest={hasSentRequest} setHasSentRequest={setHasSentRequest} sentRequestEmail={sentRequest} setSentRequest={setSentRequest} />
    </View>
  }
}

const styles = StyleSheet.create({
  card: {
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
});
