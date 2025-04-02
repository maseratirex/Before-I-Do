import React, { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';
import LikertScale from '@/components/LikertScale'
import { questionnaire } from "../../../components/questionnaire";
import { getAuth } from "firebase/auth";

type SectionName = 'personality' | 'family' | 'couple' | 'cultural';

export default function Assessment2Screen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const section = name.toLowerCase() as SectionName;
    const questions = questionnaire[section];
    const [answers, setAnswers] = useState<string>("0".repeat(questions.length));
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
    const storageKey = `answers-${userId}-${section}`;

    const loadAnswers = React.useCallback(async () => {
        try {
            const savedAnswers = await AsyncStorage.getItem(storageKey);
            if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
        } catch (error) {
            console.error("Error loading saved answers:", error);
        } finally {
            setIsLoaded(true);
        }
    }, [section]);

    const saveAnswers = React.useCallback(async () => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save answers:", error);
        }
    }, [answers, section]);

    useEffect(() => {
        loadAnswers();
    }, [loadAnswers]);

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') saveAnswers();
        });

        return () => appStateListener.remove();
    }, [saveAnswers]);

    useFocusEffect(
        React.useCallback(() => {
            saveAnswers();
        }, [saveAnswers])
    );

    const progress = isLoaded
    ? (() => {
          let completedCount = 0;
          for (let i = 0; i < answers.length; i++) {
              if (answers[i] !== "0") {
                  completedCount++;
              }
          }
          return completedCount / questions.length;
      })()
    : 0;


    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Section {name}</Text>
            <Text>{answers}</Text>
            {isLoaded && (
                <>
                    <Progress.Bar
                        progress={progress}
                        width={300}
                        height={10}
                        color="purple"
                        unfilledColor="lightgray"
                        borderWidth={0}
                        borderRadius={5}
                        style={{ marginVertical: 20 }}
                    />
                    <Text>{Math.round(progress * 100)}% Completed</Text>
                </>
            )}
            <LikertScale questions={questions} answers={answers} setAnswers={setAnswers}/>
        </View>
    );
}
