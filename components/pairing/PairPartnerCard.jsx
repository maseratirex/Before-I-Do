import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import PairedBlock from '@/components/pairing/PairedBlock';
import NotPairedBlock from '@/components/pairing/NotPairedBlock';
import IncomingPairRequestsBlock from '@/components/pairing/IncomingPairRequestsBlock';
import OutgoingPairRequestsBlock from '@/components/pairing/OutgoingPairRequestsBlock';
import { onAuthStateChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useRouter } from "expo-router";
import createLogger from '@/utilities/logger';
import { auth, functions } from "@/firebaseConfig";

export default function PairPartnerCard() {
  const logger = createLogger('PairPartnerCard');
  const router = useRouter();
  const [isPaired, setIsPaired] = useState("");
  const [hasSentRequest, setHasSentRequest] = useState("");
  const [sentRequest, setSentRequest] = useState("");
  const [partnerInitials, setPartnerInitials] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [requests, setRequests] = useState([]);

  const seePairRequests = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        logger.warn("No authenticated user in seePairRequests");
        return;
      }
      const checkPairRequestFunction = httpsCallable(functions, "checkPairRequest");
      const myParams = {
        user: currentUser.uid,
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
        logger.debug("Pair requests:", temp);
      } else {
        setRequests([]);
      }
      return requests;
    } catch (error) {
      logger.error("seePairRequests: Error occurred:", error);
    }
  }

  const seePairStatus = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        logger.warn("No authenticated user in seePairStatus");
        return;
      }
      const seePairStatusFunction = httpsCallable(functions, "seePairStatus");
      const myParams = {
        user: currentUser.uid,
      };
      logger.debug("Checking pairing status for user:", myParams);
      const result = await seePairStatusFunction(myParams);
      const data = result.data;
      logger.debug("Pairing status data:", data);
      if (data.success) {
        logger.debug("Pairing status:", data);
        setIsPaired(data.type == "paired");
        setHasSentRequest(data.type == "requested");
        setSentRequest(data.type == "requested" ? data.partnerRequest : "");
        setPartnerInitials(data.type == "paired" ? data.partnerInitials : "");
        setPartnerEmail(data.type == "paired" ? data.partner : "");
        logger.debug("Pairing status:", data.type);
        logger.debug("Pair request email:", data.partnerRequest);
        logger.debug("isPaired:", isPaired);
      } else {
        logger.warn("Failed to check pairing status:", data.message);
      }
    } catch (error) {
      logger.error("seePairRequests: Error occurred:", error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        seePairStatus();
        seePairRequests();
      } else {
        logger.warn("User is not authenticated or email not verified.");
        if (auth.currentUser) {
          logger.debug("User", auth.currentUser.email, "has verified email:", auth.currentUser.emailVerified);
        }
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
