import { render, screen } from '@testing-library/react-native';
import EntryScreen from '../app/auth/entry';

describe('EntryScreen', () => {
    it('renders all text', () => {
        render(<EntryScreen />);
        expect(screen.getByText('Before I Do')).toBeTruthy();
        expect(screen.getByText('Scientific assessment, relationship report, and targeted resources for you and your partner!')).toBeTruthy();
        expect(screen.getByText("Let's get started")).toBeTruthy();
        expect(screen.getByText('Already have an account?')).toBeTruthy();
        expect(screen.getByText('Sign In')).toBeTruthy();
    });
});
