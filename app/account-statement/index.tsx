import React from 'react';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import UserIdEntryScreen from '../../src/components/UserIdEntryScreen';

/**
 * Account Statement User ID verification screen.
 * Now using the shared UserIdEntryScreen component for consistent behavior.
 */
export default function AccountStatementAuth() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleNext = (userId: string) => {
        router.push({ pathname: '/account-statement/otp', params: { userId } });
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
