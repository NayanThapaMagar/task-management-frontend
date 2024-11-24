import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppStateProvider } from "../context/AppStateContext";
import Navbar from '../components/Navbar/MainNavbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import { initializeSocket, destroySocket } from '../socktes/socket';

const MainLayout: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const isLoggedIn = !!token;

    useEffect(() => {
        if (token) {
            initializeSocket(token);
        }
        return () => {
            destroySocket();
        }
    }, []);

    return isLoggedIn ? (
        <AppStateProvider>
            <Box sx={{ display: 'flex' }}>
                <Navbar />
                <Box sx={{ flexGrow: 1, mt: 8 }}>
                    <Outlet />
                </Box>
            </Box>
        </AppStateProvider>
    ) : (
        <Navigate to="/login" />
    );
};

export default MainLayout;
