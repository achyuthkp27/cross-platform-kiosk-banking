import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategorySelection } from '../CategorySelection';

describe('CategorySelection', () => {
    const mockHandleSelect = jest.fn();
    const mockOnCancel = jest.fn();

    it('renders all categories', () => {
        render(<CategorySelection handleCategorySelect={mockHandleSelect} onCancel={mockOnCancel} isDark={false} />);

        expect(screen.getByText('Select Category')).toBeInTheDocument();
        expect(screen.getByText('Electricity')).toBeInTheDocument();
        expect(screen.getByText('Water')).toBeInTheDocument();
        expect(screen.getByText('Mobile')).toBeInTheDocument();
        expect(screen.getByText('Internet')).toBeInTheDocument();
        expect(screen.getByText('Gas')).toBeInTheDocument();
    });

    it('calls handler when category is clicked', () => {
        render(<CategorySelection handleCategorySelect={mockHandleSelect} onCancel={mockOnCancel} isDark={false} />);

        fireEvent.click(screen.getByText('Electricity'));
        expect(mockHandleSelect).toHaveBeenCalledWith('electricity');
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<CategorySelection handleCategorySelect={mockHandleSelect} onCancel={mockOnCancel} isDark={false} />);

        fireEvent.click(screen.getByText('Cancel'));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
