import React from 'react';
import { Box, Skeleton, BoxProps } from '@mui/material';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    variant?: 'card' | 'form' | 'list' | 'dashboard';
    count?: number;
}

/**
 * Premium skeleton loader with shimmer animation
 */
const ShimmerBox = ({ children, ...props }: { children?: React.ReactNode } & Omit<BoxProps, 'children'>) => (
    <Box
        sx={{
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                transform: 'translateX(-100%)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                animation: 'shimmer 1.5s infinite',
            },
            '@keyframes shimmer': {
                '100%': {
                    transform: 'translateX(100%)',
                },
            },
            ...props.sx,
        }}
        {...props}
    >
        {children}
    </Box>
);

const CardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <ShimmerBox
            sx={{
                borderRadius: 4,
                p: 3,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Skeleton
                variant="circular"
                width={60}
                height={60}
                sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.06)' }}
            />
            <Skeleton
                variant="text"
                width="70%"
                height={32}
                sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.06)' }}
            />
            <Skeleton
                variant="text"
                width="50%"
                height={24}
                sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
            />
        </ShimmerBox>
    </motion.div>
);

const FormSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ShimmerBox sx={{ borderRadius: 2 }}>
                <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }}
                />
            </ShimmerBox>
            <ShimmerBox sx={{ borderRadius: 2 }}>
                <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)' }}
                />
            </ShimmerBox>
            <ShimmerBox sx={{ borderRadius: 3 }}>
                <Skeleton
                    variant="rectangular"
                    height={48}
                    sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)' }}
                />
            </ShimmerBox>
        </Box>
    </motion.div>
);

const ListSkeleton = ({ count = 3 }: { count?: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: count }).map((_, index) => (
                <ShimmerBox
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.02)',
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={24}
                            sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
                        />
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={18}
                            sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}
                        />
                    </Box>
                    <Skeleton
                        variant="text"
                        width={80}
                        height={28}
                        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
                    />
                </ShimmerBox>
            ))}
        </Box>
    </motion.div>
);

const DashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ShimmerBox
                        sx={{
                            height: 200,
                            borderRadius: 4,
                            p: 3,
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={60}
                            height={60}
                            sx={{ mb: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)' }}
                        />
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={28}
                            sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
                        />
                    </ShimmerBox>
                </motion.div>
            ))}
        </Box>
    </motion.div>
);

export default function SkeletonLoader({ variant = 'card', count = 1 }: SkeletonLoaderProps) {
    switch (variant) {
        case 'card':
            return <CardSkeleton />;
        case 'form':
            return <FormSkeleton />;
        case 'list':
            return <ListSkeleton count={count} />;
        case 'dashboard':
            return <DashboardSkeleton />;
        default:
            return <CardSkeleton />;
    }
}

export { CardSkeleton, FormSkeleton, ListSkeleton, DashboardSkeleton };
