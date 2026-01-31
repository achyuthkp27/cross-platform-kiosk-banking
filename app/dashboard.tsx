import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useRouter } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';
import { motion } from 'framer-motion';
import { useThemeContext } from '../src/context/ThemeContext';
import { useSession } from '../src/context/SessionContext';
import { useDashboardData } from '../src/hooks/useDashboardData';
import { DashboardHeader } from '../src/components/dashboard/DashboardHeader';
import { AccountSummary } from '../src/components/dashboard/AccountSummary';
import { QuickActions } from '../src/components/dashboard/QuickActions';
import SkeletonLoader from '../src/components/SkeletonLoader';

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const { mode } = useThemeContext();
    const { timeLeft, endSession } = useSession();
    const { menuItems, accounts, totalBalance, loading } = useDashboardData();
    
    // Get user name from sessionStorage
    const [userName, setUserName] = useState('');
    
    useEffect(() => {
        const name = sessionStorage.getItem('userName');
        setUserName(name || 'User');
    }, []);

    const isDark = mode === 'dark';

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    // Animation variants for staggered tile entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                damping: 20,
                stiffness: 300
            }
        }
    };

    return (
        <Box sx={{
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: isDark
                ? 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #020617 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #F1F5F9 100%)',
            transition: 'background 0.4s ease',
            overflowY: 'auto', // Ensure content is scrollable if it exceeds viewport
            WebkitOverflowScrolling: 'touch',
        }}>
            {/* Header */}
            <DashboardHeader
                isDark={isDark}
                userName={userName}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onLogout={endSession}
            />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 }, flexGrow: 1 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <SkeletonLoader variant="dashboard" />
                    ) : (
                        <>
                            {/* Account Balance Summary */}
                            <AccountSummary
                                accounts={accounts}
                                totalBalance={totalBalance}
                                isDark={isDark}
                                itemVariants={itemVariants}
                                onAccountClick={() => handleNavigate('/account-statement')}
                            />

                            {/* Quick Actions */}
                            <QuickActions
                                menuItems={menuItems}
                                onNavigate={handleNavigate}
                                isDark={isDark}
                                itemVariants={itemVariants}
                            />
                        </>
                    )}
                </motion.div>
            </Container>
        </Box>
    );
}
