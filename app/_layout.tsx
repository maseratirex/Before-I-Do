import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


export default function RootLayout() {
  const router = useRouter();
  const [isUserNotFirstTime, setIsUserNotFirstTime] = useState(false);

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

  const storeAssessmentSubmissionStatusLocally = async (user, status: boolean) => {
    console.log("Storing assessment submission status in local storage as", status);
    // Store user assessment submitted false in local storage
    try {
      const submittedStorageKey = user.uid + 'assessment-submitted'
      await AsyncStorage.setItem(submittedStorageKey, JSON.stringify(status));
    } catch (e) {
      console.error('Failed to save assessment status', e);
    }
  };

  const setupAssessmentSubmittedLocally = async (user) => {
    // Setup assessmentSubmitted boolean in AsyncStorage
    // If it's not in local storage, check if it's stored remotely (the user may have submitted before)
    // If it's stored remotely, store it locally as true
    // If it's not stored remotely, store it locally as false
    try {
      const submittedStorageKey = user.uid + 'assessment-submitted'
      const assessmentSubmittedResponse = await AsyncStorage.getItem(submittedStorageKey);
      // If it's in local storage, return
      if (assessmentSubmittedResponse === 'true') {
        console.log("Found assessment submission status in local storage");
      } else {
        console.log("Did not find assessment status in local storage");
        const remotelySubmitted = await isAssessmentSubmittedRemotely();
        if(remotelySubmitted) {
          console.log("Assessment was remotely submitted");
          await storeAssessmentSubmissionStatusLocally(user, true); 
        } else {
          console.log("Assessment was not remotely submitted");
          await storeAssessmentSubmissionStatusLocally(user, false);
        }
      }
    } catch (e) {
      console.error('Failed to fetch assessment status from local storage', e);
    }
  };

  useEffect(() => {
    // Runs on mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isUserNotFirstTime) {
        // User's first time, send them to entry screen
        console.log('Sending user to entry screen');
        router.replace('/auth/entry');
      } else if (!user || !user.emailVerified) {
        console.log('Auth listener: redirecting to login');
        router.replace('/auth/login');
      } else {
        setupAssessmentSubmittedLocally(user);
      }
    });

    return () => unsubscribe();
  }, [isUserNotFirstTime]); // Depends on isUserNotFirstTime
  
  const checkFirstTimeUser = async () => {
    // Returns true if user has submitted assessment answers remotely and false otherwise
    console.log("Checking if first time user");
    const notFirstTimeUserResponse = await AsyncStorage.getItem('notFirstTimeUser');
    const notFirstTime = notFirstTimeUserResponse === 'true'; // Convert string | null to boolean
    if (notFirstTime) {
      setIsUserNotFirstTime(true);
      console.log('Not first time user');
    } else {
      console.log('First time user');
      router.replace('/auth/entry');
    }
  };

  useEffect(() => {
    // Runs on mount
    checkFirstTimeUser();
  });

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
