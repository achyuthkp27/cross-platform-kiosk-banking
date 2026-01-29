import React, { useEffect, useState } from 'react';
import { Box, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
    rotation: number;
}

interface ConfettiProps {
    show: boolean;
    duration?: number;
    pieceCount?: number;
    colors?: string[];
    onComplete?: () => void;
}

const defaultColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#00D4FF'
];

/**
 * Premium confetti celebration animation
 */
export default function Confetti({
    show,
    duration = 3000,
    pieceCount = 100,
    colors = defaultColors,
    onComplete,
}: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            // Generate confetti pieces
            const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }).map((_, i) => ({
                id: i,
                x: Math.random() * 100, // percentage across screen
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 12,
                rotation: Math.random() * 360,
            }));
            setPieces(newPieces);
            setIsVisible(true);

            // Cleanup after duration
            const timer = setTimeout(() => {
                setIsVisible(false);
                setPieces([]);
                onComplete?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, pieceCount, colors, onComplete]);

    if (!isVisible || pieces.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 10001,
                overflow: 'hidden',
            }}
        >
            {pieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{
                        x: `${piece.x}vw`,
                        y: '-20px',
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: '110vh',
                        rotate: piece.rotation + 720,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{
                        position: 'absolute',
                        width: piece.size,
                        height: piece.size * 0.6,
                        backgroundColor: piece.color,
                        borderRadius: '2px',
                        boxShadow: `0 2px 8px ${alpha(piece.color, 0.4)}`,
                    }}
                />
            ))}
        </Box>
    );
}

/**
 * Hook for easy confetti triggering
 */
export const useConfetti = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    const triggerConfetti = () => {
        setShowConfetti(true);
    };

    const hideConfetti = () => {
        setShowConfetti(false);
    };

    return { showConfetti, triggerConfetti, hideConfetti };
};
