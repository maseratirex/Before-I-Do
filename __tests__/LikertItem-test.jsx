import { act, fireEvent, render, screen } from '@testing-library/react-native';
import LikertItem from '../components/assessment/LikertItem';
import { useState } from 'react';

const likertLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

// Wrapper for testing rerenders; pass state changes up to LikertItemWrapper, which updates LikertItem props
function LikertItemWrapper( { initialAnswer }) {
    const [answer, setAnswer] = useState(initialAnswer);
    return <LikertItem question="This is a test statement" answer={answer} onAnswerUpdate={setAnswer} />;
}

describe('LikertItem', () => {
    it('renders the question', () => {
        render(<LikertItem question="This is a test statement" answer={1} onAnswerUpdate={() => {}} />);
        expect(screen.getByText('This is a test statement')).toBeTruthy();
    });
    it('defaults to no option as selected', () => {
        render(<LikertItem question="This is a test statement" answer={0} onAnswerUpdate={() => {}} />);
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Neutral pressed')).toBeFalsy();
        expect(screen.queryByTestId('Agree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Strongly Agree pressed')).toBeFalsy();
    });
    it('fills in the correct answer when an answer is given', () => {
        render(<LikertItem question="This is a test statement" answer={1} onAnswerUpdate={() => {}} />);
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeTruthy();
        expect(screen.queryByTestId('Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Neutral pressed')).toBeFalsy();
        expect(screen.queryByTestId('Agree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Strongly Agree pressed')).toBeFalsy();
    });
    it('fills in the correct answer when a button is pressed', async () => {
        const onAnswerUpdate = jest.fn();
        render(<LikertItemWrapper initialAnswer={0} />);
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeFalsy();
        const stronglyDisagreeButton = screen.getByTestId('Strongly Disagree');
        act(() => {
            fireEvent.press(stronglyDisagreeButton);
        });
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeTruthy();
    });
    it('deselects the old answer when a new answer is selected', () => {
        render(<LikertItemWrapper initialAnswer={1} />);
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeTruthy();
        expect(screen.queryByTestId('Neutral pressed')).toBeFalsy();
        const neutralButton = screen.getByTestId('Neutral');
        act(() => {
            fireEvent.press(neutralButton);
        });
        expect(screen.queryByTestId('Strongly Disagree pressed')).toBeFalsy();
        expect(screen.queryByTestId('Neutral pressed')).toBeTruthy();
    });
});
