import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { auth, db, functions } from '@/firebaseConfig';
import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { questionnaire } from "../../components/questionnaire";
import { httpsCallable } from "firebase/functions";

export default function PersonalityScreen() {
  const [combinedData, setCombinedData] = useState<barDataItem[]>([]);
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionDescriptions = [
    "The ability to stay calm and balanced under pressure helps partners navigate stress without becoming overwhelmed. It supports emotional steadiness and healthier conflict resolution.",
    "The capacity to understand and share another’s feelings deepens emotional connection and trust. It fosters compassion and more supportive, empathetic interactions.",
    "The tendency to embrace new ideas and experiences encourages growth, flexibility, and mutual exploration. It creates space for open-minded communication and adaptability in the relationship.",
    "A sense of self-assurance and inner security allows individuals to express themselves clearly and confidently. It reduces the need for constant reassurance and promotes mutual respect.",
    "The tendency to feel safe and supported in close relationships builds trust and emotional intimacy. It helps partners remain connected and resilient through challenges."]

  const screenWidth = Dimensions.get('window').width * 0.9;
  const barCount = combinedData.length;
  const barWidth = 20;
  const spacing = barCount > 1 ? (screenWidth - barCount * barWidth) / (barCount - 1) : 0;

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
          userAnswers = userData.personalityDynamics as string[];
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
        const results = result.data as { success: boolean, responses: { personalityResponses: string[] }, message: string };
        if (results.success) {
          partnerAnswers = results.responses.personalityResponses;
        } else {
          console.error("Error fetching partner's data:", results.message);
          return;
        }
      } catch (error: any) {
        console.error("Error calling seePartnerResponses:", error.message || error);
        if (error.code) {
          console.error("Error code:", error.code);
        }
        if (error.details) {
          console.error("Error details:", error.details);
        }
        return;
      }

      // Combine user and partner data for the bar chart
      const section = questionnaire.personality;
      setSectionTitles(Object.keys(section));
      const subsections = Object.values(section);
      const subsectionLengths = subsections.map((subsection) => Object.keys(subsection).length);

      let startIndex = 0;
      const newCombinedData: barDataItem[] = [];
      subsectionLengths.forEach((length, index) => {
        const userSubsectionAnswers = userAnswers
          .slice(startIndex, startIndex + length)
          .map((value) => parseFloat(value));
        const partnerSubsectionAnswers = partnerAnswers
          .slice(startIndex, startIndex + length)
          .map((value) => parseFloat(value));

        const userAverage = userSubsectionAnswers.reduce((sum, value) => sum + value, 0) / length;
        const partnerAverage = partnerSubsectionAnswers.reduce((sum, value) => sum + value, 0) / length;

        newCombinedData.push({ value: userAverage, spacing: 0.5, barBorderRadius: 3 });
        newCombinedData.push({ value: partnerAverage, barBorderRadius: 3 });

        startIndex += length;
      });

      setCombinedData(newCombinedData);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.chartContainer}>
            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#DD90A8' }]} />
                <Text style={styles.legendText}>You</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#6178AE' }]} />
                <Text style={styles.legendText}>Your Partner</Text>
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
              hideRules
              noOfSections={5}
              yAxisLabelTexts={['—', '—', '—', '—', '—', '—']}
              yAxisThickness={0}
              xAxisThickness={0}
              maxValue={5}
              height={250}
                          />
          </View>

          {/* Section Info */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / (Dimensions.get("window").width - 40));
              setSelectedSectionIndex(newIndex);
            }}
            style={styles.scrollSection}
            contentContainerStyle={styles.scrollContent}
          >
            {sectionTitles.map((title, index) => (
              <View key={index} style={styles.sectionPage}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionDescription}>{sectionDescriptions[index]}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Page Control */}
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
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 6,
    borderRadius: 3,
  },
  legendText: {
    color: '#000',
    fontSize: 14,
  },
  chartContainer: {
    width: '100%',
    backgroundColor: '#EDEDED',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  scrollSection: {
    maxHeight: 120,
    width: '100%',
    borderRadius: 12, 
    backgroundColor: '#FFF', 
    padding: 10
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sectionPage: {
    width: Dimensions.get("window").width - 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18, 
    color: '#000',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
  },
  pageControlContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
});