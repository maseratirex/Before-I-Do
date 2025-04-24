import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useHeaderHeight } from '@react-navigation/elements';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/firebaseConfig'
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import React, { useState, useEffect } from "react";

import PairPartnerCard from '@/components/PairPartnerCard';
import ReportCard from '@/components/ReportCard'
import AssessmentCard from '@/components/AssessmentCard'
import ResourcesCard from '@/components/ResourcesCard'

export default function Index() {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPartnerFinished, setIsPartnerFinished] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });

  const checkStatus = async () => {
    console.log("Checking status...");
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsSubmitted(data.coupleDynamics !== null && data.cultureDynamics !== null && data.familyDynamics !== null && data.personalityDynamics !== null);
        console.log("isSubmitted: ", isSubmitted);
        const confirmPairRequestFunction = httpsCallable(functions, "confirmPairing");
        const myParams = {
          user: auth.currentUser?.uid,
        }
        const result = await confirmPairRequestFunction(myParams);
        const results = result.data as { success: boolean };
        if (results.success) {
          setIsPartnerFinished(true);
        }
        else {
          setIsPartnerFinished(false);
        }
        console.log("partnerComplete: ", isPartnerFinished);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is signed in");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        checkStatus();
      } else {
        console.log("User is not authenticated or email not verified.");
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []
  );

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView>
        <SafeAreaView style={styles.containerForCards}>
          {/* This shows Assessment or Report and Resources */}
          {isSubmitted ? <><ReportCard isPartnerAssessmentSubmitted={true} /><ReportCard isPartnerAssessmentSubmitted={false} /><ResourcesCard /></> : <AssessmentCard />}
          <PairPartnerCard />
        </SafeAreaView>
      </ScrollView>
    </LinearGradient >
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1, // Occupy the entire screen vertically and horizontally.
    // ScrollView requires a bounded height; flex: 1 informs the LinearGradient's child
    // that the height is the entire screen
  },
  containerForCards: {
    gap: 20, // Adds spacing between the cards
    alignItems: 'center',
  },
});