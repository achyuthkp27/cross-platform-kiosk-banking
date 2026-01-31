import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import OTPVerificationScreen from '../../src/components/OTPVerificationScreen';
import { otpService } from '../../src/services';
import { useToast } from '../../src/context/ToastContext';

export default function AccountStatementOTP() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const { t } = useLanguage();
    const { showError } = useToast();

    const handleVerify = async (otp: string) => {
        if (!userId) {
            showError('User ID missing');
            return;
        }

        try {
            const response = await otpService.validate({
                identifier: userId as string,
                code: otp
            });

            if (response.success && response.data?.valid) {
                // Navigate to statement view after successful verification
                // Pass userId to view for data fetching
                router.replace({ pathname: '/account-statement/view', params: { userId } });
            } else {
                const msg = response.message || 'Invalid OTP';
                showError(msg);
                throw new Error(msg);
            }
        } catch (error) {
            console.error('OTP validation failed:', error);
            throw error;
        }
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
