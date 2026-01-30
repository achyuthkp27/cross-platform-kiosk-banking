import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Switch, FormControlLabel, Select, MenuItem, Button, List, ListItem, ListItemText, Divider, useTheme, TextField } from '@mui/material';
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
import { useSession } from '../../src/context/SessionContext';
import { useAudit } from '../../src/context/AuditContext';

export default function AdminDashboard() {
    const router = useRouter();
    const theme = useTheme();
    const { mode, toggleTheme } = useThemeContext();
    const { t, language, setLanguage } = useLanguage();
    const { showSuccess, showInfo } = useToast();
    const { sessionDuration, setSessionDuration } = useSession();
    const { logs: auditLogs, addLog } = useAudit();
    const isDark = mode === 'dark';

    const [tabValue, setTabValue] = useState(0);
    const [logSearch, setLogSearch] = useState('');

    const filteredLogs = useMemo(() => {
        if (!logSearch) return auditLogs;
        const lowerValues = logSearch.toLowerCase();
        return auditLogs.filter(log =>
            log.action.toLowerCase().includes(lowerValues) ||
            log.user.toLowerCase().includes(lowerValues) ||
            log.time.toLowerCase().includes(lowerValues)
        );
    }, [auditLogs, logSearch]);

    const handleExportLogs = () => {
        const headers = ["ID", "Action", "User", "Time", "Timestamp", "Metadata"];
        const rows = filteredLogs.map(log => [
            log.id,
            log.action,
            log.user,
            log.time,
            log.timestamp,
            JSON.stringify(log.metadata || {})
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = () => {
        addLog('Admin Logout', 'ADMIN');
        showInfo(t('admin.logged_out'));
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
                        {t('admin.title')}
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
                    <Tab icon={<SettingsIcon sx={{ mr: 1 }} />} iconPosition="start" label={t('admin.tabs.general')} />
                    <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label={t('admin.tabs.security')} />
                    <Tab icon={<HistoryIcon sx={{ mr: 1 }} />} iconPosition="start" label={t('admin.tabs.logs')} />
                </Tabs>
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                        fullWidth
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        {t('admin.logout')}
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
                        {tabValue === 0 && t('admin.settings.system')}
                        {tabValue === 1 && t('admin.settings.security')}
                        {tabValue === 2 && t('admin.settings.logs')}
                    </Typography>

                    <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800 }}>
                        {/* Tab 0: General */}
                        {tabValue === 0 && (
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary={t('admin.settings.theme')}
                                        secondary={t('admin.settings.theme_desc')}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={isDark} onChange={toggleTheme} />}
                                        label={isDark ? "Dark Mode" : "Light Mode"}
                                    />
                                </ListItem>
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText
                                        primary={t('admin.settings.language')}
                                        secondary={t('admin.settings.language_desc')}
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
                                <Divider component="li" />
                                <ListItem>
                                    <ListItemText
                                        primary={t('admin.settings.timeout')}
                                        secondary={t('admin.settings.timeout_desc')}
                                    />
                                    <Select
                                        size="small"
                                        value={sessionDuration / 60}
                                        onChange={(e) => {
                                            const minutes = Number(e.target.value);
                                            setSessionDuration(minutes * 60);
                                            showSuccess(`Session timeout updated to ${minutes} minutes`);
                                        }}
                                        sx={{ minWidth: 120 }}
                                    >
                                        <MenuItem value={1}>1 Minute</MenuItem>
                                        <MenuItem value={2}>2 Minutes</MenuItem>
                                        <MenuItem value={5}>5 Minutes</MenuItem>
                                        <MenuItem value={10}>10 Minutes</MenuItem>
                                        <MenuItem value={15}>15 Minutes</MenuItem>
                                        <MenuItem value={30}>30 Minutes</MenuItem>
                                    </Select>
                                </ListItem>
                            </List>
                        )}

                        {/* Tab 1: Security */}
                        {tabValue === 1 && (
                            <Box>
                                <Typography variant="body1" paragraph>
                                    {t('admin.security_locked')}
                                </Typography>
                                <Button variant="outlined" disabled>{t('admin.change_pin')}</Button>
                            </Box>
                        )}

                        {/* Tab 2: Logs */}
                        {tabValue === 2 && (
                            <Box>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder={t('admin.search_logs') || "Search logs..."}
                                        value={logSearch}
                                        onChange={(e) => setLogSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleExportLogs}
                                    >
                                        Export CSV
                                    </Button>
                                </Box>
                                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map((log) => (
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
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                            No logs found matching "{logSearch}"
                                        </Typography>
                                    )}
                                </List>
                            </Box>
                        )}
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}
