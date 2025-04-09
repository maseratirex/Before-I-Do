import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebaseConfig'
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });

  return (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >      <Link href="/directory" style={styles.linkText}>Begin assessment</Link>

    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.container}>
      {/* Begin Assessment Box */}
      <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
        <Text style={styles.title}>Assessment</Text>
        <Text style={styles.description}>
          Discover insights about yourself and your relationship
        </Text>
        <View style={styles.divider} />
        <Text style={styles.actionText}>Begin Assessment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={() => router.push("/pairing")}>
        <Text style={styles.boxText}>Pair with Partner</Text>
        <Text style={styles.description}>
          Discover your relationship’s strengths together
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: "30%",
  },
  box: {
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
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
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    // color: "#007bff",
  },
});