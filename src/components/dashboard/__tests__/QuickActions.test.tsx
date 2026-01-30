import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickActions } from '../QuickActions';
import '@testing-library/jest-dom';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => <div {...props}>{children}</div>,
    },
}));

describe('QuickActions', () => {
    const mockOnNavigate = jest.fn();

    const mockMenuItems = [
        { id: 1, title: 'Item 1', path: '/item-1', color: '#000', icon: HomeIcon },
        { id: 2, title: 'Item 2', path: '/item-2', color: '#000', icon: SettingsIcon },
    ];

    const defaultProps = {
        menuItems: mockMenuItems,
        onNavigate: mockOnNavigate,
        isDark: false,
        itemVariants: {},
    };

    test('renders quick actions section title', () => {
        render(<QuickActions {...defaultProps} />);
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    test('renders all menu items', () => {
        render(<QuickActions {...defaultProps} />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getAllByTestId('mock-icon')).toHaveLength(2);
    });

    test('calls onNavigate when an item is clicked', () => {
        render(<QuickActions {...defaultProps} />);
        const item = screen.getByText('Item 1');
        fireEvent.click(item);
        expect(mockOnNavigate).toHaveBeenCalledWith('/item-1');
        expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });
});
