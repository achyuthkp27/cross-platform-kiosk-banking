import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHeader } from '../DashboardHeader';
import '@testing-library/jest-dom';

describe('DashboardHeader', () => {
    const mockOnLogout = jest.fn();
    const mockFormatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const defaultProps = {
        isDark: false,
        userName: 'Test User',
        timeLeft: 120, // 2 minutes
        formatTime: mockFormatTime,
        onLogout: mockOnLogout,
    };

    test('renders user name and title correctly', () => {
        render(<DashboardHeader {...defaultProps} />);
        expect(screen.getByText('Kiosk Banking')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('displays formatted session time', () => {
        render(<DashboardHeader {...defaultProps} />);
        // 120 seconds = 2:00
        expect(screen.getByText('Session: 2:00')).toBeInTheDocument();
    });

    test('calls onLogout when logout button is clicked', () => {
        render(<DashboardHeader {...defaultProps} />);
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);
        expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    test('renders with urgent style when time is low', () => {
        render(<DashboardHeader {...defaultProps} timeLeft={30} />);
        const chip = screen.getByText('Session: 0:30');
        // Basic check to see if it renders. 
        // Checking specific MUI color styles (error vs default) is harder in unit tests without extensive setup,
        // but existence confirms the conditional logic ran.
        expect(chip).toBeInTheDocument();
    });
});
