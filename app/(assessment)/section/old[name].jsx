import React, { useEffect, useState } from "react";
import { AppState, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from '@react-navigation/elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';
import LikertScale from '@/components/assessment/LikertScale'
import { questionnaire } from "../../../components/questionnaire";
import { getAuth } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import createLogger from "@/utilities/logger";

export default function QuestionnaireScreen() {
    const logger = createLogger('QuestionnaireScreen');
    const { name } = useLocalSearchParams();
    const router = useRouter();
    const section = name.toLowerCase();
    const subsections = questionnaire[section];
    const questions = Object.values(subsections).flat();
    const [answers, setAnswers] = useState(Array(questions.length).fill(0));
    const [isLoaded, setIsLoaded] = useState(false);
    const [footerHeight, setFooterHeight] = useState(0);

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const storageKey = `answers-${userId}-${section}`;

    const headerHeight = useHeaderHeight();

    const loadAnswers = React.useCallback(async () => {
        try {
            const testing = false;
            const savedAnswers = await AsyncStorage.getItem(storageKey);
            if (savedAnswers) {
                const parsedAnswers = JSON.parse(savedAnswers);
                if (testing) {
                    logger.info("Simulating answers");
                    const adjustedAnswers = questions.map((_, index) =>
                        Math.floor(Math.random() * 5) + 1
                    );
                    setAnswers(adjustedAnswers);
                } else {
                    logger.info("Loading answers");
                    const adjustedAnswers = Array(questions.length)
                        .fill(0)
                        .map((defaultValue, index) => parsedAnswers[index] ?? defaultValue); // Merge saved answers
                    setAnswers(adjustedAnswers);
                }
            } else {
                if (testing) {
                    logger.info("Simulating answers to save time");
                    const adjustedAnswers = questions.map((_, index) =>
                        Math.floor(Math.random() * 5) + 1
                    );
                    setAnswers(adjustedAnswers);
                }
            }
        } catch (error) {
            logger.error("Error loading saved answers:", error);
        } finally {
            setIsLoaded(true);
        }
    }, [section, questions.length]);

    const saveAnswers = React.useCallback(async () => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(answers));
        } catch (error) {
            logger.error("Failed to save answers:", error);
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

    if (!isLoaded) {
        return (
            <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Loading...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingTop: headerHeight }}>
                <LinearGradient colors={['rgba(255, 228, 235, 1)', 'rgba(255, 228, 235, 0)']}
                    style={{
                        position: 'absolute',
                        top: headerHeight,
                        left: 0,
                        right: 0,
                        height: 40,
                        zIndex: 1,
                    }}
                    pointerEvents="none" />
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 10, }}>
                    <LikertScale section={section} subsections={subsections} answers={answers} setAnswers={setAnswers} />
                    {isLoaded && progress === 1 && (
                        <TouchableOpacity style={{
                            alignSelf: 'center',
                            width: '40%',
                            backgroundColor: '#fff',
                            paddingVertical: 12,
                            paddingHorizontal: 30,
                            marginBottom: 10,
                            borderRadius: 30,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                        }} onPress={() => router.back()}>
                            <Text style={{
                                color: '#5856ce',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center'
                            }}>Complete</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                {footerHeight > 0 && (
                    <LinearGradient colors={['rgba(255, 228, 235, 0)', '#FFC6D5']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: footerHeight + 25,
                            height: footerHeight,
                            zIndex: 1,
                        }}
                        pointerEvents="none"
                    />
                )}
                <View onLayout={e => setFooterHeight(e.nativeEvent.layout.height)} style={{
                    alignSelf: 'center',
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    alignItems: "center",
                    marginBottom: 25,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: '#FFF',
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    width: '83%',
                }}>
                    <Progress.Bar style={{ flex: 1, }}
                        width={null}
                        progress={progress}
                        height={8}
                        color="#5856ce"
                        unfilledColor="lightgray"
                        borderWidth={0}
                        borderRadius={5}
                    />
                    <Text style={{ marginLeft: 10 }}>{Math.round(progress * 100)}%</Text>
                </View>
            </View>
        </LinearGradient>
    );
}
