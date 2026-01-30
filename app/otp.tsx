import React from 'react';
import { useRouter } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';
import OTPVerificationScreen from '../src/components/OTPVerificationScreen';
import { useAudit } from '../src/context/AuditContext';

/**
 * Main login OTP screen - used after user enters User ID and DOB.
 * Now using the shared OTPVerificationScreen component for consistent behavior.
 */
export default function OTPScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const { addLog } = useAudit();

    const handleVerify = (otp: string) => {
        // Navigate to dashboard after successful verification
        addLog('User Login Success', 'User_1234');
        router.push('/dashboard');
    };

    return (
        <OTPVerificationScreen
            title={t('otp.title')}
            onVerify={handleVerify}
            onBack={() => router.back()}
            showBackButton={true}
            successMessage={t('otp.verified')}
            successSubMessage={t('common.loading')}
        />
    );
}
