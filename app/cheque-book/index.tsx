import React from 'react';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import UserIdEntryScreen from '../../src/components/UserIdEntryScreen';

/**
 * Cheque Book User ID verification screen.
 * Now using the shared UserIdEntryScreen component for consistent behavior.
 */
export default function ChequeBookAuth() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleNext = (userId: string) => {
        router.push({ pathname: '/cheque-book/otp', params: { userId } });
    };

    return (
        <UserIdEntryScreen
            title={t('auth.verify_identity')}
            subtitle="To order a cheque book, please re-confirm your identity."
            onNext={handleNext}
            onBack={() => router.back()}
            primaryButtonText={t('common.verify')}
            secondaryButtonText={t('common.cancel')}
        />
    );
}
