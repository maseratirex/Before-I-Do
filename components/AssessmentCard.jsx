import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AssessmentCard({hasUserStarted}) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push("/directory")}>
            <Text style={styles.title}>Assessment</Text>
            <Text style={styles.description}>
                Discover insights about yourself and your relationship
            </Text>
            <View style={styles.divider} />
            <Text style={styles.actionText}>{hasUserStarted ? "Continue" : "Begin"} Assessment</Text>
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