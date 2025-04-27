import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ReportCard({ isPartnerAssessmentSubmitted: isPartnerAssessmentSubmitted }) {
  const router = useRouter();
    return (
        <TouchableOpacity style={styles.card} disabled={!isPartnerAssessmentSubmitted} onPress={() => isPartnerAssessmentSubmitted && router.push("/report/personality")}>
          <Text style={styles.title}>Relationship Report</Text>
          <Text style={styles.description}>
            {isPartnerAssessmentSubmitted ? "See your relationship's strengths" : "Waiting for your partner to complete their assessment"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>View Results</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  card: {
    width: "83%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4a4a4a",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});