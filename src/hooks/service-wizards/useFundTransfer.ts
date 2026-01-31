import { useState, useEffect } from 'react';
import { fundTransferService, accountService, TransferRecipient } from '../../services';
import { Account } from '../../types/services';

// Beneficiaries - fetched from API if available, or empty for new transfers
export interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    ifsc: string;
}

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
    const [addBeneficiaryStep, setAddBeneficiaryStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: Confirm, 3: Success
    const [mockRefNo, setMockRefNo] = useState('');
    const [idempotencyKey, setIdempotencyKey] = useState('');
    
    // REAL DATA from API
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch accounts and beneficiaries on mount
    useEffect(() => {
        const fetchData = async () => {
            setDataLoading(true);
            try {
                const userId = sessionStorage.getItem('kiosk_userId');
                if (!userId) {
                    console.warn('[FundTransfer] No user ID found');
                    return;
                }

                // Fetch user's accounts
                const accResponse = await accountService.getAccounts(userId);
                if (accResponse.success && accResponse.data) {
                    setAccounts(accResponse.data);
                }

                // Fetch saved beneficiaries (if API exists, otherwise use empty)
                try {
                    const benResponse = await fundTransferService.getBeneficiaries();
                    if (benResponse.success && benResponse.data) {
                        setBeneficiaries(benResponse.data.map(b => ({
                            ...b,
                            accountNumber: (b as any).accountNumber || (b as any).account
                        })));
                    }
                } catch {
                    // Beneficiaries API may not exist yet, that's OK
                    setBeneficiaries([]);
                }
            } catch (e) {
                console.error('[FundTransfer] Failed to fetch data:', e);
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, []);

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

            // Client-side validation for new beneficiary
            if (Object.keys(newErrors).length === 0) {
                // If we are just moving to confirm step, we do external validation here
                setLoading(true);
                try {
                    const response = await fundTransferService.validateRecipient(
                        form.newBeneficiary.account,
                        form.newBeneficiary.ifsc
                    );

                    if (response.success && response.data && response.data.valid) {
                        const { name } = response.data;
                        // Auto-fill verified name if available
                        if (name && name !== 'Verified User') {
                            setForm(prev => ({
                                ...prev,
                                newBeneficiary: { ...prev.newBeneficiary, name }
                            }));
                        }
                    } else {
                        // If strict validation required, uncomment below:
                        // newErrors.account = 'Invalid Account/IFSC';
                    }
                } catch (e) {
                    console.warn('External validation skipped');
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
        const selectedAccount = accounts.find(a => a.accountNumber === form.fromAccount);

        if (!form.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        } else if (selectedAccount && amount > selectedAccount.balance) {
            newErrors.amount = 'Insufficient Funds';
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) setErrors({}); 
        return isValid;
    };

    const handleNext = async () => {
        let valid = false;
        
        if (step === 1) {
            if (isNewBeneficiary) {
                // SUB-FLOW: Add New Beneficiary
                if (addBeneficiaryStep === 1) {
                    // 1. Validate Input -> Go to Confirm
                    valid = await validateStep1();
                    if (valid) {
                        setAddBeneficiaryStep(2);
                        return;
                    }
                } else if (addBeneficiaryStep === 2) {
                    // 2. Confirm Details -> Save & Go to Success
                    setLoading(true);
                    try {
                        const response = await fundTransferService.addBeneficiary(
                            form.newBeneficiary.name,
                            form.newBeneficiary.account,
                            form.newBeneficiary.ifsc
                        );

                        if (response.success && response.data) {
                            const responseData = response.data as any;
                            const newBen: Beneficiary = {
                                ...responseData,
                                accountNumber: responseData.id ? (responseData.accountNumber || responseData.account) : ''
                            };
                            setBeneficiaries(prev => [...prev, newBen]);
                            setAddBeneficiaryStep(3);
                        } else {
                            setErrors(prev => ({ ...prev, root: response.message || 'Failed to add beneficiary' }));
                        }
                    } catch (e) {
                        setErrors(prev => ({ ...prev, root: 'Failed to add beneficiary' }));
                    } finally {
                        setLoading(false);
                    }
                    return;
                } else if (addBeneficiaryStep === 3) {
                    // 3. Success -> Return to main flow
                    // Select the newly added beneficiary
                    const newBen = beneficiaries[beneficiaries.length - 1]; // Simply taking last added or we could track ID
                    if (newBen) {
                         setForm(prev => ({ ...prev, beneficiaryId: newBen.id }));
                    }
                    setIsNewBeneficiary(false);
                    setAddBeneficiaryStep(1); // Reset for next time
                    return;
                }
            } else {
                // Main Flow: Select existing beneficiary
                valid = await validateStep1();
            }
        }
        else if (step === 2) valid = validateStep2();

        if (valid) {
            setStep(prev => {
                const nextStep = prev + 1;
                // Generate stable idempotency key when entering review step (step 3)
                if (nextStep === 3) {
                    const key = typeof crypto !== 'undefined' && crypto.randomUUID 
                        ? crypto.randomUUID() 
                        : `req_${Date.now()}_${Math.random()}`;
                    setIdempotencyKey(key);
                }
                return nextStep;
            });
        }
    };

    const handleBack = () => {
        if (step === 1 && isNewBeneficiary) {
            if (addBeneficiaryStep === 2) {
                setAddBeneficiaryStep(1);
                return;
            }
            if (addBeneficiaryStep === 1) {
                setIsNewBeneficiary(false);
                return;
            }
        }
        setErrors({}); // Clear errors when going back
        setStep(prev => prev - 1);
    };

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
                    name: beneficiaries.find(b => b.id === form.beneficiaryId)?.name || 'Unknown',
                    accountNumber: beneficiaries.find(b => b.id === form.beneficiaryId)?.accountNumber || '',
                    ifsc: beneficiaries.find(b => b.id === form.beneficiaryId)?.ifsc || ''
                };

            const response = await fundTransferService.processTransfer(
                recipient, 
                Number(form.amount), 
                form.fromAccount,
                idempotencyKey
            );
            if (response.success && response.data) {
                setMockRefNo(response.data.txnId);
                setStep(4); // Success step
            } else {
                 throw new Error(response.message || 'Transfer failed');
            }
        } catch (e: any) {
             console.error('[FundTransfer] Submit Error:', e);
             const errorMsg = e.message || (e.code ? `[${e.code}] ${e.message || 'Operation failed'}` : JSON.stringify(e));
             setErrors({ root: errorMsg.includes('{}') ? 'Network/Security Error' : errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const getBeneficiaryDetails = () => {
        if (isNewBeneficiary) return `${form.newBeneficiary.name} (${form.newBeneficiary.account})`;
        const ben = beneficiaries.find(b => b.id === form.beneficiaryId);
        return ben ? `${ben.name} (${ben.accountNumber})` : '';
    };

    const getSelectedAccountDetails = () => {
        const acc = accounts.find(a => a.accountNumber === form.fromAccount);
        return acc ? `${acc.accountNumber} (${acc.type}) - $${acc.balance.toLocaleString()}` : '';
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
        submitTransfer,
        getBeneficiaryDetails,
        getSelectedAccountDetails,
        // REAL DATA
        accounts,
        beneficiaries,
        dataLoading,
        addBeneficiaryStep,
        setAddBeneficiaryStep
    };
};
