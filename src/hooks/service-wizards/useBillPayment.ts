import { useState } from 'react';

// Mock Data
export const BILLERS = {
    electricity: ['Adani Electricity', 'Tata Power', 'BESCOM'],
    water: ['BWSSB', 'Delhi Jal Board'],
    mobile: ['Jio Postpaid', 'Airtel Postpaid', 'Vi Postpaid'],
    internet: ['ACT Fibernet', 'JioFiber', 'Airtel Xstream'],
    gas: ['MGL', 'IGL'],
};

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
    const [biller, setBiller] = useState('');
    const [consumerNo, setConsumerNo] = useState('');
    const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
    const [error, setError] = useState('');
    const [mockTxnId, setMockTxnId] = useState('');

    const handleCategorySelect = (catId: string) => {
        setCategory(catId);
        setStep(2);
    };

    const fetchBill = () => {
        if (!biller || !consumerNo) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setBillDetails({
                amount: Math.floor(Math.random() * 5000) + 500,
                dueDate: '15/02/2026',
                name: 'John Doe',
                billNo: `B-${Date.now()}`
            });
            setStep(3);
        }, 1500);
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
        biller,
        setBiller,
        consumerNo,
        setConsumerNo,
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
