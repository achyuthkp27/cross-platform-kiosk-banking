import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'expo-router';
import LanguageSelector from '../src/components/language/LanguageSelector';
import { useLanguage } from '../src/context/LanguageContext';
import { motion } from 'framer-motion';

export default function LandingScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '600px',
                    height: '600px',
                    background: 'rgba(25, 118, 210, 0.05)',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    zIndex: 0,
                }}
            />

            <Box sx={{ position: 'absolute', top: 40, right: 40, zIndex: 10 }}>
                <LanguageSelector />
            </Box>

            <Container maxWidth="md" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center' }}
                >
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            style={{
                                width: 100,
                                height: 100,
                                backgroundColor: '#1976d2',
                                borderRadius: 24,
                                boxShadow: '0 20px 40px rgba(25, 118, 210, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            KB
                        </motion.div>
                    </Box>

                    <Typography
                        variant="h1"
                        color="primary"
                        sx={{
                            mb: 2,
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            fontSize: { xs: '3rem', md: '5rem' }
                        }}
                    >
                        {t('landing.welcome')}
                    </Typography>

                    <Typography
                        variant="h4"
                        color="text.secondary"
                        sx={{
                            mb: 8,
                            fontWeight: 400,
                            maxWidth: '80%',
                            mx: 'auto',
                            lineHeight: 1.4
                        }}
                    >
                        {t('landing.tagline')}
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => router.push('/login')}
                        sx={{
                            fontSize: '1.5rem',
                            padding: '24px 80px',
                            borderRadius: 4,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            boxShadow: '0 15px 30px rgba(25, 118, 210, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 20px 40px rgba(25, 118, 210, 0.5)',
                            }
                        }}
                    >
                        {t('landing.start')}
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
}
