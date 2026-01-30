import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import OTPVerificationScreen from '../../src/components/OTPVerificationScreen';

/**
 * Account Statement OTP verification screen.
 * Now using the shared OTPVerificationScreen component for consistent behavior.
 */
export default function AccountStatementOTP() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const { t } = useLanguage();

    const handleVerify = (_otp: string) => {
        // Navigate to statement view after successful verification
        router.replace('/account-statement/view');
    };

    return (
        <OTPVerificationScreen
            title={t('otp.title')}
            userId={userId as string}
            onVerify={handleVerify}
            onBack={() => router.back()}
            showBackButton={true}
            successMessage={t('otp.access_granted')}
            successSubMessage="Retrieving your secure statement..."
        />
    );
}
