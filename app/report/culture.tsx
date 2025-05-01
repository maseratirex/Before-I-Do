import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { auth, db, functions } from '@/firebaseConfig';
import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { questionnaire } from "../../components/questionnaire";
import { httpsCallable } from "firebase/functions";
import { LinearGradient } from "expo-linear-gradient";

export default function CultureScreen() {
  const [combinedData, setCombinedData] = useState<barDataItem[]>([]);
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [userScores, setUserScores] = useState<Record<string, string>>({});
  const [partnerScores, setPartnerScores] = useState<Record<string, string>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionDescriptions: Record<string, string> = {
    "Spiritual Beliefs": "The role of spiritual or religious beliefs in one’s life and relationship can shape values, priorities, and shared meaning. Alignment or respectful understanding in this area supports deeper connection and mutual respect.",
    "Lifestyle": "The approach to daily living, habits, and long-term priorities reflects how partners balance independence and compatibility. It includes routines, health choices, and life goals that influence overall relationship rhythm.",
    "Traditions": "The importance placed on cultural or family traditions can affect how partners celebrate, connect, and build shared identity. Honoring these traditions supports a sense of belonging and continuity.",
    "Marriage Preparations": "The readiness and practical steps taken toward marriage show intention, commitment, and thoughtfulness in planning for the future. It includes conversations around logistics, expectations, and emotional preparedness."};

  const thresholds: Record<string, [number, number, number]> = {
    "Spiritual Beliefs": [3.75, 4.37, 5.0],
    "Lifestyle": [3.55, 4.0, 5.0],
    "Traditions": [3.5, 4.0, 5.0],
    "Marriage Preparations": [3.57, 4.43, 5.0],
  };
    
  const screenWidth = Dimensions.get('window').width * 0.9;
  const barCount = combinedData.length;
  const barWidth = 28;
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
          userAnswers = userData.cultureDynamics as string[];
        } else {
          console.error("User document does not exist.");
          return;
        }
      } catch (error) {
        console.error("Error fetching user's data:", error);
        return;
      }

      // Fetch partner's data
      try {
        const checkPartnerResponsesFunction = httpsCallable(functions, "seePartnerResponses");
        const myParams = { user: auth.currentUser?.uid };
        const result = await checkPartnerResponsesFunction(myParams);
        const results = result.data as { success: boolean, responses: { cultureResponses: string[] }, message: string };
        if (results.success) {
          partnerAnswers = results.responses.cultureResponses;
        } else {
          console.error("Error fetching partner's data:", results.message);
          return;
        }
      } catch (error: any) {
        console.error("Error calling seePartnerResponses:", error.message || error);
        return;
      }

      // Combine user and partner data for the bar chart
      const section = questionnaire.cultural;
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
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#DD90A8' }]} />
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>You</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#6178AE' }]} />
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Your Partner</Text>
            </View>
          </View>

          <BarChart
            data={combinedData.map((bar, index) => {
              const isUser = index % 2 === 0;
              const pair = Math.floor(index / 2);
              const selected = pair === selectedSectionIndex;
              const base = isUser ? '#FFCDD9' : '#AAC1F7';
              const border = isUser ? '#DD90A8' : '#6178AE';

              return {
                ...bar,
                frontColor: selected ? border : base,
                barBorderColor: border,
                barBorderWidth: 1.5,
                onPress: () => {
                  setSelectedSectionIndex(pair);
                  scrollViewRef.current?.scrollTo({
                    x: pair * (Dimensions.get("window").width - 40),
                    animated: true,
                  });
                },
              };
            })}
            barWidth={barWidth}
            spacing={spacing}
            initialSpacing={(screenWidth - (barCount * barWidth + (barCount - 1) * spacing)) / 2 + spacing / 2}
            disableScroll
            hideRules
            isAnimated
            noOfSections={5}
            yAxisLabelTexts={['—', '—', '—', '—', '—', '—']}
            yAxisThickness={0}
            xAxisThickness={0}
            maxValue={5}
            height={250}
                        />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    width: 15,
    height: 15,
    marginRight: 6,
    borderRadius: 3,
  },
  chartContainer: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionInfo: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  sectionPage: {
    width: Dimensions.get("window").width - 40,
    padding: 10,

  },
  sectionTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 21, 
  },
  sectionDescription: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  pageControlWrapper: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
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
    backgroundColor: '#DD90A8',
  },
  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 50,
  },
  strengthRowWithScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  strengthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  strengthValue: {
    fontSize: 16,
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