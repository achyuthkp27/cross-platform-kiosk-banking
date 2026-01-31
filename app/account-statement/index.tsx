import React from 'react';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import UserIdEntryScreen from '../../src/components/UserIdEntryScreen';
import { otpService } from '../../src/services';
import { useToast } from '../../src/context/ToastContext';

export default function AccountStatementAuth() {
    const router = useRouter();
    const { t } = useLanguage();
    const { showError } = useToast();

    const handleNext = async (userId: string) => {
        try {
            const response = await otpService.generate({
                identifier: userId,
                purpose: 'TRANSACTION' // or LOGIN depending on flow, usually TRANSACTION for viewing data
            });

            if (response.success) {
                router.push({ pathname: '/account-statement/otp', params: { userId } });
            } else {
                showError(response.message || 'Failed to generate OTP');
            }
        } catch (error) {
            console.error('OTP generation failed:', error);
            showError('Failed to generate OTP. Please try again.');
        }
    };

    return (
        <UserIdEntryScreen
            title={t('auth.verify_identity')}
            subtitle="For security, please confirm your User ID to view your account statement."
            onNext={handleNext}
            onBack={() => router.back()}
            primaryButtonText={t('common.next')}
            secondaryButtonText={t('common.back')}
        />
    );
}
