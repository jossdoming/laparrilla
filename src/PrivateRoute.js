import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asegúrate de que esta ruta sea correcta

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;


