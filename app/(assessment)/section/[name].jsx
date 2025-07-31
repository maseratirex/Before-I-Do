import React, { useState, useEffect } from "react";
import { Text, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import AssessmentSubsection from "@/components/assessment/AssessmentSubsection";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { questionnaire } from "@/components/questionnaire";
import createLogger from "@/utilities/logger";
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from 'react-native-progress';
import { calculateSectionProgress } from "@/utilities/calculateSectionProgress";

export default function QuestionnaireScreen() {
    const logger = createLogger("QuestionnaireScreen");
    const router = useRouter();

    const { name } = useLocalSearchParams();
    const sectionName = name.toLowerCase();
    const [sectionAnswers, setSectionAnswers] = useState({});

    const userId = getAuth().currentUser.uid;
    const storageKey = `answers-${userId}-${sectionName}`;

    const [isLoaded, setIsLoaded] = useState(false);

    const saveAnswers = async (answers) => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify(answers));
            logger.info("Saved answers");
        } catch (error) {
            logger.error("Failed to save answers:", error);
        }
    };

    const loadAnswers = React.useCallback(async () => {
        try {
            const testing = true;
            if (testing) {
                logger.info("Simulating answers");
                const simulatedSectionAnswers = {};
                Object.keys(questionnaire[sectionName]).forEach((subsectionName) => {
                    simulatedSectionAnswers[subsectionName] = Array(questionnaire[sectionName][subsectionName].length)
                        .fill(0)
                        .map(() => Math.floor(Math.random() * 5) + 1);
                });
                setSectionAnswers(simulatedSectionAnswers);
                saveAnswers(simulatedSectionAnswers);
            } else {
                const savedSectionAnswers = await AsyncStorage.getItem(storageKey);
                if (savedSectionAnswers) {
                    const savedSectionAnswersObject = JSON.parse(savedSectionAnswers);
                    logger.info("Loaded answers");
                    setSectionAnswers(savedSectionAnswersObject);
                } else {
                    logger.info("No saved answers found");
                    const defaultSectionAnswers = {};
                    Object.keys(questionnaire[sectionName]).forEach((subsectionName) => {
                        defaultSectionAnswers[subsectionName] = Array(questionnaire[sectionName][subsectionName].length).fill(0);
                    });
                    logger.info("Defaulted to no answers");
                    setSectionAnswers(defaultSectionAnswers);
                    saveAnswers(defaultSectionAnswers);
                }
            }
        } catch (error) {
            logger.error("Error loading saved answers:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        loadAnswers();
    }, []);

    const updateSubsectionAnswers = (subsectionName, index, value) => {
        const updatedSectionAnswers = { ...sectionAnswers };
        updatedSectionAnswers[subsectionName][index] = value;
        setSectionAnswers(updatedSectionAnswers);
        logger.info(`Updated answers for ${subsectionName} at index ${index} to ${value}`);
        saveAnswers(updatedSectionAnswers);
    }

    const headerHeight = useHeaderHeight();
    const [footerHeight, setFooterHeight] = useState(0);

    if (!isLoaded) {
        return (
            <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Loading...</Text>
                </View>
            </LinearGradient>
        );
    }

    const progress = calculateSectionProgress(sectionAnswers);

    return (
        <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ height: headerHeight }} />
            <LinearGradient colors={['rgba(255, 228, 235, 1)', 'rgba(255, 228, 235, 0)']} style={[styles.headerBlur, { top: headerHeight }]} pointerEvents="none" />
            {/* Screen contents */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.autoSaveText}>Your progress is saved automatically</Text>
                {Object.keys(sectionAnswers).map((subsectionName) => (
                    <AssessmentSubsection key={subsectionName} sectionName={sectionName} subsectionName={subsectionName} subsectionAnswers={sectionAnswers[subsectionName]} onSubsectionAnswersUpdate={(index, value) => updateSubsectionAnswers(subsectionName, index, value)} />
                ))}
                {/* Show Complete button if all questions answered */}
                {progress === 1 && (
                    <TouchableOpacity style={styles.completeButton} onPress={() => router.back()}>
                        <Text style={styles.completeButtonText}>Complete</Text>
                    </TouchableOpacity> )}
                <View style={{ height: footerHeight }} />
            </ScrollView>
            {/* Blur into footer */}
            <LinearGradient colors={['rgba(255, 228, 235, 0)', '#FFC6D5']} style={[styles.footerBlur, { height: footerHeight, bottom: footerHeight + 25 }]} pointerEvents="none" />
            {/* Footer */}
            <View onLayout={e => setFooterHeight(e.nativeEvent.layout.height)} style={styles.footer}>
                <Progress.Bar
                    style={{ flex: 1, }}
                    width={null}
                    progress={progress}
                    height={8}
                    color="#5856ce"
                    unfilledColor="lightgray"
                    borderWidth={0}
                    borderRadius={5} />
                <Text style={{ marginLeft: 10 }}>{Math.round(progress * 100)}%</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerBlur: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 40,
        zIndex: 1,
    },
    container: {
        paddingTop: 20,
    },
    autoSaveText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#4A4A4A',
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 20, // After the auto save text, there will be a 20 gap
    },
    subsectionContainer: {
        // marginBottom: 20, // After the last card, there will be a 20 margin
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    subsectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 10,
    },
    questionContainer: { // Aka card
        width: '83%',
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: 'center'
    },
    radioGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    radioContainer: {
        alignItems: "center",
        flex: 1, // Ensures equal spacing for all options
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#777",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedRadioButton: {
        borderColor: "#5856ce",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#5856ce",
    },
    radioLabel: {
        marginTop: 4,
        fontSize: 12,
        textAlign: "center",
    },
    completeButton: {
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
    },
    completeButtonText: {
        color: '#5856ce',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    footerBlur: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    footer: {
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

    },
});
