import { View, StyleSheet, Text, Button, TouchableOpacity, Alert, FlatList, TextInput, ScrollView, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/firebaseConfig'
import PairPartner from '@/components/PairPartner';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import React, { useState, useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPartnerFinished, setIsPartnerFinished] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });

  const checkStatus = async () => {
    console.log("Checking status...");
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsSubmitted(data.coupleDynamics !== null && data.cultureDynamics !== null && data.familyDynamics !== null && data.personalityDynamics !== null);
        console.log("isSubmitted: ", isSubmitted);
        const confirmPairRequestFunction = httpsCallable(functions, "confirmPairing");
        const myParams = {
          user: auth.currentUser?.uid,
        }
        const result = await confirmPairRequestFunction(myParams);
        const results = result.data as { success: boolean };
        if (results.success) {
          setIsPartnerFinished(true);
        }
        else {
          setIsPartnerFinished(false);
        }
        console.log("partnerComplete: ", isPartnerFinished);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is signed in");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        checkStatus();
      } else {
        console.log("User is not authenticated or email not verified.");
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []
  );

  const hasNotSubmitted = () => {
    return (
      <>
        <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
          <Text style={styles.title}>Assessment</Text>
          <Text style={styles.description}>
            Discover insights about yourself and your relationship
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>Begin Assessment</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pair with Partner</Text>
        <PairPartner />
        </>
    );
  }

  const submittedAndWaiting = () => {
    return (
      <>
        <TouchableOpacity style={styles.box} onPress={() => router.push("/report/personality")}>
          <Text style={styles.title}>Relationship Report</Text>
          <Text style={styles.description}>
            Waiting for your partner to complete their assessment NOT WORKING YET
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>View Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
          <Text style={styles.title}>Resources</Text>
          <Text style={styles.description}>
            Explore general self-help resources. NOT READY YET
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>View Resources</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pair with Partner</Text>
        <PairPartner />
        </>
    );
  }

  const submittedAndReady = () => {
    return (
      <>
        <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
          <Text style={styles.title}>Relationship Report</Text>
          <Text style={styles.description}>
            See your relationship's strengths NOT WORKING YET
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>View Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => router.push("/directory")}>
          <Text style={styles.title}>Resources</Text>
          <Text style={styles.description}>
            Explore general self-help resources NOT READY YET
          </Text>
          <View style={styles.divider} />
          <Text style={styles.actionText}>View Resources</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pair with Partner</Text>
        <PairPartner />
      </>
    );
  }
  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.container} >
      <SafeAreaView>
        <ScrollView>
          {isSubmitted ? (isPartnerFinished ? submittedAndReady() : submittedAndWaiting()) : hasNotSubmitted()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    alignItems: "center",
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
  scroll: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  centeredSection: {
    alignItems: 'center',
    width: '100%',
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