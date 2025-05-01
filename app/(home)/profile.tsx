import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import Dialog from "react-native-dialog";
import { getAuth, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function ProfileScreen() {
  const [showPasswordDialog, setPasswordDialogVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleCancel = () => {
    setPassword('');
    setPasswordDialogVisible(false);
  };
  
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => {
        const auth = getAuth(); 
        signOut(auth).catch((error) => {
          Alert.alert('Sign Out Failed', error.message);
        });
      }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {setPasswordDialogVisible(true)}}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
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
        <Dialog.Button label="Cancel" onPress={handleCancel}/>
        <Dialog.Button label="Delete" onPress={deleteUserFunc}/>
      </Dialog.Container>
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