import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const DashboardUnderConstruction: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <ConstructionIcon sx={{ fontSize: 80, color: '#f57c00' }} />
            <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                This page is temporarily unavailable.
            </Typography>
            <Box sx={{ marginTop: 2 }}>
                <CircularProgress color="primary" />
            </Box>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
                I am currently working on it to make it available soon. Please check back later.
            </Typography>
        </Box>
    );
};

export default DashboardUnderConstruction;
