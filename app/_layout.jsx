import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import createLogger from "@/utilities/logger";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const logger = createLogger('RootLayout');
  const router = useRouter();
  const [isUserNotFirstTime, setIsUserNotFirstTime] = useState(true);

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
