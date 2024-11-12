import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Task from './pages/Task/TaskList';
import AddTask from './pages/Task/AddTask';
import TaskDetail from './pages/Task/TaskDetail';
import UserConnection from './pages/userConnection';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';

const App: React.FC = () => {
    return (
        <>
            <Routes>
                {/* main layout renders only if user is logged in */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Task />} />
                    <Route path="/tasks/addTask" element={<AddTask />} />
                    <Route path="/tasks/detail" element={<TaskDetail />} />
    
                    <Route path="/userConnection" element={<UserConnection />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<PublicLayout />}>
                    <Route path="/home" element={<Home />} /> 
                </Route>

            </Routes>
        </>
    );
};

export default App;
