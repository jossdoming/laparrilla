import React, { useState } from 'react';
import api from './services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importa el contexto
import { FaUserAlt, FaLock } from 'react-icons/fa';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Obtén el método para establecer el usuario

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { nombre, password });
      
      const { token, rol } = response.data;
      localStorage.setItem('token', token);

      setUser({ nombre, rol }); // Establece el usuario en el contexto

      if (rol === 'administrador') {
        navigate('/dashboard');
      } else if (rol === 'empleado') {
        navigate('/dashboardempleado');
      } else {
        alert('Rol no reconocido');
      }
      
    } catch (error) {
      console.error(error);
      alert('Error en el inicio de sesión.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Hola Eber</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nombre:</label>
          <div className="flex items-center border rounded w-full py-2 px-3">
            <FaUserAlt className="text-gray-400 mr-2" />
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              className="w-full outline-none" 
              placeholder="Ingrese su nombre"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Contraseña:</label>
          <div className="flex items-center border rounded w-full py-2 px-3">
            <FaLock className="text-gray-400 mr-2" />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full outline-none" 
              placeholder="Ingrese su contraseña"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 transition duration-200 flex items-center justify-center"
        >
          <FaLock className="mr-2" />
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;



