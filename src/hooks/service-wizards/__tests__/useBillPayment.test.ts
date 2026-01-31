import { renderHook, act } from '@testing-library/react';
import { useBillPayment } from '../useBillPayment';

jest.useFakeTimers();

describe('useBillPayment', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useBillPayment());

        expect(result.current.step).toBe(1);
        expect(result.current.category).toBe('');
        expect(result.current.billDetails).toBeNull();
    });

    it('should handle category selection', () => {
        const { result } = renderHook(() => useBillPayment());

        act(() => {
            result.current.handleCategorySelect('electricity');
        });

        expect(result.current.category).toBe('electricity');
        expect(result.current.step).toBe(2);
    });

    it('should validate inputs before fetching bill', () => {
        const { result } = renderHook(() => useBillPayment());

        act(() => {
            result.current.fetchBill();
        });

        expect(result.current.error).toBe('Please fill in all fields');
    });

    it('should fetch bill successfully', async () => {
        const { result } = renderHook(() => useBillPayment());

        // Setup inputs
        act(() => {
            result.current.setBiller('Adani Electricity');
            result.current.setConsumerNo('123456789');
        });

        // Trigger fetch and capture promise
        let promise: Promise<void>;
        act(() => {
            promise = result.current.fetchBill();
        });

        expect(result.current.loading).toBe(true);

        // Fast-forward timers and await promise resolution
        await act(async () => {
            jest.runAllTimers();
            await promise;
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.billDetails).not.toBeNull();
        expect(result.current.billDetails!.name).toBe('John Doe');
        expect(result.current.step).toBe(3);
    });
});
