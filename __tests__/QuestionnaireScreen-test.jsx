import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import QuestionnaireScreen from '../app/(assessment)/section/[name]';
import { useLocalSearchParams } from 'expo-router';
import { questionnaire } from '../components/questionnaire';

// getAuth() and getFirestore() are called inside the screens, so we need to mock them.
// We don't need to mock signInWithEmailAndPassword() because it's not called when navigating from the EntryScreen to LoginScreen.
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn().mockReturnValue({
        currentUser: {
            uid: 'test-user-id'
        }
    }),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
}));

jest.mock('expo-router');

jest.mock('@react-navigation/elements', () => ({
    useHeaderHeight: jest.fn().mockReturnValue(50),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockReturnValue(JSON.stringify({
        'test-user-id-cultural': [1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 5, 4, 3 ]
    })),
}));

// Separately, AsyncStorage is mocked in the setupTests.js file, which package.json is configured to run before the tests.


describe('QuestionnaireScreen', () => {
    it('renders first and last questions for unstarted personality section', async () => {
        useLocalSearchParams.mockReturnValue({ name: 'personality' });
        renderRouter(
            {
                'questionnaire': () => <QuestionnaireScreen />,
            },
            {
                initialUrl: 'questionnaire'
            }
        );
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        const personalityQuestions = Object.values(questionnaire.personality).flat();

        expect(screen.getByText(personalityQuestions[0])).toBeTruthy();
        expect(screen.getByText(personalityQuestions[personalityQuestions.length - 1])).toBeTruthy();
        // TODO check correct circles filled in
    });
    it('loads first and last culture answers for finished culture section', async () => {
        useLocalSearchParams.mockReturnValue({ name: 'cultural' });
        renderRouter(
            {
                'questionnaire': () => <QuestionnaireScreen />,
            },
            {
                initialUrl: 'questionnaire'
            }
        );
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        // TODO check correct circles filled in
        const culturalQuestions = Object.values(questionnaire.cultural).flat();

        expect(screen.getByText(culturalQuestions[0])).toBeTruthy();
        expect(screen.getByText(culturalQuestions[culturalQuestions.length - 1])).toBeTruthy();
    });

});
