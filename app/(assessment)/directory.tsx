import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";

export default function AssessmentDirectoryScreen() {
  const names = [ "Personality", "Family", "Couple", "Cultural" ];
  const [progressData, setProgressData] = useState<any>({});

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : "guest";

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
              if (answers[i] !== "0") {
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
  
  return (
    <View style={styles.container}>
      {names.map((name) => (
        <View key={name} style={styles.sectionContainer}>
          <Link href={`./section/${name}`} style={styles.linkText}>{name}</Link>

          {progressData[name] !== undefined && (
            <View style={styles.progressContainer}>
              <Progress.Bar
                progress={progressData[name]}
                width={200}
                height={10}
                color="purple"
                unfilledColor="lightgray"
                borderWidth={0}
                borderRadius={5}
              />
              <Text style={styles.progressText}>{Math.round(progressData[name] * 100)}%</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 18,
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 220,
  },
  progressTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#555',
  },
});