import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import createLogger from '@/utilities/logger';
import * as SplashScreen from 'expo-splash-screen';
import { InteractionManager } from 'react-native';

export default function EntryScreen() {
  const logger = createLogger('EntryScreen');

  const router = useRouter();
  const [hasLaidOut, setHasLaidOut] = useState(false);

  const onLayoutRootView = useCallback(() => {
    setHasLaidOut(true);
  }, []);

  useEffect(() => {
    if (!hasLaidOut) return;
  
    // Wait for all interactions first
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      logger.info('Hiding splash screen in 1 s');
  
      const timer = setTimeout(async () => {
        logger.info('Actually hiding splash screen');
        SplashScreen.hide();
      }, 1000);
  
      // clean-up the timer if the component unmounts early
      return () => clearTimeout(timer);
    });
  
    // clean-up the InteractionManager handle
    return () => interactionHandle.cancel();
  }, [hasLaidOut]);

  const setUserNotFirstimeLocally = async () => {
    logger.info("Setting not first time status in local storage");
    try {
      await AsyncStorage.setItem('notFirstTimeUser', JSON.stringify(true));
    } catch (e) {
      logger.error('Failed to save not first time user status', e);
    }
  };

  return (
    <LinearGradient onLayout={onLayoutRootView} colors={['#FFE4EB', '#FFC6D5']} style={styles.root}>
      <View style={styles.container}>
        <View style={styles.titleAndButtonsContainer}>
          <Text style={styles.appTitle}>Before I Do</Text>
          <Text style={styles.appDescription}>Scientific assessment, relationship report, and targeted resources for you and your partner!</Text>
        </View>
        <View style={styles.actionAreaContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            setUserNotFirstimeLocally();
            router.push('./createAccount')
          }}>
            <Text style={styles.buttonText}>Let's get started</Text>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => {
              setUserNotFirstimeLocally();
              router.push('./login')
            }}>
              <Text style={[styles.buttonText, styles.blueText]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1, // Occupy the entire screen vertically and horizontally.
    // ScrollView requires a bounded height; flex: 1 informs the LinearGradient's child
    // that the height is the entire screen
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titleAndButtonsContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  appTitle: {
    marginTop: 170,
    fontSize: 56,
    fontWeight: 'bold',
  },
  appDescription: {
    width: '60%',
    color: '#4A4A4A',
    fontSize: 20,
    textAlign: 'center',
  },
  actionAreaContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 80,
  },
  button: {
    width: '83%',
    paddingVertical: 16,
    paddingHorizontal: 32,
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
  infoText: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  blueText: {
    color: '#007AFF',
  },
  textContainer: {
    flexDirection: 'row',
    gap: 12,
  }
});