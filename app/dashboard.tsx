import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, AppBar, Toolbar, Container, Button, alpha, Chip, useTheme } from '@mui/material';
import { useRouter } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import { useThemeContext } from '../src/context/ThemeContext';

const iconMap: Record<string, React.ReactNode> = {
    '/account-statement': <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
    '/cheque-book': <MenuBookIcon sx={{ fontSize: 48 }} />,
    '/fund-transfer': <SwapHorizIcon sx={{ fontSize: 48 }} />,
    '/bill-payment': <ReceiptLongIcon sx={{ fontSize: 48 }} />
};

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const theme = useTheme();
    const { mode } = useThemeContext();
    const [sessionTime, setSessionTime] = useState(300);

    const isDark = mode === 'dark';

    useEffect(() => {
        const timer = setInterval(() => {
            setSessionTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.replace('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const menuItems = [
        { id: 1, title: t('dashboard.accounts'), path: '/account-statement', color: '#3B82F6' },
        { id: 2, title: t('dashboard.cheque_book'), path: '/cheque-book', color: '#8B5CF6' },
        { id: 3, title: t('dashboard.fund_transfer'), path: '/fund-transfer', color: '#10B981' },
        { id: 4, title: t('dashboard.bill_payment'), path: '/bill-payment', color: '#F59E0B' }
    ];

    const handleLogout = () => {
        router.replace('/');
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
        }}>
            {/* Header */}
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                    transition: 'all 0.4s ease',
                }}
            >
                <Toolbar sx={{ py: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                            Kiosk Banking
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {t('dashboard.welcome_user')}
                        </Typography>
                    </Box>

                    <Chip
                        label={`Session: ${formatTime(sessionTime)}`}
                        color={sessionTime < 60 ? 'error' : 'default'}
                        variant={sessionTime < 60 ? 'filled' : 'outlined'}
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            px: 1,
                            mr: 2,
                            fontFamily: '"SF Mono", monospace'
                        }}
                    />

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            mr: 18,
                            borderWidth: 2,
                            '&:hover': { borderWidth: 2 }
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 6, mb: 4, flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%' }}
                >
                    <Grid container spacing={4}>
                        {menuItems.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                                <motion.div variants={itemVariants}>
                                    <Paper
                                        elevation={0}
                                        onClick={() => router.push(item.path)}
                                        sx={{
                                            height: 240,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'white',
                                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
                                            boxShadow: isDark
                                                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                                                : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: isDark
                                                    ? `0 20px 40px ${alpha(item.color, 0.3)}`
                                                    : `0 20px 40px ${alpha(item.color, 0.2)}`,
                                                borderColor: alpha(item.color, 0.3),
                                                '& .tile-icon': {
                                                    transform: 'scale(1.1)',
                                                    color: item.color,
                                                },
                                                '& .tile-bg': {
                                                    opacity: isDark ? 0.15 : 0.08,
                                                },
                                                '& .tile-title': {
                                                    color: item.color,
                                                }
                                            },
                                            '&:active': {
                                                transform: 'translateY(-4px) scale(0.99)',
                                            }
                                        }}
                                    >
                                        {/* Background accent */}
                                        <Box
                                            className="tile-bg"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `radial-gradient(circle at top right, ${item.color}, transparent 70%)`,
                                                opacity: isDark ? 0.08 : 0.04,
                                                transition: 'opacity 0.3s ease',
                                            }}
                                        />

                                        {/* Icon */}
                                        <Box
                                            className="tile-icon"
                                            sx={{
                                                color: isDark ? 'rgba(148, 163, 184, 0.8)' : 'text.secondary',
                                                mb: 2,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {iconMap[item.path]}
                                        </Box>

                                        {/* Title */}
                                        <Typography
                                            variant="h6"
                                            className="tile-title"
                                            sx={{
                                                fontWeight: 600,
                                                color: isDark ? '#F8FAFC' : 'text.primary',
                                                transition: 'color 0.3s ease',
                                                textAlign: 'center',
                                                px: 2
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        {/* Bottom accent line */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '20%',
                                                right: '20%',
                                                height: 3,
                                                borderRadius: '3px 3px 0 0',
                                                background: item.color,
                                                opacity: 0.7,
                                            }}
                                        />
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}
