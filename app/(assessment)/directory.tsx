import { Text, View, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useFocusEffect } from "expo-router";
import { useHeaderHeight } from '@react-navigation/elements';
import { useState, useEffect } from "react";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig'

export default function AssessmentDirectoryScreen() {
  const names = ["Personality", "Family", "Couple", "Cultural"];
  const [progressData, setProgressData] = useState<any>({});

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : "guest";
  const router = useRouter();
  const allSectionsComplete = () => {
    return names.every((name) => progressData[name] === 1);
  };

  const headerHeight = useHeaderHeight();

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    const progress: any = {};
    for (let name of names) {
      const storageKey = `answers-${userId}-${name.toLowerCase()}`;
      try {
        const savedAnswers = await AsyncStorage.getItem(storageKey);
        if (savedAnswers) {
          const answers = JSON.parse(savedAnswers);
          let completedCount = 0;
          for (let i = 0; i < answers.length; i++) {
            if (answers[i] !== 0) {
              completedCount++;
            }
          }
          progress[name] = completedCount / answers.length;
        } else {
          progress[name] = 0;
        }
      } catch (error) {
        console.error(`Error loading progress for ${name}:`, error);
      }
    }
    setProgressData(progress);
  };

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const submitResults = async () => {
    console.log("Submitting results...");
    const user = auth.currentUser;
    if (user) {
      var answers = [];
      for (let name of names) {
        const storageKey = `answers-${userId}-${name.toLowerCase()}`;
        try {
          const savedAnswers = await AsyncStorage.getItem(storageKey);
          if (savedAnswers) {
            const sectionAnswers = JSON.parse(savedAnswers);
            answers.push(sectionAnswers);
          }
        } catch (error) {
          console.error(`Error loading progress for ${name}:`, error);
        }
      }
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        personalityDynamics: answers[0],
        familyDynamics: answers[1],
        coupleDynamics: answers[2],
        cultureDynamics: answers[3],
      }, { merge: true });
      console.log("Results submitted successfully");
      Alert.alert("Results Submitted", "Your results have been submitted successfully.");
    }
  }

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={[styles.container, { paddingTop: headerHeight }]}>
      <SafeAreaView>
        {names.map((name) => (
          <TouchableOpacity key={name} style={styles.sectionContainer} onPress={() => router.push(`./section/${name}`)}
            activeOpacity={0.7}>
            {/* <Link href={`./section/${name}`} style={styles.linkText}>{name}</Link> */}
            <Text style={styles.title}>{name} Dynamics</Text>
            {progressData[name] !== undefined && (
              <View style={styles.progressContainer}>
                <Progress.Bar
                  progress={progressData[name]}
                  width={260}
                  height={6}
                  color="#5856ce"
                  unfilledColor="lightgray"
                  borderWidth={0}
                  borderRadius={5}
                />
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{Math.round(progressData[name] * 100)}%</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {allSectionsComplete() ? (
          <TouchableOpacity style={styles.submitButton} onPress={submitResults}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        ) :
          (<TouchableOpacity style={styles.unsubmittableButton} onPress={() => { Alert.alert("Can't Submit Yet", "Please complete the questionaire before submitting"); console.log("User tried to submit before completing the questionnaire") }}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>)}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',

  },
  sectionContainer: {
    marginBottom: 20,
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
    width: '90%',
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
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  unsubmittableButton: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
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