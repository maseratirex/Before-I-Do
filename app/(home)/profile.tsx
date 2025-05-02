import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import Dialog from "react-native-dialog";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import { getAuth, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions, db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const [showPasswordDialog, setPasswordDialogVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [userInitial, setUserInitial] = useState('');

  const handleCancel = () => {
    setPassword('');
    setPasswordDialogVisible(false);
  };

  const getUserInitials = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserInitial(data.initials);
    }
  }

  useEffect(() => {
    getUserInitials();
  }, []);

  const deleteUserFunc = async () => {
    const auth = getAuth();

    // re-authenticate user
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    const credential = EmailAuthProvider.credential(user.email || '', password);
    reauthenticateWithCredential(user, credential).then(async () => {
      // User re-authenticated, proceed with deletion
      setPasswordDialogVisible(false);

      // Call firestore to delete user data
      const deleteUserFunction = httpsCallable(functions, "deleteUserData");
      const functionParams = { user: auth.currentUser?.uid };
      const response = await deleteUserFunction(functionParams) as any;
      if (!response.data.success) {
        console.log("User data was not deleted successfully");
        Alert.alert('Error', 'User data was not deleted successfully');
        return;
      }
      // Remove user data from local storage
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      console.log("User data removed from local storage");

      // Call auth to delete user
      if (user) {
        deleteUser(user).then(() => {
          console.log("User account deleted successfully");
          Alert.alert('Success', 'User account deleted successfully');
        }).catch((error) => {
          console.error("Error deleting user account:", error);
          Alert.alert('Error', 'Error deleting user account: ' + error.message);
        });
      }
    }).catch((error) => {
      setPassword('');
      console.error("Error re-authenticating user:", error);
      Alert.alert('Error', 'Re-authentication failed: ' + error.message);
    });

  }
  
  return (
    <LinearGradient colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <SafeAreaView style={styles.container}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileIconContainer}>
            <View style={styles.circle}>
              <Text style={styles.initialsText}>{userInitial}</Text>
            </View>
          </View>
          <Text style={styles.emailText}>{getAuth().currentUser?.email}</Text>
        </View>
        <View style={styles.buttonContainers}>
          <TouchableOpacity style={styles.button} onPress={() => {
            const auth = getAuth();
            signOut(auth).catch((error) => {
              Alert.alert('Sign Out Failed', error.message);
            });
          }}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { setPasswordDialogVisible(true) }}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        <Dialog.Container visible={showPasswordDialog}>
          <Dialog.Title>Account delete</Dialog.Title>
          <Dialog.Description>
            Enter your password to confirm account deletion. You cannot undo this action.
          </Dialog.Description>
          <Dialog.Input
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            placeholderTextColor="#888"
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Delete" onPress={deleteUserFunc} />
        </Dialog.Container>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, // Occupy the entire screen vertically and horizontally.
    // ScrollView requires a bounded height; flex: 1 informs the LinearGradient's child
    // that the height is the entire screen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  // Profile
  profileInfoContainer: { // Wraps the icon and the email
    gap: 12,
  },
  profileIconContainer: {
    marginTop: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDDE7',
    position: 'relative',
    zIndex: 1,
    borderWidth: 5,
    borderColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 7,
  },
  initialsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  emailText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  // Buttons
  buttonContainers: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 100,
  },
  button: {
    width: '83%',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 15,
    color: '#007bff',
    fontSize: 14,
  },
});