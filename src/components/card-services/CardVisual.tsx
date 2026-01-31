import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Card } from '../../types/card';

interface CardVisualProps {
    card: Card;
    isSelected: boolean;
    onClick?: () => void;
}

const CardVisual: React.FC<CardVisualProps> = ({ card, isSelected, onClick }) => {
    // Network logo placeholder (can be replaced with SVGs)
    const getNetworkLogo = () => {
        switch (card.network) {
            case 'VISA': return 'VISA';
            case 'MASTERCARD': return 'MASTERCARD';
            case 'RUPAY': return 'RuPay';
            default: return '';
        }
    };

    // Format card number with masking and spacing
    const formatCardNumber = (num: string) => {
        const clean = num.replace(/\D/g, '');
        if (clean.length === 16) {
            return `${clean.slice(0, 4)} **** **** ${clean.slice(12)}`;
        }
        // Fallback or credit card if different length
        return num.replace(/(.{4})/g, '$1 ').trim();
    };

    return (
        <motion.div
            layout // Enable layout animation for smooth sorting/movement
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: isSelected ? 1.05 : 0.95,
                opacity: isSelected ? 1 : 0.7,
                y: isSelected ? 0 : 10
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            whileHover={{ scale: isSelected ? 1.08 : 0.98, y: -5 }}
            style={{
                width: 340,
                height: 215,
                cursor: 'pointer',
                margin: '0 10px',
                flexShrink: 0
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${card.color || '#374151'} 0%, ${alpha(card.color || '#374151', 0.6)} 100%)`,
                    boxShadow: isSelected
                        ? `0 20px 40px ${alpha(card.color || '#374151', 0.4)}`
                        : '0 10px 20px rgba(0,0,0,0.1)',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {/* Background Pattern */}
                <Box sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                }} />

                {/* Top Row: Chip & Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                    {/* EMV Chip Simulation */}
                    <Box sx={{
                        width: 45,
                        height: 34,
                        background: 'linear-gradient(135deg, #d4af37 0%, #f9e076 50%, #d4af37 100%)',
                        borderRadius: '6px',
                        border: '1px solid rgba(0,0,0,0.1)',
                    }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ 
                            color: 'rgba(255,255,255,0.9)', 
                            fontWeight: 'bold', 
                            fontSize: '0.7rem',
                            letterSpacing: '0.05em'
                        }}>
                            {card.type} CARD
                        </Typography>
                        {card.status === 'BLOCKED' && (
                            <Box sx={{
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: '#ff4444',
                                px: 1,
                                py: 0.2,
                                borderRadius: 4,
                                border: '1px solid #ff4444',
                                fontSize: '0.65rem',
                                fontWeight: 'bold'
                            }}>
                                BLOCKED
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Card Number */}
                <Typography variant="h5" sx={{
                    color: '#fff',
                    letterSpacing: '0.15em',
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    zIndex: 1,
                    mt: 2
                }}>
                    {formatCardNumber(card.number)}
                </Typography>

                {/* Bottom Row: Details & Network */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            Card Holder
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, letterSpacing: '0.05em' }}>
                            {card.holderName}
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                Expires
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                {card.expiryDate}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h6" sx={{
                        color: '#fff',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        opacity: 0.9
                    }}>
                        {getNetworkLogo()}
                    </Typography>
                </Box>
            </Box>
        </motion.div>
    );
};

export default CardVisual;
