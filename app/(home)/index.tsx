import { View, StyleSheet, Text, Button, TouchableOpacity, Alert, FlatList, TextInput, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebaseConfig'
import PairPartner from '@/components/PairPartner';

export default function Index() {
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      router.replace('/auth/login');
    }
  });
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Pressable style={styles.button} onPress={() => router.push("/directory")}>
        <Text style={styles.buttonText}>Begin assessment</Text>
      </Pressable>
      <Text style={styles.title}>Pair with Partner</Text>
      <ScrollView style={styles.list}>
        <PairPartner/>
      </ScrollView>
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