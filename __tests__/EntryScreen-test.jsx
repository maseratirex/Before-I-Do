import { render, userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import EntryScreen from '../app/auth/entry';
import LoginScreen from '../app/auth/login';
import CreateAccountScreen from '../app/auth/createAccount';

// getAuth() and getFirestore() are called inside the screens, so we need to mock them.
// We don't need to mock signInWithEmailAndPassword() because it's not called when navigating from the EntryScreen to LoginScreen.
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
}));

// Separately, AsyncStorage is mocked in the setupTests.js file, which package.json is configured to run before the tests.

describe('EntryScreen', () => {
    it('renders all text', () => {
        render(<EntryScreen />);
        expect(screen.getByText('Before I Do')).toBeTruthy();
        expect(screen.getByText('Scientific assessment, relationship report, and targeted resources for you and your partner!')).toBeTruthy();
        expect(screen.getByText("Let's get started")).toBeTruthy();
        expect(screen.getByText('Already have an account?')).toBeTruthy();
        expect(screen.getByText('Sign In')).toBeTruthy();
    });
    it('navigates to login screen if login button is pressed', async () => {
        renderRouter(
            {
                'entry': () => <EntryScreen />,
                'login': () => <LoginScreen />,
            },
            {
                initialUrl: 'entry'
            }
        );
        const userEventInstance = userEvent.setup();
        const signInButton = screen.getByText("Sign In");
        await userEventInstance.press(signInButton);
        expect(screen).toHavePathname('/login');
        // More importantly, does the user see the correct screen?
        expect(screen.getByText('Login')).toBeTruthy();
    });
    it('navigates to creat account screen if create account button is pressed', async () => {
        renderRouter(
            {
                'entry': () => <EntryScreen />,
                'createAccount': () => <CreateAccountScreen />,
            },
            {
                initialUrl: 'entry'
            }
        );
        const userEventInstance = userEvent.setup();
        const createAccountButton = screen.getByText("Let's get started");
        await userEventInstance.press(createAccountButton);
        expect(screen).toHavePathname('/createAccount');
        // More importantly, does the user see the correct screen?
        expect(screen.getByText('Create Account')).toBeTruthy();
    });
});
