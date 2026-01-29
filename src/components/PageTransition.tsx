import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export type TransitionVariant = 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';

interface PageTransitionProps {
    children: React.ReactNode;
    variant?: TransitionVariant;
    duration?: number;
    className?: string;
}

const variants: Record<TransitionVariant, Variants> = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slide: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
    },
    slideUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    },
    slideDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 30 },
    },
};

/**
 * Premium page transition wrapper with multiple animation variants
 */
export default function PageTransition({
    children,
    variant = 'slideUp',
    duration = 0.4,
    className,
}: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants[variant]}
            transition={{
                duration,
                ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
            }}
            className={className}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Staggered children animation wrapper
 */
export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    delayChildren = 0.2,
}: {
    children: React.ReactNode;
    staggerDelay?: number;
    delayChildren?: number;
}) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Individual stagger item
 */
export const StaggerItem = ({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) => {
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 300,
                delay,
            },
        },
    };

    return (
        <motion.div variants={itemVariants}>
            {children}
        </motion.div>
    );
};

/**
 * Hover scale effect wrapper
 */
export const HoverScale = ({
    children,
    scale = 1.02,
    tapScale = 0.98,
}: {
    children: React.ReactNode;
    scale?: number;
    tapScale?: number;
}) => {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: tapScale }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Pulse animation for attention-grabbing elements
 */
export const Pulse = ({
    children,
    scale = 1.05,
    duration = 2,
}: {
    children: React.ReactNode;
    scale?: number;
    duration?: number;
}) => {
    return (
        <motion.div
            animate={{
                scale: [1, scale, 1],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * Floating animation for decorative elements
 */
export const Float = ({
    children,
    yOffset = 10,
    duration = 3,
}: {
    children: React.ReactNode;
    yOffset?: number;
    duration?: number;
}) => {
    return (
        <motion.div
            animate={{
                y: [-yOffset, yOffset, -yOffset],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    );
};
