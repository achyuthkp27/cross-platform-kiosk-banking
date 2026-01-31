import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { accountService } from '../services';
import { Account } from '../types/services';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export const useDashboardData = () => {
    const { t } = useLanguage();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const menuItems = [
        { id: 1, title: t('dashboard.accounts'), path: '/account-statement', color: '#3B82F6', icon: AccountBalanceWalletIcon },
        { id: 2, title: t('dashboard.cheque_book'), path: '/cheque-book', color: '#8B5CF6', icon: MenuBookIcon },
        { id: 3, title: t('dashboard.fund_transfer'), path: '/fund-transfer', color: '#10B981', icon: SwapHorizIcon },
        { id: 4, title: t('dashboard.bill_payment'), path: '/bill-payment', color: '#F59E0B', icon: ReceiptLongIcon },
        { id: 5, title: 'Card Services', path: '/card-services', color: '#EC4899', icon: CreditCardIcon }
    ];

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const userId = sessionStorage.getItem('kiosk_userId');
                if (!userId) {
                    console.warn('[Dashboard] No user ID found in session storage');
                    return;
                }

                setLoading(true);
                const response = await accountService.getAccounts(userId);
                
                if (response.success && response.data) {
                    // Map backend data to UI format if needed, or use directly if matches
                    // Adding color for UI based on account type
                    const mappedAccounts = response.data.map(acc => ({
                        ...acc,
                        color: (acc.type === 'Savings' || acc.type === 'SAVINGS') ? '#3B82F6' : '#10B981', // Blue for Savings, Green for Current
                        // Ensure numeric balance
                        balance: typeof acc.balance === 'string' ? parseFloat(acc.balance) : acc.balance
                    }));
                    setAccounts(mappedAccounts);
                } else {
                    setError(response.message || 'Failed to fetch accounts');
                }
            } catch (err) {
                console.error('[Dashboard] Error fetching accounts:', err);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const totalBalance = accounts.reduce((sum, acc) => sum + (typeof acc.balance === 'string' ? parseFloat(acc.balance) : acc.balance), 0);

    return {
        menuItems,
        accounts,
        totalBalance,
        loading,
        error
    };
};
