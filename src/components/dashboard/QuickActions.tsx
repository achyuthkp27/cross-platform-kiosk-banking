import React from 'react';
import { Box, Typography, Grid, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface MenuItem {
    id: number;
    title: string;
    path: string;
    color: string;
    icon: any; // Using 'any' for the MUI icon component
}

interface QuickActionsProps {
    menuItems: MenuItem[];
    onNavigate: (path: string) => void;
    isDark: boolean;
    itemVariants: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    menuItems,
    onNavigate,
    isDark,
    itemVariants
}) => {
    return (
        <>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={4}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                            <motion.div variants={itemVariants}>
                                <Paper
                                    elevation={0}
                                    onClick={() => onNavigate(item.path)}
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
                                        <Icon sx={{ fontSize: 48 }} />
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
                    );
                })}
            </Grid>
        </>
    );
};
