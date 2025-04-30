import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from '@/firebaseConfig'

import PairPartnerCard from '@/components/PairPartnerCard';
import ReportCard from '@/components/ReportCard'
import AssessmentCard from '@/components/AssessmentCard'
import ResourcesCard from '@/components/ResourcesCard'

export default function HomeScreen() {
  // Assessment statuses
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);

  const setupAssessmentStatuses = async () => {
    console.log("Setting up isAssessmentSubmitted and hasStartedAssessment")
    // Determine assessment progress
    const user = auth.currentUser;
    if(user) { // This will always be true because HomeScreen would not be loaded if user were null
      const assessmentSubmittedResponse = await AsyncStorage.getItem('assessmentSubmitted');
      setIsAssessmentSubmitted(assessmentSubmittedResponse === 'true'); // Convert string to boolean
      if(isAssessmentSubmitted) {
        setHasStartedAssessment(true);
      } else {
        // Determine whether assessment has been started
        const names = ["personality", "family", "couple", "cultural"];
        for (let name of names) {
          const storageKey = `answers-${user.uid}-${name}`;
          try {
            const savedAnswers = await AsyncStorage.getItem(storageKey);
            if (savedAnswers) {
              const answers = JSON.parse(savedAnswers);
              if (answers.some((answer: number) => answer !== 0)) {
                setHasStartedAssessment(true);
                break;
              }
            }
          } catch (error) {
            console.error(`Could not load assessment progress for ${name} section:`, error);
          }
        }
      }
      console.log("isAssessmentSubmitted:", isAssessmentSubmitted);
      console.log("hasStartedAssessment:", hasStartedAssessment);
    }
  }
  useFocusEffect(
    () => {
      setupAssessmentStatuses()
    }
  );

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <ScrollView>
        <SafeAreaView style={styles.containerForCards}>
          {/* If assessment submitted, show Report and Resources cards; otherwise, show Assessment card */}
          {isAssessmentSubmitted ? <><ReportCard/><ResourcesCard /></> : <AssessmentCard hasUserStarted={hasStartedAssessment}/>}
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
    paddingBottom: 100, // Update this magic number so it depends on the tab bar height and margin/padding
  },
});