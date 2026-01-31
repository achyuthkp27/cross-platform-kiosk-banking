import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Select, Button, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import { useRouter } from 'expo-router';
import KioskPage from '../../src/components/KioskPage';
import { useCardServices } from '../../src/hooks/useCardServices';
import { accountService } from '../../src/services';
import { Account } from '../../src/types/services';
import { useToast } from '../../src/context/ToastContext';
import SuccessState from '../../src/components/SuccessState';
import ActionButtons from '../../src/components/ActionButtons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RequestCardPage() {
    const router = useRouter();
    const { requestNewCard, loading } = useCardServices();
    const { showSuccess, showError } = useToast();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<number | ''>('');
    const [cardType, setCardType] = useState('DEBIT');
    const [isSuccess, setIsSuccess] = useState(false);
    const [fetchingAccounts, setFetchingAccounts] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
             try {
                const userId = sessionStorage.getItem('kiosk_userId');
                if (!userId) return; // Handled by auth guard usually
                
                const res = await accountService.getAccounts(userId);
                if (res.success && res.data) {
                    setAccounts(res.data);
                    if (res.data.length > 0) {
                        setSelectedAccountId(res.data[0].id);
                    }
                }
             } catch (e) {
                 showError('Failed to load accounts');
             } finally {
                 setFetchingAccounts(false);
             }
        };
        fetchAccounts();
    }, []);

    const handleSubmit = async () => {
        if (!selectedAccountId) {
            showError('Please select an account');
            return;
        }

        try {
            await requestNewCard(Number(selectedAccountId), cardType);
            setIsSuccess(true);
            showSuccess('Card requested successfully');
        } catch (e) {
            showError('Failed to request card');
        }
    };

    if (isSuccess) {
        return (
            <KioskPage>
                <SuccessState 
                    message="Card Requested Successfully"
                    subMessage="Your new card will be delivered within 5-7 business days."
                    onHome={() => router.replace('/card-services')}
                />
            </KioskPage>
        );
    }

    return (
        <KioskPage maxWidth={600}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.back()}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Request New Card
                </Typography>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography gutterBottom>Select Linked Account</Typography>
                    {accounts.length === 0 ? (
                        <Typography color="error">
                            No eligible accounts found to link a card to. Please contact support.
                        </Typography>
                    ) : (
                        <FormControl fullWidth disabled={fetchingAccounts}>
                            <Select
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                                displayEmpty
                            >
                                {accounts.map(acc => (
                                    <MenuItem key={acc.id} value={acc.id}>
                                        {acc.accountNumber} - {acc.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography gutterBottom>Card Type</Typography>
                    <RadioGroup
                        row
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                    >
                        <FormControlLabel value="DEBIT" control={<Radio />} label="Debit Card" />
                        <FormControlLabel value="CREDIT" control={<Radio />} label="Credit Card" />
                    </RadioGroup>
                </Box>

                <ActionButtons
                    primaryText={loading ? 'Processing...' : 'Submit Request'}
                    onPrimary={handleSubmit}
                    primaryDisabled={loading || !selectedAccountId || fetchingAccounts}
                    secondaryText="Cancel"
                    onSecondary={() => router.back()}
                />
            </Paper>
        </KioskPage>
    );
}
