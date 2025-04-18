import React, { useEffect, useState } from "react";
import { Pressable, AppState, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from '@react-navigation/elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';
import LikertScale from '@/components/LikertScale'
import { questionnaire } from "../../../components/questionnaire";
import { getAuth } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";

type SectionName = 'personality' | 'family' | 'couple' | 'cultural';

export default function QuestionnaireScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const router = useRouter();
    const section = name.toLowerCase() as SectionName;
    const subsections = questionnaire[section];
    const questions = subsections ? Object.values(subsections).flat() : [];
    const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
    const storageKey = `answers-${userId}-${section}`;

    const headerHeight = useHeaderHeight();

    const loadAnswers = React.useCallback(async () => {
        try {
            const savedAnswers = await AsyncStorage.getItem(storageKey);
            if (savedAnswers) {
                const parsedAnswers = JSON.parse(savedAnswers);
                const adjustedAnswers = Array(questions.length)
                    .fill(0)
                    .map((defaultValue, index) => parsedAnswers[index] ?? defaultValue); // Merge saved answers
                setAnswers(adjustedAnswers);
            }
        } catch (error) {
            console.error("Error loading saved answers:", error);
        } finally {
            setIsLoaded(true);
        }
    }, [section, questions.length]);

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
                if (answers[i] !== 0) {
                    completedCount++;
                }
            }
            return completedCount / questions.length;
        })()
        : 0;

    if (!subsections) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Invalid section: "{section}"</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {isLoaded ? (
                <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignItems: "center", paddingTop: headerHeight }}>
                        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                            <LikertScale subsections={subsections} answers={answers} setAnswers={setAnswers} />
                            <Pressable onPress={() => router.back()}>
                                <Text>Complete</Text>
                            </Pressable>
                        </ScrollView>
                        <View>
                            <Text>{Math.round(progress * 100)}%</Text>
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
                        </View>
                    </View></LinearGradient>
            ) : (
                <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Loading...</Text>
                    </View>
                </LinearGradient>
            )}
        </View>
    );
}
