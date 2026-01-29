import React from 'react';
import { useRouter } from 'expo-router';
import ReAuthScreen from '../../src/components/ReAuthScreen';

export default function FundTransferIndex() {
    const router = useRouter();

    const handleAuthSuccess = () => {
        router.replace('/fund-transfer/wizard');
    };

    return (
        <ReAuthScreen
            title="Fund Transfer Authorization"
            onSuccess={handleAuthSuccess}
        />
    );
}
