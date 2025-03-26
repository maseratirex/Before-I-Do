import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const options = ["1", "2", "3", "4", "5"];
const labels = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

const LikertScale = ({ questions, answers: initialAnswers }) => {
  const [answers, setAnswers] = useState(initialAnswers.split(""));

  useEffect(() => {
    // Ensure state updates properly if initialAnswers changes
    setAnswers(initialAnswers.padEnd(questions.length, "0").split(""));
  }, [initialAnswers, questions.length]);

  const handlePress = (questionIndex, value) => {
    const updatedAnswers = [...answers]; // Copy array
    updatedAnswers[questionIndex] = value; // Update specific index
    setAnswers(updatedAnswers); // Update state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
          <View style={styles.radioGroup}>
            {options.map((value, idx) => (
              <View key={value} style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    answers[index] === value && styles.selectedRadioButton,
                  ]}
                  onPress={() => handlePress(index, value)}
                >
                  {answers[index] === value && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioLabel}>{labels[idx]}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      <Text style={styles.answerText}>Answers: {answers.join("")}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  questionContainer: { marginBottom: 30 },
  questionText: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  
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
    borderColor: "#4CAF50",
  },
  
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  
  radioLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },

  answerText: { marginTop: 20, fontSize: 16, fontWeight: "bold" },
});

export default LikertScale;