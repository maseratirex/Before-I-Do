import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index'; // update path as needed
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

// Mock useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

const mockReplace = jest.fn();

describe('HomeScreen - auth state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('redirects to login if user is not authenticated', async () => {
    // Simulate onAuthStateChanged calling back with null user
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null); // simulates sign-out
      return jest.fn(); // mock unsubscribe function
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });
  });
});