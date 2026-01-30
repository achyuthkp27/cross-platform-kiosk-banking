import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import ActionButtons from '../ActionButtons';

// Test theme
const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <MuiThemeProvider theme={theme}>
            {ui}
        </MuiThemeProvider>
    );
};

// Mock ThemeContext
jest.mock('../../context/ThemeContext', () => ({
    useThemeContext: () => ({
        mode: 'light',
        toggleTheme: jest.fn(),
    }),
}));

describe('ActionButtons', () => {
    const mockOnPrimary = jest.fn();
    const mockOnSecondary = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders primary button with correct text', () => {
        renderWithTheme(
            <ActionButtons onPrimary={mockOnPrimary} primaryText="Submit" />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders secondary button when onSecondary is provided', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                onSecondary={mockOnSecondary}
                primaryText="Submit"
                secondaryText="Cancel"
            />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('calls onPrimary when primary button is clicked', () => {
        renderWithTheme(
            <ActionButtons onPrimary={mockOnPrimary} primaryText="Submit" />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(mockOnPrimary).toHaveBeenCalledTimes(1);
    });

    it('calls onSecondary when secondary button is clicked', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                onSecondary={mockOnSecondary}
                primaryText="Submit"
                secondaryText="Cancel"
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(mockOnSecondary).toHaveBeenCalledTimes(1);
    });

    it('disables primary button when primaryDisabled is true', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                primaryText="Submit"
                primaryDisabled={true}
            />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('disables buttons when loading is true', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                onSecondary={mockOnSecondary}
                primaryText="Submit"
                secondaryText="Cancel"
                loading={true}
            />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });

    it('has correct aria-busy attribute when loading', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                primaryText="Submit"
                loading={true}
            />
        );

        expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('aria-busy', 'true');
    });

    it('removes animation wrappers from tab order', () => {
        renderWithTheme(
            <ActionButtons
                onPrimary={mockOnPrimary}
                onSecondary={mockOnSecondary}
                primaryText="Submit"
                secondaryText="Cancel"
            />
        );

        const primaryButton = screen.getByRole('button', { name: 'Submit' });
        const secondaryButton = screen.getByRole('button', { name: 'Cancel' });

        // The parent of the button is the motion.div
        expect(primaryButton.parentElement).toHaveAttribute('tabIndex', '-1');
        expect(secondaryButton.parentElement).toHaveAttribute('tabIndex', '-1');
    });
});
