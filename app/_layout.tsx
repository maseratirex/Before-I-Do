import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import createLogger from "@/utilities/logger";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const logger = createLogger('RootLayout');
  const router = useRouter();
  const [isUserNotFirstTime, setIsUserNotFirstTime] = useState(true);

  const isAssessmentSubmittedRemotely = async () => {
    // Returns true if user has submitted assessment answers remotely and false otherwise
    logger.info("Checking user assessment completion status in Firestore");
    const user = auth.currentUser;
    if(user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.coupleDynamics !== null && data.cultureDynamics !== null && data.familyDynamics !== null && data.personalityDynamics !== null;
      } else {
        logger.warn("Could not find user assessment completion status in Firestore");
        return false;
      }
    }
  };

  const storeAssessmentSubmissionStatusLocally = async (user, status: boolean) => {
    logger.info("Storing assessment submission status in local storage as", status);
    // Store user assessment submitted false in local storage
    try {
      const submittedStorageKey = user.uid + 'assessment-submitted'
      await AsyncStorage.setItem(submittedStorageKey, JSON.stringify(status));
    } catch (e) {
      logger.error('Failed to save assessment status', e);
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
        logger.info("Assessment is submitted");
      } else if (assessmentSubmittedResponse === 'false') {
        logger.info("Assessment is not submitted");
      } else {
        logger.info("Did not find assessment status in local storage, response was ", assessmentSubmittedResponse);
        const remotelySubmitted = await isAssessmentSubmittedRemotely();
        if(remotelySubmitted) {
          logger.info("Assessment was remotely submitted");
          await storeAssessmentSubmissionStatusLocally(user, true); 
        } else {
          logger.info("Assessment was not remotely submitted");
          await storeAssessmentSubmissionStatusLocally(user, false);
        }
      }
    } catch (e) {
      logger.error('Failed to fetch assessment status from local storage', e);
    }
  };

  const checkFirstTimeUser = async () => {
    // Returns true if user has submitted assessment answers remotely and false otherwise
    logger.info("Checking if first time user");
    const notFirstTimeUserResponse = await AsyncStorage.getItem('notFirstTimeUser');
    const notFirstTime = notFirstTimeUserResponse === 'true'; // Convert string | null to boolean
    if (notFirstTime) {
      setIsUserNotFirstTime(true);
      logger.info('Not first time user');
    } else {
      logger.info('First time user');
      router.replace('/auth/entry');
    }
  };

  useEffect(() => {
    // Runs on mount
    checkFirstTimeUser();
  }, []); // Add this empty dependency array to prevent infinite re-renders

  useEffect(() => {
    logger.debug("Setting up auth listener");
    // Runs on mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        if(isUserNotFirstTime) {
          logger.info('AuthListener: Redirecting to login screen');
          router.replace('/auth/login');
        } else {
          logger.info('AuthListener: Redirecting to entry screen');
          router.replace('/auth/entry');
        }
      } else {
        // TODO Move this to the login screen on successful login
        setupAssessmentSubmittedLocally(user);
      }
    });

    return () => unsubscribe();
  }, [isUserNotFirstTime]); // Depends on isUserNotFirstTime
  
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
      <Stack.Screen
        name="resources"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack>
  );
}
