import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { db, functions } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { questionnaire } from "../../components/questionnaire";
import { httpsCallable } from "firebase/functions";
import { SafeAreaView } from 'react-native-safe-area-context';
import createLogger from '@/utilities/logger';
import { reverseScoringIndices } from '@/constants/reverseScoringIndices';
import { thresholds } from '@/constants/thresholds';
import { descriptions } from '@/constants/descriptions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportScreen({ sectionName }) {
    const logger = createLogger('ReportScreen');
    const userId = getAuth().currentUser.uid;

    const [combinedData, setCombinedData] = useState([]); // Bar chart data
    const [selectedSubsectionIndex, setSelectedSubsectionIndex] = useState(0);
    const [userSubsectionCategories, setUserSubsectionCategories] = useState({});
    const [partnerSubsectionCategories, setPartnerSubsectionCategories] = useState({});

    const determineCategory = (value, subsectionThresholds) => {
        if (value <= subsectionThresholds[0]) return "Low";
        if (value <= subsectionThresholds[1]) return "Med";
        return "High";
    };

    const loadData = async () => {
        logger.info("Loading data");

        // Fetch current user's data
        const sectionStorageKey = `answers-${userId}-${sectionName.toLowerCase()}`;
        let userSectionAnswers = {};
        try {
            const savedAnswers = await AsyncStorage.getItem(sectionStorageKey);
            if (savedAnswers) {
                userSectionAnswers = JSON.parse(savedAnswers);
            } else {
                logger.error("Failed to locate saved answers in local storage");
            }
        } catch (error) {
            logger.error(`Error loading progress for ${sectionName}:`, error);
        }

        // Fetch partner's data
        let partnerSectionAnswers = {};
        try {
            const checkPartnerResponsesFunction = httpsCallable(functions, "seePartnerResponses");
            const result = await checkPartnerResponsesFunction();
            if (result.data.success) {
                partnerSectionAnswers = result.data.partnerResponses[sectionName];
            } else {
                logger.error("Error fetching partner's data:", result.data.message);
                return;
            }
        } catch (error) {
            logger.error("Error calling seePartnerResponses:", error.message || error);
            return;
        }

        const newCombinedData = []; // Bar chart data
        const newUserSubsectionCategories = {};
        const newPartnerSubsectionCategories = {};
    
        // Calculate the corresponding category for each subsection for user and partner
        // Add the subsection average to the bar chart
        // Factor in reverse scoring for calculating averages
        Object.keys(userSectionAnswers).forEach((subsectionName) => {
            try {
                const userSubsectionAnswers = userSectionAnswers[subsectionName];
                const partnerSubsectionAnswers = partnerSectionAnswers[subsectionName];

                let userSubsectionSum = 0;
                for (let i = 0; i < userSubsectionAnswers.length; i++) {
                    const answer = userSubsectionAnswers[i];
                    if (reverseScoringIndices[sectionName][subsectionName].includes(i)) {
                        userSubsectionSum += 6 - answer;
                    } else {
                        userSubsectionSum += answer;
                    }
                }
                const userSubsectionAverage = userSubsectionSum / userSubsectionAnswers.length;
                let partnerSubsectionSum = 0;
                for (let i = 0; i < partnerSubsectionAnswers.length; i++) {
                    const answer = partnerSubsectionAnswers[i];
                    if (reverseScoringIndices[sectionName][subsectionName].includes(i)) {
                        partnerSubsectionSum += 6 - answer;
                    } else {
                        partnerSubsectionSum += answer;
                    }
                }
                const partnerSubsectionAverage = partnerSubsectionSum / partnerSubsectionAnswers.length;
                const userSubsectionCategory = determineCategory(userSubsectionAverage, thresholds[sectionName][subsectionName]);
                const partnerSubsectionCategory = determineCategory(partnerSubsectionAverage, thresholds[sectionName][subsectionName]);

                newUserSubsectionCategories[subsectionName] = userSubsectionCategory;
                newPartnerSubsectionCategories[subsectionName] = partnerSubsectionCategory;

                newCombinedData.push({ value: userSubsectionAverage, spacing: 0.5, barBorderRadius: 3 });
                newCombinedData.push({ value: partnerSubsectionAverage, barBorderRadius: 3 });
            } catch (error) {
                console.error("Error calculating subsection averages", error);
            }
        });

        setUserSubsectionCategories(newUserSubsectionCategories);
        setPartnerSubsectionCategories(newPartnerSubsectionCategories);
        setCombinedData(newCombinedData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const scrollViewRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const forward = () => {
            scrollViewRef.current.scrollTo({ x: 20, animated: true });
        };

        const back = () => {
            scrollViewRef.current.scrollTo({ x: 0, animated: true });
        };

        const t1 = setTimeout(forward, 1300);
        const t2 = setTimeout(back, 1500);
        const t3 = setTimeout(forward, 1700);
        const t4 = setTimeout(back, 1900);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    // Screen width... but 90% of the screen width
    const screenWidth = Dimensions.get('window').width * 0.9;
    const barCount = combinedData.length;
    const barWidth = 20;
    const spacing = barCount > 1 ? (screenWidth - barCount * barWidth) / (barCount - 1) : 0;
    const subsectionNames = Object.keys(questionnaire[sectionName.toLowerCase()]);

    return (
        <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <SafeAreaView>
                    <View style={styles.container}>
                        <View style={styles.chartContainer}>
                            {/* Legend */}
                            <View style={styles.legendContainer}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendColor, { backgroundColor: '#FF597C' }]} />
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>You</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendColor, { backgroundColor: '#328ADA' }]} />
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Your Partner</Text>
                                </View>
                            </View>

                            <BarChart
                                data={combinedData.map((bar, index) => {
                                    const isUser = index % 2 === 0;
                                    const pair = Math.floor(index / 2);
                                    const selected = pair === selectedSubsectionIndex;
                                    const base = isUser ? '#FDC2CE' : '#A7D5FF';
                                    const border = isUser ? '#FF597C' : '#328ADA';

                                    return {
                                        ...bar,
                                        frontColor: selected ? border : base,
                                        barBorderColor: border,
                                        barBorderWidth: 1.5,
                                        onPress: () => {
                                            setSelectedSubsectionIndex(pair);
                                            scrollViewRef.current?.scrollTo({
                                                x: pair * (Dimensions.get("window").width * 0.83),
                                                animated: true,
                                            });
                                        },
                                    };
                                })}
                                barWidth={barWidth}
                                spacing={spacing}
                                initialSpacing={spacing / 2}
                                disableScroll
                                isAnimated
                                noOfSections={5}
                                yAxisLabelTexts={['—', '—', '—', '—', '—', '—']}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                maxValue={5}
                                height={200} />
                        </View>

                        <View style={styles.sectionInfo}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                ref={scrollViewRef}
                                onMomentumScrollEnd={(e) => {
                                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / (Dimensions.get("window").width - 40));
                                    setSelectedSubsectionIndex(newIndex);
                                }}
                            >
                                {subsectionNames.map((subsectionName, index) => (
                                    <View key={index} style={styles.sectionPage}>
                                        <Text style={styles.sectionTitle}>{subsectionName}</Text>
                                        <Text style={styles.sectionDescription}>{descriptions[sectionName][subsectionName]}</Text>
                                        <View style={styles.divider} />
                                        <Text style={styles.sectionTitle}>Strength in this Area</Text>
                                        <View style={styles.strengthRow}>
                                            <View style={[styles.strengthRowWithScore, { paddingRight: 30 }]}>
                                                <Text
                                                    style={[
                                                        styles.strengthValue,
                                                        userSubsectionCategories[subsectionName] === "Low"
                                                            ? styles.lowScore
                                                            : userSubsectionCategories[subsectionName] === "Med"
                                                                ? styles.mediumScore
                                                                : styles.highScore,
                                                    ]}
                                                >
                                                    {userSubsectionCategories[subsectionName]}
                                                </Text>
                                                <Text style={styles.strengthLabel}>You</Text>
                                            </View>
                                            <View style={styles.strengthRowWithScore}>
                                                <Text
                                                    style={[
                                                        styles.strengthValue,
                                                        partnerSubsectionCategories[subsectionName] === "Low"
                                                            ? styles.lowScore
                                                            : partnerSubsectionCategories[subsectionName] === "Med"
                                                                ? styles.mediumScore
                                                                : styles.highScore,
                                                    ]}
                                                >
                                                    {partnerSubsectionCategories[subsectionName]}
                                                </Text>
                                                <Text style={styles.strengthLabel}>Your{'\n'}Partner</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Page Control */}
                        <View style={styles.pageControlWrapper}>
                            <View style={styles.pageControlContainer}>
                                {subsectionNames.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.pageControlDot,
                                            selectedSubsectionIndex === index && styles.pageControlDotSelected,
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingTop: 50,
        paddingBottom: 100
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    legendItem: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    legendColor: {
        width: 17,
        height: 17,
        marginRight: 6,
        borderRadius: 3,
    },
    chartContainer: {
        width: "83%",
        paddingTop: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    sectionInfo: {
        width: "83%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    sectionPage: {
        width: Dimensions.get("window").width * 0.83,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: "3%",
        fontSize: 17,
    },
    sectionDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: "4%",
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: "4%",
    },
    pageControlWrapper: {
        alignSelf: 'center',
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    pageControlContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pageControlDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    pageControlDotSelected: {
        backgroundColor: '#5856ce',
    },
    strengthRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    strengthRowWithScore: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    strengthLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    strengthValue: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
        textAlign: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    lowScore: {
        backgroundColor: '#FFCDD2', // Light red background
        color: '#D32F2F', // Red text
    },
    mediumScore: {
        backgroundColor: '#FFF9C4', // Light yellow background
        color: '#FBC02D', // Yellow text
    },
    highScore: {
        backgroundColor: '#C8E6C9', // Light green background
        color: '#388E3C', // Green text
    },
});