import React, { useState, useEffect } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import AssessmentSubsection from "@/components/assessment/AssessmentSubsection";
import { useLocalSearchParams } from 'expo-router';
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { questionnaire } from "@/components/questionnaire";
import createLogger from "@/utilities/logger";

export default function QuestionnaireScreen() {
    const logger = createLogger("QuestionnaireScreen");

    const { name } = useLocalSearchParams();
    const sectionName = name.toLowerCase();
    const [sectionAnswers, setSectionAnswers] = useState({});

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const storageKey = `answers-${userId}-${sectionName}`;

    const [isLoaded, setIsLoaded] = useState(false);

    const loadAnswers = React.useCallback(async () => {
        try {
            // TODO Create environment variable to toggle testing mode
            const testing = false;
            // To limit reads, save an entire section of answers in AsyncStorage as an object with keys for each subsection
            if (testing) {
                logger.info("Simulating answers");
                // Loop over the subsections in the section, identify how many questions are in each subsection, and generate random answers for each question
                const simulatedSectionAnswers = {};
                Object.keys(questionnaire[sectionName]).forEach((subsectionName) => {
                    simulatedSectionAnswers[subsectionName] = Array(questionnaire[sectionName][subsectionName].length)
                        .fill(0)
                        .map(() => Math.floor(Math.random() * 5) + 1);
                });
                setSectionAnswers(simulatedSectionAnswers);
                // TODO Ensure this triggers a save of the answers
            } else {
                const savedSectionAnswers = await AsyncStorage.getItem(storageKey);
                if (savedSectionAnswers) {
                    logger.info("Loaded answers");
                    const savedSectionAnswersObject = JSON.parse(savedSectionAnswers);
                    logger.info(`Parsed answers: ${JSON.stringify(savedSectionAnswersObject)}`);
                    setSectionAnswers(savedSectionAnswersObject);
                } else {
                    logger.info("No saved answers found");
                    const simulatedSectionAnswers = {};
                    Object.keys(questionnaire[sectionName]).forEach((subsectionName) => {
                        simulatedSectionAnswers[subsectionName] = Array(questionnaire[sectionName][subsectionName].length).fill(0);
                    });
                    logger.info(`Defaulted to no answers`);
                    setSectionAnswers(simulatedSectionAnswers);
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

    if (!isLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.autoSaveText}>Your progress is saved automatically when you press ‘Complete’ or ‘Back’</Text>
            {Object.keys(sectionAnswers).map((subsectionName) => (
                <AssessmentSubsection key={subsectionName} sectionName={sectionName} subsectionName={subsectionName} subsectionAnswers={sectionAnswers[subsectionName]} updateSubsectionAnswers={(index, value) => {
                    const updatedSectionAnswers = { ...sectionAnswers };
                    updatedSectionAnswers[subsectionName][index] = value;
                    setSectionAnswers(updatedSectionAnswers);
                }} />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
});
