import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import { useRouter } from 'expo-router';
// Icons would normally be imported from @mui/icons-material

export default function Dashboard() {
    const router = useRouter();
    const [sessionTime, setSessionTime] = useState(300); // 5 minutes

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

    return (
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F0F2F5' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar>
                    <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Kiosk Banking
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2, color: 'text.secondary' }}>
                        Welcome, John Doe
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 'bold' }}>
                        Session: {formatTime(sessionTime)}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, flexGrow: 1 }}>
                <Grid container spacing={4} sx={{ height: '100%' }}>
                    {[
                        { id: 1, title: 'Account Services', path: '/account-statement' },
                        { id: 2, title: 'Cheque Book', path: '/cheque-book' },
                        { id: 3, title: 'Fund Transfer', path: '/fund-transfer' },
                        { id: 4, title: 'Bill Payments', path: '/bill-payment' }
                    ].map((item) => (
                        <Grid size={{ xs: 12, md: 4 }} key={item.id}>
                            <Paper
                                elevation={2}
                                onClick={() => item.path !== '#' && router.push(item.path)}
                                sx={{
                                    height: '300px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    bgcolor: 'white',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                                    {item.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
