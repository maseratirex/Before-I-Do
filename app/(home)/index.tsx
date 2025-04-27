import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useHeaderHeight } from '@react-navigation/elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPartnerFinished, setIsPartnerFinished] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });

  const checkStatus = async () => {
    const names = ["Personality", "Family", "Couple", "Cultural"];
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      let localIsSubmitted = false;
      let localIsPartnerFinished = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        localIsSubmitted = data.coupleDynamics !== null && data.cultureDynamics !== null && data.familyDynamics !== null && data.personalityDynamics !== null;
        const checkPartnerResponsesFunction = httpsCallable(functions, "seePartnerResponses");
        const myParams = { user: auth.currentUser?.uid };
        const result = await checkPartnerResponsesFunction(myParams);
        const results = result.data as { success: boolean };
        localIsPartnerFinished = results.success;
      } else {
        console.log("No such document!");
      }

      let localHasStarted = localIsSubmitted;
      if (!localIsSubmitted) {
        for (let name of names) {
          const storageKey = `answers-${user.uid}-${name.toLowerCase()}`;
          try {
            const savedAnswers = await AsyncStorage.getItem(storageKey);
            if (savedAnswers) {
              const answers = JSON.parse(savedAnswers);
              if (answers.some((answer: number) => answer !== 0)) {
                localHasStarted = true;
                break;
              }
            }
          } catch (error) {
            console.error(`Error loading progress for ${name}:`, error);
          }
        }
      }

      // Update state after all calculations
      setIsSubmitted(localIsSubmitted);
      setIsPartnerFinished(localIsPartnerFinished);
      setHasStarted(localHasStarted);
    } else {
      console.log("No user is signed in");
    }
  }

  useFocusEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        checkStatus();
      } else {
        console.log("User is not authenticated or email not verified.");
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  });

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView>
        <SafeAreaView style={styles.containerForCards}>
          <Text>started questionaire: {String(hasStarted)} submitted questionaire: {String(isSubmitted)} partner finished: {String(isPartnerFinished)}</Text>
          {/* This shows Assessment or Report and Resources */}
          {isSubmitted ? (isPartnerFinished ? <><ReportCard isPartnerAssessmentSubmitted={true} /><ResourcesCard /></> : <><ReportCard isPartnerAssessmentSubmitted={false} /><ResourcesCard /></>) : <AssessmentCard hasUserStarted={hasStarted} />}
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