import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from '@/firebaseConfig'
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  return (
    <LinearGradient
          colors={['#FFE4EB', '#FFC6D5']} 
          style={styles.container}
        >
      <Text style={styles.title}>Pair with Partner</Text>
      <TouchableOpacity style={styles.button} onPress={() => { 
        signOut(auth).catch((error) => {
          Alert.alert('Sign Out Failed', error.message);
        });
       }}>2
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
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