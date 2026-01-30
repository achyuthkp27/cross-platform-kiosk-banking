import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountSummary } from '../AccountSummary';
import '@testing-library/jest-dom';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    },
}));

describe('AccountSummary', () => {
    const mockAccounts = [
        { id: 1, type: 'Savings', number: 'xxxx1234', balance: 5000, color: '#000' },
        { id: 2, type: 'Current', number: 'xxxx5678', balance: 10000, color: '#000' },
    ];

    const defaultProps = {
        accounts: mockAccounts,
        totalBalance: 15000,
        isDark: false,
        itemVariants: {},
    };

    test('renders account summary title', () => {
        render(<AccountSummary {...defaultProps} />);
        expect(screen.getByText('Account Summary')).toBeInTheDocument();
    });

    test('displays total balance correctly', () => {
        render(<AccountSummary {...defaultProps} />);
        expect(screen.getByText('Total Balance')).toBeInTheDocument();
        expect(screen.getByText('$15,000')).toBeInTheDocument();
    });

    test('renders individual account cards', () => {
        render(<AccountSummary {...defaultProps} />);

        // Savings Account
        expect(screen.getByText(/Savings/i)).toBeInTheDocument();
        expect(screen.getByText(/xxxx1234/)).toBeInTheDocument();
        expect(screen.getByText('$5,000')).toBeInTheDocument();

        // Current Account
        expect(screen.getByText(/Current/i)).toBeInTheDocument();
        expect(screen.getByText(/xxxx5678/)).toBeInTheDocument();
        expect(screen.getByText('$10,000')).toBeInTheDocument();
    });
});
