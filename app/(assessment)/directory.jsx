import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, auth } from "@/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import createLogger from '@/utilities/logger';
import { calculateSectionProgress } from "@/utilities/calculateSectionProgress";

export default function AssessmentDirectoryScreen() {
  const logger = createLogger('AssessmentDirectoryScreen');

  const sectionNames = ["Personality", "Family", "Couple", "Cultural"];
  const [sectionProgresses, setSectionProgresses] = useState({ Personality: 0, Family: 0, Couple: 0, Cultural: 0 });

  const userId = auth.currentUser.uid;
  const router = useRouter();
  const allSectionsComplete = () => {
    return sectionNames.every((sectionName) => sectionProgresses[sectionName] === 1);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    logger.info("Loading progress");
    const sectionProgressesCopy = { ...sectionProgresses };
    for (let sectionName of sectionNames) {
      const storageKey = `answers-${userId}-${sectionName.toLowerCase()}`;
      try {
        const savedAnswers = await AsyncStorage.getItem(storageKey);
        if (savedAnswers) {
          const savedAnswersObject = JSON.parse(savedAnswers);
          sectionProgressesCopy[sectionName] = calculateSectionProgress(savedAnswersObject);
        } else {
          sectionProgressesCopy[sectionName] = 0;
        }
      } catch (error) {
        logger.error(`Error loading progress for ${sectionName}:`, error);
      }
    }
    setSectionProgresses(sectionProgressesCopy);
  };

  const storeAssessmentSubmissionStatusLocally = async (status) => {
    logger.info("Storing assessment submission status in local storage as", status);
    // Store user assessment submitted status in local storage
    try {
      const submittedStorageKey = userId + 'assessment-submitted'
      const statusString = JSON.stringify(status);
      await AsyncStorage.setItem(submittedStorageKey, statusString);
      logger.info(`Successfully stored assessment submission status. Key: ${submittedStorageKey}, Value: ${statusString}`);
      
      // Verify it was stored correctly
      const verifyStatus = await AsyncStorage.getItem(submittedStorageKey);
      logger.info(`Verification read from AsyncStorage: ${verifyStatus}`);
    } catch (e) {
      logger.error('Failed to save assessment submission in local storage', e);
    }
  };

  const submitResults = async () => {
    logger.info("Submitting results...");
    const answers = {};
    for (let sectionName of sectionNames) {
      const sectionStorageKey = `answers-${userId}-${sectionName.toLowerCase()}`;
      try {
        const savedAnswers = await AsyncStorage.getItem(sectionStorageKey);
        if (savedAnswers) {
          const sectionAnswers = JSON.parse(savedAnswers);
          answers[sectionName] = sectionAnswers;
        } else {
          logger.error("Failed to locate saved answers in local storage");
        }
      } catch (error) {
        logger.error(`Error loading progress for ${sectionName}:`, error);
      }
    }
    
    try {
      logger.info("Submitting answers to Firestore...");
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { answers: answers, }, { merge: true });
      
      logger.info("Results submitted to Firestore successfully");
      Alert.alert("Results Submitted", "Your results have been submitted successfully.");
      
      logger.info("Storing submission status locally...");
      await storeAssessmentSubmissionStatusLocally(true);
      
      logger.info("All submission steps completed successfully");
      return true; // Indicate success
    } catch (error) {
      logger.error("Failed to submit results:", error);
      Alert.alert("Error", "Issue submitting results. Please try again later.");
      return false; // Indicate failure
    }
  }

  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={[styles.container, { paddingTop: headerHeight }]}>
      {sectionNames.map((sectionName) => (
        <TouchableOpacity key={sectionName} style={styles.sectionContainer} onPress={() => router.push(`./section/${sectionName}`)}
          activeOpacity={0.7}>
          <Text style={styles.title}>{sectionName} Dynamics</Text>
          {sectionProgresses[sectionName] !== undefined && (
            <View style={styles.progressContainer}>
              <Progress.Bar
                style={{ flex: 1, }}
                width={null}
                progress={sectionProgresses[sectionName]}
                height={8}
                color="#5856ce"
                unfilledColor="lightgray"
                borderWidth={0}
                borderRadius={5}
              />
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{Math.round(sectionProgresses[sectionName] * 100)}%</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {allSectionsComplete() ? (
        <TouchableOpacity style={styles.submitButton} onPress={async () => { 
          const success = await submitResults(); 
          if (success) {
            logger.info("Navigation back to home after successful submission");
            router.back(); 
          } else {
            logger.warn("Not navigating due to submission failure");
          }
        }}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      ) :
        (<TouchableOpacity style={styles.submitButton} onPress={() => { Alert.alert("Finish before submitting", "Please complete the questionnaire before submitting"); logger.info("User tried to submit before completing the questionnaire") }}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>)}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    alignItems: 'center',
    padding: 15,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 6,
    width: '83%',
  },
  linkText: {
    color: '#007bff',
    fontSize: 18,
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  progressTextContainer: {
    width: 40, // Set a fixed width to ensure consistent card width
    alignItems: 'flex-end',
  },
  progressText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#555',
  },
  title: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'flex-start'
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    color: '#5856ce',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});