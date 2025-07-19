import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { useFocusEffect } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth';

import PairPartnerCard from '@/components/pairing/PairPartnerCard';
import ReportCard from '@/components/ReportCard'
import AssessmentCard from '@/components/AssessmentCard'
import ResourcesCard from '@/components/ResourcesCard'

import createLogger from '@/utilities/logger';

const TAB_BAR_HEIGHT = 75
const TAB_MARGIN_BOTTOM = 40

export default function HomeScreen() {
  const logger = createLogger('HomeScreen');

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // Assessment statuses
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);

  const setupAssessmentStatuses = async (user: User) => {
    logger.info("Setting up isAssessmentSubmitted and hasStartedAssessment")
    // Determine assessment progress
    try {
      const submittedStorageKey = user.uid + 'assessment-submitted';
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
              Object.keys(answers).forEach((subsectionName) => {
                if (answers[subsectionName].some((answer) => answer !== 0)) {
                  started = true;
                  return;
                }
              });
              if (started) {
                started = true;
                break;
              }
            }
          } catch (error) {
            logger.error(`Could not load assessment progress for ${name} section:`, error);
          }
        }
      } else {
        started = true;
      }
      setIsAssessmentSubmitted(submitted);
      setHasStartedAssessment(started);
      logger.info("Assessment submitted:", submitted);
      logger.info("Started assessment:", started);
    } catch (e) {
      logger.error("Error during assessment status setup:", e);
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
          logger.warn("No user found — should be logged in");
        }
      });

      return () => unsubscribe();
    }, [])
  );

  const onLayoutRootView = useCallback(() => {
    logger.info("Layout triggered");
    if (!isLoading) {
      logger.info("Hiding splash screen");
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      // RED FOR TESTING
      <LinearGradient colors={['#FF0000', '#FF0000']} style={styles.root}>
        <ScrollView style={styles.root}>
          <SafeAreaView style={styles.containerForCards}>
            <ActivityIndicator size="large" color="#FF6780" />
          </SafeAreaView>
        </ScrollView>
      </LinearGradient >
    );
  }

  return (
    <LinearGradient onLayout={onLayoutRootView} colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <SafeAreaView style={styles.containerForCards}>
            {/* If assessment submitted, show Report and Resources cards; otherwise, show Assessment card */}
            {isAssessmentSubmitted ? <><ReportCard /><ResourcesCard /></> : <AssessmentCard hasUserStarted={hasStartedAssessment}/>}
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
    gap: 20, // Adds spacing between the cards
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT+TAB_MARGIN_BOTTOM,
  },
});