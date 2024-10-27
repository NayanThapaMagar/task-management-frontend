import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navbar from '../components/MainNavbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const MainLayout: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const isLoggedIn = !!token;

    return isLoggedIn ? (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, mt: 8 }}> 
                <Outlet />
            </Box>
        </Box>
    ) : (
        <Navigate to="/home" />
    );
};

export default MainLayout;
