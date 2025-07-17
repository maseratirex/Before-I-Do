import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LikertItem from './LikertItem';
import { questionnaire } from "../questionnaire";

export default function AssessmentSubsection({ sectionName, subsectionName, subsectionAnswers, onSubsectionAnswersUpdate }) {
  const subsectionQuestions = questionnaire[sectionName][subsectionName];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subsectionName}</Text>
      {subsectionQuestions.map((subsectionQuestion, index) => (
        <LikertItem key={index} question={subsectionQuestion} answer={subsectionAnswers[index]} onAnswerUpdate={(value) => onSubsectionAnswersUpdate(index, value)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  title: {
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
