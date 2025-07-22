import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { fireEvent, act } from '@testing-library/react-native';
import QuestionnaireScreen from '../app/(assessment)/section/[name]';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    getItem: jest.fn((key) => {
        if (key === 'answers-test-user-id-cultural') {
            return Promise.resolve(JSON.stringify({
                "Spiritual Beliefs": [1, 2, 2, 2, 2, 2, 2, 2],
                "Lifestyle": [2, 2, 2, 2, 2, 2, 2, 2, 2],
                "Traditions": [2, 2, 2, 2, 2],
                "Marriage Preparations": [2, 2, 2, 2, 2, 5]
            }));
        }
        return Promise.resolve(null);
    }),
    setItem: jest.fn(() => Promise.resolve())
}));

// Separately, AsyncStorage is mocked in the setupTests.js file, which package.json is configured to run before the tests.

describe('QuestionnaireScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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

        // Should start with no answers selected and 0% progress
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Neutral pressed')).toBeFalsy();
        expect(screen.queryByTestId('Agree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Strongly Agree pressed')).toBeFalsy();
        expect(screen.getByText('0%')).toBeTruthy();
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

        expect(screen.queryAllByTestId("Strongly Disagree pressed")).toHaveLength(1);
        expect(screen.queryAllByTestId("Strongly Agree pressed")).toHaveLength(1);

        // Completed section should show 100% progress and Complete button
        expect(screen.getByText('100%')).toBeTruthy();
        expect(screen.getByText('Complete')).toBeTruthy();
    });

    it('resumes started but unfinished personality section with saved answers', async () => {
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        const partialAnswers = {
            "Emotional Stability": [1, 0, 0, 0, 0, 0, 0],
            "Empathy": [2, 0, 0, 0, 0, 0, 0],
            "Openness to Experience": [3, 0, 0, 0, 0, 0],
            "Self-Confidence": [4, 0, 0, 0],
            "Secure Attachment": [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        AsyncStorage.getItem.mockImplementationOnce((key) => {
            if (key === 'answers-test-user-id-personality') {
                return Promise.resolve(JSON.stringify(partialAnswers));
            }
            return Promise.resolve(null);
        });

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

        // Progress should reflect 5 answered out of 35 questions => ~14%
        expect(screen.getByText('14%')).toBeTruthy();
        // Should NOT show complete button yet
        expect(screen.queryByText('Complete')).toBeNull();
        // Previously saved answers should be visible (at least one answer pressed)
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeTruthy();
    });

    it('updates answers on screen and saves progress', async () => {
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

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

        // Initially 0% progress
        expect(screen.getByText('0%')).toBeTruthy();

        const neutralButton = screen.getAllByTestId('Neutral')[0];

        await act(async () => {
            fireEvent.press(neutralButton);
        });

        // Progress should now be > 0
        expect(screen.queryByText('0%')).toBeNull();
        // One Neutral pressed indicator should be present
        expect(screen.queryAllByTestId('Neutral pressed')).toHaveLength(1);

        // Answer update should trigger save to AsyncStorage
        expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('pressing Complete navigates back and does not appear before 100% complete', async () => {
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        const mockBack = jest.fn();
        useRouter.mockReturnValue({ back: mockBack });

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

        const completeButton = screen.getByText('Complete');
        expect(completeButton).toBeTruthy();

        await act(async () => {
            fireEvent.press(completeButton);
        });

        expect(mockBack).toHaveBeenCalled();
    });
});
