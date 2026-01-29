import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Switch, FormControlLabel, Select, MenuItem, Button, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';
import { useRouter } from 'expo-router';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import { useThemeContext } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useToast } from '../../src/context/ToastContext';

export default function AdminDashboard() {
    const router = useRouter();
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeContext();
    const { language, setLanguage } = useLanguage();
    const { showSuccess, showInfo } = useToast();
    const isDark = mode === 'dark';

    const [tabValue, setTabValue] = useState(0);
    const [auditLogs] = useState([
        { id: 1, action: 'System Boot', user: 'SYSTEM', time: '08:00 AM' },
        { id: 2, action: 'User Login', user: 'User_1234', time: '08:15 AM' },
        { id: 3, action: 'Deposit', user: 'User_1234', time: '08:20 AM' },
        { id: 4, action: 'Admin Login', user: 'ADMIN', time: 'Now' },
    ]);

    const handleLogout = () => {
        showInfo('Logged out of Admin Console');
        router.replace('/');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            bgcolor: isDark ? '#020617' : '#F1F5F9',
        }}>
            {/* Sidebar */}
            <Paper
                elevation={0}
                sx={{
                    width: 250,
                    borderRadius: 0,
                    borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    bgcolor: isDark ? '#0F172A' : 'white',
                }}
            >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Kiosk Admin
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        v1.0.0 (Build 2026.1)
                    </Typography>
                </Box>
                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    sx={{
                        '& .MuiTab-root': {
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            pl: 4,
                            minHeight: 50,
                        }
                    }}
                >
                    <Tab icon={<SettingsIcon sx={{ mr: 1 }} />} iconPosition="start" label="General" />
                    <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Security" />
                    <Tab icon={<HistoryIcon sx={{ mr: 1 }} />} iconPosition="start" label="Audit Logs" />
                </Tabs>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                        fullWidth
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Paper>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 4 }}>
                <motion.div
                    key={tabValue}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        {tabValue === 0 && 'System Settings'}
                        {tabValue === 1 && 'Security Configuration'}
                        {tabValue === 2 && 'System Audit Logs'}
                    </Typography>

                    <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800 }}>
                        {/* Tab 0: General */}
                        {tabValue === 0 && (
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Kiosk Theme Mode"
                                        secondary="Toggle between Light and Dark mode for the kiosk interface."
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={isDark} onChange={toggleTheme} />}
                                        label={isDark ? "Dark Mode" : "Light Mode"}
                                    />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText
                                        primary="Default Language"
                                        secondary="Set the primary language for new sessions."
                                    />
                                    <Select
                                        size="small"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as any)}
                                        sx={{ minWidth: 120 }}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Español</MenuItem>
                                        <MenuItem value="nl">Nederlands</MenuItem>
                                    </Select>
                                </ListItem>
                            </List>
                        )}

                        {/* Tab 1: Security */}
                        {tabValue === 1 && (
                            <Box>
                                <Typography variant="body1" paragraph>
                                    Security settings are locked in this demo version.
                                </Typography>
                                <Button variant="outlined" disabled>Change Admin PIN</Button>
                            </Box>
                        )}

                        {/* Tab 2: Logs */}
                        {tabValue === 2 && (
                            <List>
                                {auditLogs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={log.action}
                                                secondary={
                                                    <Typography variant="caption" component="span" sx={{ fontFamily: 'monospace' }}>
                                                        User: {log.user} | Time: {log.time}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}
