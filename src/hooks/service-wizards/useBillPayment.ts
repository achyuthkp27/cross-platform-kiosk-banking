import { useState } from 'react';
import { billPaymentService } from '../../services';

export interface BillDetails {
    amount: number;
    dueDate: string;
    name: string;
    billNo: string;
}

export const useBillPayment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [billers, setBillers] = useState<string[]>([]);
    const [biller, setBiller] = useState('');
    const [consumerNo, setConsumerNo] = useState('');
    const [fromAccount, setFromAccount] = useState('');
    const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
    const [error, setError] = useState('');
    const [mockTxnId, setMockTxnId] = useState('');

    const handleCategorySelect = async (catId: string) => {
        setCategory(catId);
        setLoading(true);
        setError('');
        try {
            const response = await billPaymentService.getBillers(catId);
            if (response.success && response.data) {
                setBillers(response.data);
                setStep(2);
            } else {
                setError(response.message || 'Failed to fetch billers');
            }
        } catch (e: any) {
            setError(e.message || 'Failed to fetch billers');
        } finally {
            setLoading(false);
        }
    };

    const fetchBill = async () => {
        if (!biller || !consumerNo) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await billPaymentService.fetchBill(biller, consumerNo);
            if (response.success && response.data) {
                setBillDetails(response.data);
                setStep(3);
            } else {
                setError(response.message || 'Failed to fetch bill');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bill');
        } finally {
            setLoading(false);
        }
    };

    const resetBillDetails = () => {
        setBillDetails(null);
        setStep(1);
    }

    return {
        step,
        setStep,
        loading,
        setLoading,
        category,
        setCategory,
        handleCategorySelect,
        billers, 
        biller,
        setBiller,
        consumerNo,
        setConsumerNo,
        fromAccount,
        setFromAccount,
        billDetails,
        setBillDetails,
        error,
        setError,
        mockTxnId,
        setMockTxnId,
        fetchBill,
        resetBillDetails
    };
};
