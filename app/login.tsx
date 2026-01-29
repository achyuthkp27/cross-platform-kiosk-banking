import React, { useState } from 'react';
import { Typography, Alert } from '@mui/material';
import KioskTextField from '../src/components/KioskTextField';
import { useRouter } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';
import KioskPage from '../src/components/KioskPage';
import ActionButtons from '../src/components/ActionButtons';

export default function LoginScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [userId, setUserId] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    const validateAndProceed = () => {
        if (!userId.trim()) {
            setError(t('common.error'));
            return;
        }
        const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dob.match(dobRegex);
        if (!match) {
            setError(t('common.error'));
            return;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError(t('common.error'));
            return;
        }

        router.push('/otp');
    };

    return (
        <KioskPage maxWidth={500}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                {t('auth.login_title')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                {t('landing.tagline')}
            </Typography>

            <KioskTextField
                fullWidth
                label={t('auth.user_id')}
                variant="outlined"
                margin="normal"
                value={userId}
                onChange={(e) => {
                    setUserId(e.target.value);
                    setError('');
                }}
            />
            <KioskTextField
                fullWidth
                label={t('auth.dob')}
                variant="outlined"
                margin="normal"
                placeholder="DD/MM/YYYY"
                value={dob}
                keyboardType="numeric"
                onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 8) val = val.slice(0, 8);

                    let formattedVal = val;
                    if (val.length > 4) {
                        formattedVal = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
                    } else if (val.length > 2) {
                        formattedVal = `${val.slice(0, 2)}/${val.slice(2)}`;
                    }

                    setDob(formattedVal);
                    setError('');
                }}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                    {error}
                </Alert>
            )}

            <ActionButtons
                onPrimary={validateAndProceed}
                onSecondary={() => router.back()}
                primaryText={t('common.next')}
                secondaryText={t('common.back')}
                primaryDisabled={!userId || !dob}
                sx={{ mt: 4 }}
            />
        </KioskPage>
    );
}
