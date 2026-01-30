import { renderHook, act } from '@testing-library/react';
import { useFundTransfer } from '../useFundTransfer';

describe('useFundTransfer', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useFundTransfer());

        expect(result.current.step).toBe(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.form.fromAccount).toBe('');
    });

    it('should validate step 1 correctly (error)', () => {
        const { result } = renderHook(() => useFundTransfer());

        act(() => {
            result.current.handleNext();
        });

        // Should stay on step 1 and have errors
        expect(result.current.step).toBe(1);
        expect(result.current.errors.fromAccount).toBe('Please select an account');
    });

    it('should validate step 1 correctly (success)', () => {
        const { result } = renderHook(() => useFundTransfer());

        act(() => {
            result.current.setForm({
                ...result.current.form,
                fromAccount: '1',
                beneficiaryId: '1'
            });
        });

        act(() => {
            result.current.handleNext();
        });

        expect(result.current.step).toBe(2);
        expect(result.current.errors).toEqual({});
    });

    it('should validate step 2 correctly (insufficient funds)', () => {
        const { result } = renderHook(() => useFundTransfer());

        // Setup Step 1
        act(() => {
            result.current.setForm({
                ...result.current.form,
                fromAccount: '1', // Balance 50000
                beneficiaryId: '1',
                amount: '60000'
            });
            result.current.setStep(2);
        });

        // Try Next
        act(() => {
            result.current.handleNext();
        });

        expect(result.current.step).toBe(2);
        expect(result.current.errors.amount).toBe('Insufficient Funds');
    });

    it('should handle back navigation', () => {
        const { result } = renderHook(() => useFundTransfer());

        act(() => {
            result.current.setStep(2);
        });

        act(() => {
            result.current.handleBack();
        });

        expect(result.current.step).toBe(1);
    });
});
