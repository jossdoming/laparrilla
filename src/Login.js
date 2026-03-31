import React, { useState } from 'react';
import api from './services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/login', { nombre, password });

      const { token, rol } = response.data;
      localStorage.setItem('token', token);

      setUser({ nombre, rol });

      if (rol === 'administrador') {
        navigate('/dashboard');
      } else if (rol === 'empleado') {
        navigate('/dashboardempleado');
      } else {
        setError('Rol no reconocido');
      }

    } catch (error) {
      console.error(error);
      setError('Credenciales incorrectas o error del servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Iniciar sesión
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Accede a tu panel administrativo
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Usuario */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-1">Usuario</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FaUserAlt className="text-gray-400 mr-2" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ingrese su usuario"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-1">Contraseña</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingrese su contraseña"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition duration-200 font-medium"
          >
            Ingresar
          </button>

        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} Sistema Corporativo
        </p>

      </div>
    </div>
  );
};

export default Login;



