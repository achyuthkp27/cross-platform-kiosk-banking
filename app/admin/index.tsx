import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, InputAdornment, IconButton, useTheme } from '@mui/material';
import { useRouter } from 'expo-router';
import { motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useToast } from '../../src/context/ToastContext';

export default function AdminLogin() {
    const router = useRouter();
    const theme = useTheme();
    const { mode } = useThemeContext();
    const { showError, showSuccess } = useToast();
    const isDark = mode === 'dark';

    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);

    const handleLogin = () => {
        // Mock Admin PIN authentication
        if (pin === '1234') {
            showSuccess('Admin access granted');
            router.replace('/admin/dashboard');
        } else {
            showError('Invalid Admin PIN');
            setPin('');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark
                ? 'linear-gradient(135deg, #020617 0%, #0F172A 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            p: 2,
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: 400,
                        maxWidth: '100%',
                        p: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        bgcolor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                    }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                    </Box>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Admin Access
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Enter authorized PIN to configure kiosk settings
                    </Typography>

                    <TextField
                        fullWidth
                        type={showPin ? 'text' : 'password'}
                        label="Admin PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPin(!showPin)}
                                        edge="end"
                                    >
                                        {showPin ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleLogin}
                        disabled={pin.length < 4}
                        sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 600,
                            mb: 2,
                        }}
                    >
                        Access Dashboard
                    </Button>

                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.replace('/')}
                        sx={{ opacity: 0.7 }}
                    >
                        Return to Kiosk
                    </Button>
                </Paper>
            </motion.div>
        </Box>
    );
}

// Helper for alpha color
import { alpha } from '@mui/material';
