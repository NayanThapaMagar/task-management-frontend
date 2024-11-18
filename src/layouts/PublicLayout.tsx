import React from 'react';
import Navbar from '../components/Navbar/PublicNavbar';
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
