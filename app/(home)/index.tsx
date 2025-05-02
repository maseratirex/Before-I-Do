import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth';

import PairPartnerCard from '@/components/PairPartnerCard';
import ReportCard from '@/components/ReportCard'
import AssessmentCard from '@/components/AssessmentCard'
import ResourcesCard from '@/components/ResourcesCard'
import { useHeaderHeight } from '@react-navigation/elements'

const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function HomeScreen() {
  // Loading state
  const [isUserReady, setIsUserReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Assessment statuses
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);

  const headerHeight = useHeaderHeight?.() ?? 0;   // optional

  const setupAssessmentStatuses = async (user: User) => {
    console.log("Setting up isAssessmentSubmitted and hasStartedAssessment")
    // Determine assessment progress
    try {
      const submittedStorageKey = user.uid + 'assessment-submitted'
      const assessmentSubmittedResponse = await AsyncStorage.getItem(submittedStorageKey);
      const submitted = assessmentSubmittedResponse === 'true'; // Convert string | null to boolean
      let started = false;
      if (!submitted) {
        // Determine whether assessment has been started
        const names = ["personality", "family", "couple", "cultural"];
        for (let name of names) {
          const sectionStorageKey = `answers-${user.uid}-${name}`;
          try {
            const savedAnswers = await AsyncStorage.getItem(sectionStorageKey);
            if (savedAnswers) {
              const answers = JSON.parse(savedAnswers);
              if (answers.some((answer: number) => answer !== 0)) {
                started = true;
                break;
              }
            }
          } catch (error) {
            console.error(`Could not load assessment progress for ${name} section:`, error);
          }
        }
      } else {
        started = true;
      }
      setIsAssessmentSubmitted(submitted);
      setHasStartedAssessment(started);
      console.log("Assessment submitted:", submitted);
      console.log("Started assessment:", started);
    } catch (e) {
      console.error("Error during assessment status setup:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setupAssessmentStatuses(user);
        } else {
          console.log("No user found — should be logged in");
          setIsLoading(false); // still stop loading
        }
        setIsUserReady(true);
      });

      return () => unsubscribe();
    }, [])
  );

  if (isLoading || !isUserReady) {
    return (
      <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
        <ScrollView style={styles.root}>
          <SafeAreaView style={styles.containerForCards}>
            <ActivityIndicator size="large" color="#FF6780" />
          </SafeAreaView>
        </ScrollView>
      </LinearGradient >
    );
  }

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      {/* <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'} keyboardVerticalOffset={headerHeight}> */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <SafeAreaView style={styles.containerForCards}>
            {/* If assessment submitted, show Report and Resources cards; otherwise, show Assessment card */}
            {isAssessmentSubmitted ? <><ReportCard /><ResourcesCard /></> : <AssessmentCard hasUserStarted={hasStartedAssessment} />}
            <PairPartnerCard />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1, // Occupy the entire screen vertically and horizontally.
    // ScrollView requires a bounded height; flex: 1 informs the LinearGradient's child
    // that the height is the entire screen
  },
  containerForCards: {
    paddingTop: 20,
    gap: 20, // Adds spacing between the cards
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT+TAB_MARGIN_BOTTOM+20,
  },
});