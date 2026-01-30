import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecipientSelection } from '../RecipientSelection';
import { TextFieldProps } from '@mui/material';

// Mock KioskTextField to avoid KeyboardProvider dependency
jest.mock('../../../KioskTextField', () => {
    return function MockKioskTextField(props: TextFieldProps & { keyboardType?: string }) {
        return (
            <div data-testid="kiosk-text-field">
                <label>{props.label}</label>
                <input
                    value={props.value as string}
                    onChange={props.onChange}
                />
                {props.helperText && <span>{props.helperText}</span>}
            </div>
        );
    };
});

// Mock RecipientSelection Props
const defaultProps = {
    form: {
        fromAccount: '',
        beneficiaryId: '',
        amount: '',
        remarks: '',
        newBeneficiary: { name: '', account: '', confirmAccount: '', ifsc: '' }
    },
    setForm: jest.fn(),
    errors: {},
    isNewBeneficiary: false,
    setIsNewBeneficiary: jest.fn(),
    isDark: false
};

describe('RecipientSelection', () => {
    it('renders account and beneficiary selection by default', () => {
        render(<RecipientSelection {...defaultProps} />);

        expect(screen.getByText('Select Account & Beneficiary')).toBeInTheDocument();
        expect(screen.getByText(/From Account/i)).toBeInTheDocument();
        expect(screen.getByText(/Select Beneficiary/i)).toBeInTheDocument();
        expect(screen.getByText('+ Add New Beneficiary')).toBeInTheDocument();
    });

    it('renders error messages', () => {
        const propsWithError = {
            ...defaultProps,
            errors: { fromAccount: 'Please select an account' }
        };
        render(<RecipientSelection {...propsWithError} />);
        expect(screen.getByText('Please select an account')).toBeInTheDocument();
    });

    it('toggles to new beneficiary mode', () => {
        render(<RecipientSelection {...defaultProps} />);

        fireEvent.click(screen.getByText('+ Add New Beneficiary'));
        expect(defaultProps.setIsNewBeneficiary).toHaveBeenCalledWith(true);
    });

    it('renders new beneficiary form when isNewBeneficiary is true', () => {
        const propsNewBen = { ...defaultProps, isNewBeneficiary: true };
        render(<RecipientSelection {...propsNewBen} />);

        expect(screen.getByText('New Beneficiary Details')).toBeInTheDocument();
        // Our mock uses <label>{label}</label>, so checking text content works
        expect(screen.getByText(/Name/i)).toBeInTheDocument();
        expect(screen.getByText('Account Number')).toBeInTheDocument();
        expect(screen.getByText('Confirm Account')).toBeInTheDocument();
        expect(screen.getByText('IFSC Code')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
});
