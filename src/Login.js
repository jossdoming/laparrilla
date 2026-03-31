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

      if (rol === 'administrador') navigate('/dashboard');
      else if (rol === 'empleado') navigate('/dashboardempleado');
      else setError('Rol no reconocido');

    } catch (error) {
      setError('Credenciales incorrectas o error del servidor');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* Fondo animado */}
      <div className="absolute inset-0 animate-gradient bg-[linear-gradient(270deg,#0f172a,#020617,#1e293b,#020617)] bg-[length:600%_600%] opacity-90"></div>

      {/* Efecto blur overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl"></div>

      {/* Card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">

        <h2 className="text-2xl font-semibold text-white text-center mb-2 tracking-wide">
          Acceso Seguro
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Plataforma corporativa
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Usuario */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 block mb-1">Usuario</label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
              <FaUserAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ingrese su usuario"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-1">Contraseña</label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingrese su contraseña"
                className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            Ingresar
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          © {new Date().getFullYear()} Sistema Corporativo
        </p>
      </div>

      {/* Animación custom */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            animation: gradient 12s ease infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
