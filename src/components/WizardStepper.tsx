import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';

interface WizardStepperProps {
    steps: number;
    currentStep: number;
    labels?: string[];
}

/**
 * Premium wizard stepper with animated progress and step indicators.
 */
export default function WizardStepper({ steps, currentStep, labels }: WizardStepperProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ mb: 5, mt: 2 }}>
            {/* Progress Track */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
                {Array.from({ length: steps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <React.Fragment key={index}>
                            {/* Step Circle */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.3 }}
                            >
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        position: 'relative',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        bgcolor: isCompleted
                                            ? theme.palette.success.main
                                            : isActive
                                                ? theme.palette.primary.main
                                                : (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                                        color: isCompleted || isActive
                                            ? 'white'
                                            : theme.palette.text.secondary,
                                        boxShadow: isActive
                                            ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`
                                            : isCompleted
                                                ? `0 0 0 4px ${alpha(theme.palette.success.main, 0.15)}`
                                                : 'none',
                                    }}
                                >
                                    {isCompleted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                                        >
                                            <CheckIcon sx={{ fontSize: 22 }} />
                                        </motion.div>
                                    ) : (
                                        stepNumber
                                    )}

                                    {/* Pulse effect for active step */}
                                    {isActive && (
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.5, 0, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                border: `2px solid ${theme.palette.primary.main}`,
                                            }}
                                        />
                                    )}
                                </Box>
                            </motion.div>

                            {/* Connector Line */}
                            {index < steps - 1 && (
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 3,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Animated fill */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: isCompleted ? '100%' : isActive ? '50%' : '0%'
                                        }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                        style={{
                                            height: '100%',
                                            background: isCompleted
                                                ? theme.palette.success.main
                                                : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                            borderRadius: 2,
                                        }}
                                    />
                                </Box>
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>

            {/* Step Labels (optional) */}
            {labels && labels.length === steps && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        px: 1
                    }}
                >
                    {labels.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = currentStep === stepNumber;
                        const isCompleted = currentStep > stepNumber;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: isActive || isCompleted ? 600 : 400,
                                    color: isActive
                                        ? theme.palette.primary.main
                                        : isCompleted
                                            ? theme.palette.success.main
                                            : theme.palette.text.secondary,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {label}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}
