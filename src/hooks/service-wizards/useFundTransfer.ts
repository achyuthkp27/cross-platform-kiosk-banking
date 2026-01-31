import { useState } from 'react';
import { fundTransferService, TransferRecipient } from '../../services';

// Mock Data (still used for account selection list)
export const MOCK_ACCOUNTS = [
    { id: '1', number: 'xxxx1234', type: 'Savings', balance: 50000 },
    { id: '2', number: 'xxxx5678', type: 'Current', balance: 125000 },
];

export const MOCK_BENEFICIARIES = [
    { id: '1', name: 'Alice Smith', account: '9876543210', ifsc: 'HDFC0001234' },
    { id: '2', name: 'Bob Jones', account: '1122334455', ifsc: 'SBIN0006789' },
];

export interface FormState {
    fromAccount: string;
    beneficiaryId: string;
    amount: string;
    remarks: string;
    newBeneficiary: { name: string; account: string; confirmAccount: string; ifsc: string };
}

export const useFundTransfer = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>({
        fromAccount: '',
        beneficiaryId: '',
        amount: '',
        remarks: '',
        newBeneficiary: { name: '', account: '', confirmAccount: '', ifsc: '' }
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isNewBeneficiary, setIsNewBeneficiary] = useState(false);
    const [mockRefNo, setMockRefNo] = useState('');

    const validateStep1 = async () => {
        const newErrors: Record<string, string> = {};
        if (!form.fromAccount) newErrors.fromAccount = 'Please select an account';

        if (isNewBeneficiary) {
            if (!form.newBeneficiary.name) newErrors.name = 'Name is required';
            if (!form.newBeneficiary.account) newErrors.account = 'Account Number is required';
            if (form.newBeneficiary.account !== form.newBeneficiary.confirmAccount) {
                newErrors.confirmAccount = 'Account numbers do not match';
            }
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.newBeneficiary.ifsc)) {
                newErrors.ifsc = 'Invalid IFSC Code (e.g., HDFC0001234)';
            }

            // Server-side validation for new beneficiary
            if (Object.keys(newErrors).length === 0) {
                setLoading(true);
                try {
                    const response = await fundTransferService.validateRecipient(
                        form.newBeneficiary.account,
                        form.newBeneficiary.ifsc
                    );

                    if (response.success && response.data && response.data.valid) {
                        const { name } = response.data;
                        // Optional: Update name if server provides verified name
                        if (name && name !== 'Verified User') {
                            setForm(prev => ({
                                ...prev,
                                newBeneficiary: { ...prev.newBeneficiary, name }
                            }));
                        }
                    } else {
                        newErrors.account = 'Invalid Account/IFSC';
                    }
                } catch (e) {
                    newErrors.root = 'External validation failed';
                } finally {
                    setLoading(false);
                }
            }
        } else {
            if (!form.beneficiaryId) newErrors.beneficiaryId = 'Please select a beneficiary';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        const amount = Number(form.amount);
        const selectedAccount = MOCK_ACCOUNTS.find(a => a.id === form.fromAccount);

        if (!form.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        } else if (selectedAccount && amount > selectedAccount.balance) {
            newErrors.amount = 'Insufficient Funds';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        let valid = false;
        if (step === 1) valid = await validateStep1();
        else if (step === 2) valid = validateStep2();

        // Step 3 is Summary/Confirm, triggering actual transfer handled separately usually,
        // or if handleNext triggers submission on step 3. 
        // Assuming current logic just moves steps.

        if (valid) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    // New function to process final transfer
    const submitTransfer = async () => {
        setLoading(true);
        try {
            const recipient: TransferRecipient = isNewBeneficiary
                ? {
                    name: form.newBeneficiary.name,
                    accountNumber: form.newBeneficiary.account,
                    ifsc: form.newBeneficiary.ifsc
                }
                : {
                    name: MOCK_BENEFICIARIES.find(b => b.id === form.beneficiaryId)?.name || 'Unknown',
                    accountNumber: MOCK_BENEFICIARIES.find(b => b.id === form.beneficiaryId)?.account || '',
                    ifsc: MOCK_BENEFICIARIES.find(b => b.id === form.beneficiaryId)?.ifsc || ''
                };

            const response = await fundTransferService.processTransfer(recipient, Number(form.amount), form.fromAccount);
            if (response.success && response.data) {
                setMockRefNo(response.data.txnId);
                setStep(4); // Success step
            } else {
                 throw new Error(response.message || 'Transfer failed');
            }
        } catch (e) {
            setErrors({ root: 'Transfer failed. Check connection.' });
        } finally {
            setLoading(false);
        }
    };

    const getBeneficiaryDetails = () => {
        if (isNewBeneficiary) return `${form.newBeneficiary.name} (${form.newBeneficiary.account})`;
        const ben = MOCK_BENEFICIARIES.find(b => b.id === form.beneficiaryId);
        return ben ? `${ben.name} (${ben.account})` : '';
    };

    return {
        step,
        setStep,
        loading,
        setLoading,
        form,
        setForm,
        errors,
        isNewBeneficiary,
        setIsNewBeneficiary,
        mockRefNo,
        setMockRefNo,
        handleNext,
        handleBack,
        submitTransfer, // Exported new function
        getBeneficiaryDetails
    };
};
