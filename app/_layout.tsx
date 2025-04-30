import { Stack, useRouter } from "expo-router";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


export default function RootLayout() {
  const router = useRouter();

  const isAssessmentSubmittedRemotely = async () => {
    // Returns true if user has submitted assessment answers remotely and false otherwise
    console.log("Checking user assessment completion status in Firestore");
    const user = auth.currentUser;
    if(user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.coupleDynamics !== null && data.cultureDynamics !== null && data.familyDynamics !== null && data.personalityDynamics !== null;
      } else {
        console.log("Could not find user assessment completion status in Firestore");
        return false;
      }
    }
  };

  const storeAssessmentSubmissionStatusLocally = async (status: boolean) => {
    console.log("Storing assessment submission status in local storage as", status);
    // Store user assessment submitted false in local storage
    try {
      await AsyncStorage.setItem('assessmentSubmitted', JSON.stringify(status));
    } catch (e) {
      console.error('Failed to save assessment status', e);
    }
  };

  const setupAssessmentSubmittedLocally = async () => {
    // If it's not in local storage, check if it's stored remotely (the user may have submitted before)
    // If it's stored remotely, store it locally as true
    // If it's not stored remotely, store it locally as false
    try {
      const value = await AsyncStorage.getItem('assessmentSubmitted');
      // If it's in local storage, return
      if (value) {
        console.log("Found assessment submission status in local storage");
        return;
      } else {
        console.log("Did not find assessment status in local storage");
        const remotelySubmitted = await isAssessmentSubmittedRemotely();
        if(remotelySubmitted) {
          console.log("Assessment was remotely submitted");
          await storeAssessmentSubmissionStatusLocally(true); 
          return;
        } else {
          console.log("Assessment was not remotely submitted");
          await storeAssessmentSubmissionStatusLocally(false);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch assessment status from local storage', e);
      return;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        console.log('Auth listener: redirecting to login');
        router.replace('/auth/login');
      } else {
        setupAssessmentSubmittedLocally();
      }
 });

    return () => unsubscribe();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#77CDFF',
          },
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(assessment)/directory"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="(assessment)/section/[name]"
        options={{
          headerTransparent: true,
          title: 'Assessment',
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack>
  );
}
