import { View, StyleSheet, Text } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { auth, db } from '@/firebaseConfig'
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { questionnaire } from "../../components/questionnaire";


export default function CoupleScreen() {
  const [data, setData] = useState<barDataItem[]>([]);

  const loadData = async () => {
    setData([]);
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const answers = userData.coupleDynamics as string[];

          // get lengths of subsections
          const section = questionnaire.couple;
          const subsections = Object.values(section);
          const subsectionLengths = subsections.map((subsection) => Object.keys(subsection).length);
          console.log(subsectionLengths);

          let startIndex = 0;
          const newData: barDataItem[] = []; // Temporary array to store all data
          subsectionLengths.forEach((length) => {
            const subsectionAnswers = answers
              .slice(startIndex, startIndex + length)
              .map((value) => parseFloat(value)); // Convert string values to numbers
            const average = subsectionAnswers.reduce((sum, value) => sum + value, 0) / length;
            newData.push({
              value: average,
              label: String(average),
              frontColor: '#000',
            });
            startIndex += length;
          });

          setData(newData); // Update state once with the complete data array
          console.log("Personality data:", newData);
        }
      } catch (error) {
        console.error(`Error loading progress for Personality:`, error);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text style={{color: '#000'}}>Couple</Text>
      <BarChart data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007bff',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 15,
        color: '#007bff',
        fontSize: 14,
    },
});