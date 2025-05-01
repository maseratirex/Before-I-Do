import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const options = ["1", "2", "3", "4", "5"];
const labels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly \nAgree",
];
const reverseScoreIndexes = {"personality": [], "family": [17, 27], "couple": [26], "cultural": [7, 14]}


const LikertScale = ({ section, subsections, answers, setAnswers }) => {
  const handlePress = (questionIndex, value) => {
    const updatedAnswers = [...answers]; // Copy array
    updatedAnswers[questionIndex] = (reverseScoreIndexes[section].includes(questionIndex)) ? String(6 - value) : value; // Update specific index
    setAnswers(updatedAnswers); // Update state
  };

  let questionIndex = 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitleText}>Your progress is saved automatically when you press ‘Complete’ or ‘Back’</Text>
      {Object.entries(subsections).map(([subsection, questions]) => (
        <View key={subsection} style={styles.subsectionContainer}>
          <Text style={styles.subsectionTitle}>{subsection}</Text>
          {questions.map((question) => {
            const index = questionIndex;
            questionIndex++;
            return (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question}</Text>
                <View style={styles.radioGroup}>
                  {options.map((value, idx) => (
                    <View key={value} style={styles.radioContainer}>
                      <TouchableOpacity
                        style={[
                          styles.radioButton,
                          answers[index] === ((reverseScoreIndexes[section].includes(index)) ? String(6 - value) : value) && styles.selectedRadioButton,
                        ]}
                        onPress={() => handlePress(index, value)}
                      >
                        {answers[index] === ((reverseScoreIndexes[section].includes(index)) ? String(6 - value) : value) && <View style={styles.radioInner} />}
                      </TouchableOpacity>
                      <Text style={styles.radioLabel}>{labels[idx]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  subsectionTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: 'center'},
  questionText: { fontSize: 18, marginBottom: 10, fontWeight: "bold", textAlign: 'center' },

  questionContainer: { 
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

  subtitleText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4A4A4A',
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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

export default LikertScale;