import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import DashboardAdmin from './DashboardAdmin';
import DashboardEmpleado from './DashboardEmpleado';
import PrivateRoute from './PrivateRoute'; // Asegúrate de que la ruta sea correcta

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <DashboardAdmin />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/dashboardempleado" 
                    element={
                        <PrivateRoute>
                            <DashboardEmpleado />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;




