    import React from 'react';
    import { Navigate } from 'react-router-dom';

    export default function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    return isAuthenticated ? children : <Navigate to="/" />;
    }