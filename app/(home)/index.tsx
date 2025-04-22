import { View, StyleSheet, Text, Button, TouchableOpacity, Alert, FlatList, TextInput, ScrollView, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebaseConfig'
import PairPartner from '@/components/PairPartner';
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });
  
  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
        <Text style={styles.title}>Assessment</Text>
        <Text style={styles.description}>
          Discover insights about yourself and your relationship
        </Text>
        <View style={styles.divider} />
        <Text style={styles.actionText}>Begin Assessment</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Pair with Partner</Text>
    </LinearGradient>
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
    list: {
      width: '100%',
      flexGrow: 0,
    },
    smallContainer: {
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
    emailText: {
      marginTop: 15,
      color: '#000000',
      fontSize: 14,
  },
});