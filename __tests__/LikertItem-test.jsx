import { render, screen } from '@testing-library/react-native';
import LikertItem from '../components/assessment/LikertItem';

const likertLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockReturnValue(JSON.stringify({
        'test-user-id-cultural': [1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 5, 4, 3 ]
    })),
}));

describe('LikertItem', () => {
    it('renders the question', () => {
        render(<LikertItem question="This is a test statement" answer={1} onAnswerUpdate={() => {}} />);
        expect(screen.getByText('This is a test statement')).toBeTruthy();
    });
    it('defaults to no option as selected', () => {
        render(<LikertItem question="This is a test statement" answer={0} onAnswerUpdate={() => {}} />);
        expect(screen.getByTestId('pressedButton')).toBeFalsy();
    });
    it('fills in the correct answer when an answer is given', () => {
        render(<LikertItem question="This is a test statement" answer={1} onAnswerUpdate={() => {}} />);
        expect(screen.getByTestId('pressedButton')).toBeFalsy();
    });
    it('fills in the correct answer when a button is pressed', () => {
        const onAnswerUpdate = jest.fn();
        render(<LikertItem question="This is a test statement" answer={0} onAnswerUpdate={onAnswerUpdate} />);
        const button1 = screen.getByTestId('button1');
        expect(button1.props.isPressed).toBe(false);
        fireEvent.press(button1);
        // Wait for the button to be pressed
        expect(onAnswerUpdate).toHaveBeenCalledOnce();
        expect(button1.props.isPressed).toBe(true);
    });
    it('deselects the old answer when a new answer is selected', () => {
        render(<LikertItem question="This is a test statement" answer={0} onAnswerUpdate={() => {}} />);
        expect(screen.getByTestId('pressedButton')).toBeFalsy();
    });
});
