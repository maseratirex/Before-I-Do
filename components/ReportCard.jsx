import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { httpsCallable } from "firebase/functions";
import { functions, auth } from '@/firebaseConfig'

// export default function ReportCard({ isPartnerAssessmentSubmitted: isPartnerAssessmentSubmitted }) {
export default function ReportCard() {
  const router = useRouter();
  // const [isPartnerAssessmentSubmitted, setIsPartnerAssessmentSubmitted] = useState(false);

  // Check partner status
  const hasPartnerSubmittedAssessment = async () => {
    // console.log("Checking partner assessment status")
    // const checkPartnerAssessmentStatusFunction = httpsCallable(functions, "seePartnerResponses");
    // const functionParams = { user: auth.currentUser?.uid }; // Vulnerability
    // const response = await checkPartnerAssessmentStatusFunction(functionParams);
    // console.log("This is the response: " + response)
    // setIsPartnerFinished(response.data.success);
    // console.log("how am I here")
    // setBlahBlah(response.data.success);
    // console.log("ok that's just crazy")
    try {
      console.log("Checking partner assessment status");
      
      const checkPartnerAssessmentStatusFunction = httpsCallable(functions, "seePartnerResponses");
      const functionParams = { user: auth.currentUser?.uid }; // Vulnerability
      const response = await checkPartnerAssessmentStatusFunction(functionParams);
      console.log("Partner assessment status:", response);
      return response.data.success;
    } catch (error) {
      console.error("Error checking partner assessment status:", error);
      return false;
    }
  }

  const tryAccessReportScreen = async () => {
    // TODO: Inform the user that we're checking whether their partner has submitted
    const partnerSubmittedAssessment = await hasPartnerSubmittedAssessment()
    if (partnerSubmittedAssessment) {
      router.push("/report/personality")
    } else {
      // TODO: Inform the user that their partner has not submitted
      console.log("Waiting for your partner to complete their assessment")
    }
  }

  return (
    // <TouchableOpacity style={styles.card} onPress={() => isPartnerAssessmentSubmitted && router.push("/report/personality")}>
    <TouchableOpacity style={styles.card} onPress={tryAccessReportScreen}>
      <Text style={styles.title}>Relationship Report</Text>
      <Text style={styles.description}>
        See your assessment results with your partner
        {/* {isPartnerAssessmentSubmitted ? "See your assessment results with your partner" : "Waiting for your partner to complete their assessment"} */}
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