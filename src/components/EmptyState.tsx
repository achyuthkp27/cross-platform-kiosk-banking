import React from 'react';
import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudOffIcon from '@mui/icons-material/CloudOff';

type EmptyStateType = 'empty' | 'no-results' | 'error' | 'offline';

interface EmptyStateProps {
    type?: EmptyStateType;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

const getDefaultIcon = (type: EmptyStateType, theme: any) => {
    const iconSx = {
        fontSize: 80,
        color: alpha(theme.palette.text.secondary, 0.3),
    };

    switch (type) {
        case 'no-results':
            return <SearchOffIcon sx={iconSx} />;
        case 'error':
            return <ErrorOutlineIcon sx={{ ...iconSx, color: alpha(theme.palette.error.main, 0.4) }} />;
        case 'offline':
            return <CloudOffIcon sx={iconSx} />;
        default:
            return <InboxIcon sx={iconSx} />;
    }
};

/**
 * Premium empty state component with illustrations and animations
 */
export default function EmptyState({
    type = 'empty',
    title,
    description,
    actionLabel,
    onAction,
    icon,
}: EmptyStateProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    px: 4,
                    textAlign: 'center',
                }}
            >
                {/* Animated Icon Container */}
                <motion.div
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Box
                        sx={{
                            width: 160,
                            height: 160,
                            borderRadius: '50%',
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)'
                                : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 4,
                            border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        }}
                    >
                        {icon || getDefaultIcon(type, theme)}
                    </Box>
                </motion.div>

                {/* Title */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: 'text.primary',
                    }}
                >
                    {title}
                </Typography>

                {/* Description */}
                {description && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: 400,
                            mb: actionLabel ? 4 : 0,
                            lineHeight: 1.6,
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {/* Action Button */}
                {actionLabel && onAction && (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            variant="contained"
                            onClick={onAction}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600,
                            }}
                        >
                            {actionLabel}
                        </Button>
                    </motion.div>
                )}
            </Box>
        </motion.div>
    );
}
