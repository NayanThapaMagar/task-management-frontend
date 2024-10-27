import React from 'react';
import Navbar from '../components/PublicNavbar';
import { Outlet } from 'react-router-dom'; 

const PublicLayout: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Outlet /> 
        </div>
    );
};

export default PublicLayout;
