import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useState, useEffect } from "react";
import * as Progress from 'react-native-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';

export default function AssessmentDirectoryScreen() {
  const names = [ "Personality", "Family", "Couple", "Cultural" ];
  const [progressData, setProgressData] = useState<any>({});

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : "guest";
  const router = useRouter();
  const allSectionsComplete = () => {
    return names.every((name) => progressData[name] === 1);
  };
  

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
  
  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.container}>
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
              <Text style={styles.progressText}>{Math.round(progressData[name] * 100)}%</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      
      {allSectionsComplete() && (
        <TouchableOpacity style={styles.submitButton} onPress={() => console.log("Submitted!")}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      )}

    
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
    flex: 1,
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
    fontWeight: 'bold',
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
    
    submitText: {
      color: '#5856ce',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    
});