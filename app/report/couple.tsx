import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { auth, db, functions } from '@/firebaseConfig';
import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { questionnaire } from "../../components/questionnaire";
import { httpsCallable } from "firebase/functions";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import createLogger from '@/utilities/logger';

export default function CoupleScreen() {
  const logger = createLogger('CoupleScreen');

  const [combinedData, setCombinedData] = useState<barDataItem[]>([]);
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [userScores, setUserScores] = useState<Record<string, string>>({});
  const [partnerScores, setPartnerScores] = useState<Record<string, string>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionDescriptions: Record<string, string> = {
    "Harmony and Cooperation": "The ability to work together with mutual respect and understanding supports a balanced and cooperative relationship dynamic. It reflects how well partners align on goals, responsibilities, and everyday interactions.",
    "Relationship Challenges": "The way a couple navigates disagreements and difficulties reveals resilience and emotional maturity. It captures how partners respond to tension, miscommunication, and differing needs."};

  const thresholds: Record<string, [number, number, number]> = {
    "Harmony and Cooperation": [3.0, 4.0, 5.0],
    "Relationship Challenges": [1.71, 2.75, 5.0],
  };

  const screenWidth = Dimensions.get('window').width * 0.9;
  const barCount = combinedData.length;
  const barWidth = 40;
  const spacing = barCount > 1 ? (screenWidth - barCount * barWidth) / (barCount - 1) : 0;

  const determineCategory = (value: number, thresholds: [number, number, number]) => {
    if (value <= thresholds[0]) return "Low";
    if (value <= thresholds[1]) return "Med";
    return "High";
  };

  const loadData = async () => {
    const user = auth.currentUser;
    if (user) {
      let userAnswers: string[] = [];
      let partnerAnswers: string[] = [];

      // Fetch current user's data
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          userAnswers = userData.coupleDynamics as string[];
        } else {
          logger.error("User document does not exist.");
          return;
        }
      } catch (error) {
        logger.error("Error fetching user's data:", error);
        return;
      }

      // Fetch partner's data
      try {
        const checkPartnerResponsesFunction = httpsCallable(functions, "seePartnerResponses");
        const myParams = { user: auth.currentUser?.uid };
        const result = await checkPartnerResponsesFunction(myParams);
        const results = result.data as { success: boolean, responses: { coupleResponses: string[] }, message: string };
        if (results.success) {
          partnerAnswers = results.responses.coupleResponses;
        } else {
          logger.error("Error fetching partner's data:", results.message);
          return;
        }
      } catch (error: any) {
        logger.error("Error calling seePartnerResponses:", error.message || error);
        return;
      }

      // Combine user and partner data for the bar chart
      const section = questionnaire.couple;
      const titles = Object.keys(section);
      setSectionTitles(titles);
      const subsections = Object.values(section);
      const subsectionLengths = subsections.map((subsection) => Object.keys(subsection).length);

      let startIndex = 0;
      const newCombinedData: barDataItem[] = [];
      const newUserScores: Record<string, string> = {};
      const newPartnerScores: Record<string, string> = {};
      subsectionLengths.forEach((length, index) => {
        const userSubsectionAnswers = userAnswers
          .slice(startIndex, startIndex + length)
          .map((value) => parseFloat(value));
        const partnerSubsectionAnswers = partnerAnswers
          .slice(startIndex, startIndex + length)
          .map((value) => parseFloat(value));

        const userAverage = userSubsectionAnswers.reduce((sum, value) => sum + value, 0) / length;
        const partnerAverage = partnerSubsectionAnswers.reduce((sum, value) => sum + value, 0) / length;

        const sectionTitle = titles[index];
        newUserScores[sectionTitle] = determineCategory(userAverage, thresholds[sectionTitle]);
        newPartnerScores[sectionTitle] = determineCategory(partnerAverage, thresholds[sectionTitle]);

        newCombinedData.push({ value: userAverage, spacing: 0.5, barBorderRadius: 3 });
        newCombinedData.push({ value: partnerAverage, barBorderRadius: 3 });

        startIndex += length;
      });

      setUserScores(newUserScores);
      setPartnerScores(newPartnerScores);
      setCombinedData(newCombinedData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
      <ScrollView style={{flex: 1}}>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.chartContainer}>
              {/* Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FF597C' }]} />
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>You</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#328ADA' }]} />
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>Your Partner</Text>
                </View>
              </View>

              <BarChart
                data={combinedData.map((bar, index) => {
                  const isUser = index % 2 === 0;
                  const pair = Math.floor(index / 2);
                  const selected = pair === selectedSectionIndex;
                  const base = isUser ? '#FDC2CE' : '#A7D5FF';
                  const border = isUser ? '#FF597C' : '#328ADA';

                  return {
                    ...bar,
                    frontColor: selected ? border : base,
                    barBorderColor: border,
                    barBorderWidth: 1.5,
                    onPress: () => {
                      setSelectedSectionIndex(pair);
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
                height={200}/>
            </View>

            <View style={styles.sectionInfo}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / (Dimensions.get("window").width - 40));
                setSelectedSectionIndex(newIndex);
              }}
            >
              {sectionTitles.map((title, index) => (
                <View key={index} style={styles.sectionPage}>
                  <Text style={styles.sectionTitle}>{title}</Text>
                  <Text style={styles.sectionDescription}>{sectionDescriptions[title]}</Text>
                  <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Strength in this Area</Text>
                    <View style={styles.strengthRow}>
                        <View style={[styles.strengthRowWithScore, {paddingRight: 30}]}>
                          <Text
                            style={[
                              styles.strengthValue,
                              userScores[title] === "Low"
                                ? styles.lowScore
                                : userScores[title] === "Med"
                                ? styles.mediumScore
                                : styles.highScore,
                            ]}
                          >
                            {userScores[title]}
                          </Text>
                          <Text style={styles.strengthLabel}>You</Text>
                        </View>
                        <View style={styles.strengthRowWithScore}>
                          <Text
                            style={[
                              styles.strengthValue,
                              partnerScores[title] === "Low"
                                ? styles.lowScore
                                : partnerScores[title] === "Med"
                                ? styles.mediumScore
                                : styles.highScore,
                            ]}
                          >
                            {partnerScores[title]}
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
                {sectionTitles.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pageControlDot,
                      selectedSectionIndex === index && styles.pageControlDotSelected,
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