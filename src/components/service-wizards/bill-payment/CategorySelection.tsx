import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { ElectricBolt, WaterDrop, Smartphone, Wifi, LocalGasStation } from '@mui/icons-material';

const CATEGORIES = [
    { id: 'electricity', name: 'Electricity', icon: <ElectricBolt fontSize="large" /> },
    { id: 'water', name: 'Water', icon: <WaterDrop fontSize="large" /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone fontSize="large" /> },
    { id: 'internet', name: 'Internet', icon: <Wifi fontSize="large" /> },
    { id: 'gas', name: 'Gas', icon: <LocalGasStation fontSize="large" /> },
];

interface CategorySelectionProps {
    selectedCategory?: string;
    handleCategorySelect: (id: string) => void;
    onCancel: () => void;
    isDark: boolean;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({ selectedCategory, handleCategorySelect, onCancel, isDark }) => {
    return (
        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Typography variant="h6" gutterBottom align="left">Select Category</Typography>
            <Grid container spacing={3}>
                {CATEGORIES.map((cat) => (
                    <Grid size={{ xs: 6, md: 4 }} key={cat.id}>
                        <Card
                            sx={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 2,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: cat.id === selectedCategory ? 'primary.main' : 'transparent',
                                bgcolor: cat.id === selectedCategory 
                                    ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(25, 118, 210, 0.05)')
                                    : (isDark ? 'rgba(15, 23, 42, 0.6)' : 'background.paper'),
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.02)',
                                    transform: 'translateY(-4px)',
                                    borderColor: 'primary.main'
                                },
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => handleCategorySelect(cat.id)}
                        >
                            <CardContent>
                                <Box sx={{ color: 'primary.main', mb: 2 }}>{cat.icon}</Box>
                                <Typography variant="h6" fontWeight="bold">{cat.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    size="large"
                    sx={{ height: 56, minWidth: 200, borderRadius: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </motion.div>
    );
};
