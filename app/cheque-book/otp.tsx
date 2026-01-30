import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import OTPVerificationScreen from '../../src/components/OTPVerificationScreen';

/**
 * Cheque Book OTP verification screen.
 * Now using the shared OTPVerificationScreen component for consistent behavior.
 */
export default function ChequeBookOTP() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const { t } = useLanguage();

    const handleVerify = (_otp: string) => {
        // Navigate to order page after successful verification
        router.replace('/cheque-book/order');
    };

    return (
        <OTPVerificationScreen
            title={t('otp.title')}
            userId={userId as string}
            onVerify={handleVerify}
            onBack={() => router.back()}
            showBackButton={true}
            successMessage={t('otp.identity_verified')}
            successSubMessage="Proceeding to your order..."
        />
    );
}
