import React, { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LikertScale from '@/components/LikertScale'
import { questionnaire } from "../../../components/questionnaire";

type SectionName = 'personality' | 'family' | 'couple' | 'cultural';

export default function Assessment2Screen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const section = name.toLowerCase() as SectionName;
    const questions = questionnaire[section];
    const [answers, setAnswers] = useState<string>("0".repeat(questions.length));

    const loadAnswers = React.useCallback(async () => {
        try {
            const savedAnswers = await AsyncStorage.getItem(`answers-${section}`);
            if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
        } catch (error) {
            console.error("Error loading saved answers:", error);
        }
    }, [section]);

    const saveAnswers = React.useCallback(async () => {
        try {
            await AsyncStorage.setItem(`answers-${section}`, JSON.stringify(answers));
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
            <LikertScale questions={questions} answers={answers} setAnswers={setAnswers}/>
        </View>
    );
}
