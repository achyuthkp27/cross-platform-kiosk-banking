import React from 'react';
import { useRouter } from 'expo-router';
import ReAuthScreen from '../../src/components/ReAuthScreen';

export default function BillPaymentIndex() {
    const router = useRouter();

    const handleAuthSuccess = () => {
        router.replace('/bill-payment/wizard');
    };

    return (
        <ReAuthScreen
            title="Bill Payment Authorization"
            onSuccess={handleAuthSuccess}
        />
    );
}
