import { useLanguage } from '../context/LanguageContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export const useDashboardData = () => {
    const { t } = useLanguage();

    const menuItems = [
        { id: 1, title: t('dashboard.accounts'), path: '/account-statement', color: '#3B82F6', icon: AccountBalanceWalletIcon },
        { id: 2, title: t('dashboard.cheque_book'), path: '/cheque-book', color: '#8B5CF6', icon: MenuBookIcon },
        { id: 3, title: t('dashboard.fund_transfer'), path: '/fund-transfer', color: '#10B981', icon: SwapHorizIcon },
        { id: 4, title: t('dashboard.bill_payment'), path: '/bill-payment', color: '#F59E0B', icon: ReceiptLongIcon }
    ];

    // Mock account data
    const accounts = [
        { id: 1, type: 'Savings', number: 'xxxx1234', balance: 50000, color: '#3B82F6' },
        { id: 2, type: 'Current', number: 'xxxx5678', balance: 125000, color: '#10B981' },
    ];

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
        menuItems,
        accounts,
        totalBalance
    };
};
