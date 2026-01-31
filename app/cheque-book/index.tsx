import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useThemeContext } from '../../src/context/ThemeContext';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChequeBookDashboard() {
    const router = useRouter();
    const { mode } = useThemeContext();
    const isDark = mode === 'dark';
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem('kiosk_userId');
        if (!userId) {
            router.replace('/login');
        } else {
            setVerifying(false); // Valid logic
        }
    }, []);

    if (verifying) return null;

    const MenuOption = ({ title, icon, path }: { title: string, icon: React.ReactNode, path: string }) => (
        <Paper
            elevation={2}
            onClick={() => router.push(path)}
            sx={{
                p: 4,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderRadius: 4,
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    bgcolor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'primary.50',
                    borderColor: 'primary.main'
                }
            }}
        >
            <Box sx={{ 
                p: 2, 
                borderRadius: '50%', 
                bgcolor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'primary.50',
                mb: 2,
                color: 'primary.main'
            }}>
                {icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" color={isDark ? '#F8FAFC' : 'text.primary'}>
                {title}
            </Typography>
        </Paper>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: isDark ? '#020617' : '#F0F2F5',
            display: 'flex',
            flexDirection: 'column',
        }}>
             {/* Header */}
             <Paper elevation={1} sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'white',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.push('/dashboard')}
                    sx={{ color: isDark ? '#F8FAFC' : 'text.primary' }}
                >
                    Dashboard
                </Button>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    Cheque Book Services
                </Typography>
            </Paper>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Grid container spacing={4} maxWidth={800}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MenuOption 
                            title="Request New Book" 
                            icon={<NoteAddIcon fontSize="large" />} 
                            path="/cheque-book/order" 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <MenuOption 
                            title="View Status / Orders" 
                            icon={<HistoryIcon fontSize="large" />} 
                            path="/cheque-book/orders" 
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
