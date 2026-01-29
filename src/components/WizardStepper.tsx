import React from 'react';
import { Stack, Box } from '@mui/material';

export interface WizardStepperProps {
    /** Total number of steps */
    steps: number;
    /** Current step (1-indexed) */
    currentStep: number;
    /** Custom styling */
    sx?: object;
}

/**
 * A reusable wizard stepper component showing progress through a multi-step flow.
 * Displays a horizontal bar with segments that fill based on progress.
 */
export default function WizardStepper({
    steps,
    currentStep,
    sx = {}
}: WizardStepperProps) {
    return (
        <Stack direction="row" spacing={2} sx={{ mb: 4, ...sx }}>
            {Array.from({ length: steps }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        flex: 1,
                        height: 6,
                        bgcolor: index + 1 <= currentStep ? 'primary.main' : '#e0e0e0',
                        borderRadius: 3,
                        transition: 'background-color 0.3s ease'
                    }}
                />
            ))}
        </Stack>
    );
}
