import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Importa los estilos de Toastr
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa'; // Importar iconos
import LaParrilla from './LaParrilla.png';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar esto
 




const DashboardAdmin = () => {
    
    const navigate = useNavigate(); // Llamar aquí para evitar el error
    const { setUser } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token
        setUser(null); // Limpia el usuario en el contexto
        navigate('/'); // Redirige a la página de inicio de sesión
    };
    // Estados para almacenar los valores del formulario y controlar modales
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [foto, setFoto] = useState('');
    const [platillos, setPlatillos] = useState([]);
    const [platilloEditado, setPlatilloEditado] = useState(null); // Estado para almacenar el platillo que se está editando
    const [platillosEliminar, setPlatillosEliminar] = useState([]); // Estado para almacenar los platillos seleccionados para eliminar
    const [modal, setModal] = useState(''); // Controlar el modal abierto: 'agregar', 'editar', 'eliminar'
    const [loading, setLoading] = useState(false); // Estado de carga
    const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas

    // Función para obtener los platillos de la base de datos
    const fetchPlatillos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://sql5.freesqldatabase.com:3306/platillos');
            setPlatillos(response.data);
            toastr.success('Platillos cargados con éxito');
        } catch (error) {
            console.error('Error al obtener los platillos:', error);
            toastr.error('Error al obtener los platillos');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener las ventas
    const fetchVentas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://sql5.freesqldatabase.com:3306/ventas');
            setVentas(response.data);
            toastr.success('Ventas cargadas con éxito');
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
            toastr.error('Error al obtener las ventas');
        } finally {
            setLoading(false);
        }
    };

    // Llama a fetchPlatillos cuando el componente se monta
    useEffect(() => {
        fetchPlatillos();
    }, []);

    // Manejar el envío del formulario de agregar platillo
    const handleAddPlatillo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://sql5.freesqldatabase.com:3306/agregar-platillo', {
                nombre,
                descripcion,
                precio,
                foto
            });
            resetForm();
            fetchPlatillos();
            setModal('');
            toastr.success('Platillo agregado con éxito');
        } catch (error) {
            console.error('Error al agregar el platillo:', error);
            toastr.error('Error al agregar el platillo');
        } finally {
            setLoading(false);
        }
    };



    // Manejar el envío del formulario de editar platillo
    const handleEditPlatillo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://sql5.freesqldatabase.com:3306/editar-platillo/${platilloEditado.id}`, {
                nombre,
                descripcion,
                precio,
                foto
            });
            resetForm();
            fetchPlatillos();
            setModal('');
            setPlatilloEditado(null);
            toastr.success('Platillo editado con éxito');
        } catch (error) {
            console.error('Error al editar el platillo:', error);
            toastr.error('Error al editar el platillo');
        } finally {
            setLoading(false);
        }
    };

    // Manejar el envío del formulario de eliminar platillo
    const handleDeletePlatillos = async () => {
        setLoading(true);
        try {
            await Promise.all(platillosEliminar.map(async (platilloId) => {
                await axios.delete(`http://sql5.freesqldatabase.com:3306/eliminar-platillo/${platilloId}`);
            }));
            fetchPlatillos();
            setPlatillosEliminar([]);
            setModal('');
            toastr.success('Platillos eliminados con éxito');
        } catch (error) {
            console.error('Error al eliminar platillos:', error);
            toastr.error('Error al eliminar platillos');
        } finally {
            setLoading(false);
        }
    };

    // Manejar el cierre de modales
    const closeModal = () => {
        setModal('');
        resetForm();
    };

    // Manejar la apertura del modal de ventas
    const openVentasModal = () => {
        fetchVentas();
        setModal('ventas');
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setFoto('');
        setPlatilloEditado(null);
    };

    // Manejar la selección de platillos para eliminar
    const handleCheckPlatillo = (id) => {
        setPlatillosEliminar((prev) =>
            prev.includes(id) ? prev.filter((platilloId) => platilloId !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Encabezado */}
            <header className="bg-yellow-500 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">LA PARRILLA</h1>
                <img src={LaParrilla} alt="Logo" className="w-20" />
            </header>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Botones de Acciones */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setModal('agregar')}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center"
                    >
                        <FaPlus className="mr-2" /> Agregar Platillo
                    </button>

                    <button
                        onClick={openVentasModal}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center"
                    >
                        <FaEye className="mr-2" /> Ver Ventas
                    </button>

                    <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
                    <FaTimes className="mr-2" />Cerrar Sesión
</button>
                    
                </div>

                {/* Mostrar cargando */}
                {loading && (
                    <div className="flex justify-center">
                        <div className="loader">Cargando...</div>
                    </div>
                )}

                {/* Listado de Platillos */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Platillos Vigentes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {platillos.map((platillo) => (
                            <div key={platillo.id} className="bg-white p-4 border rounded-md shadow-md">
                                <img
                                    src={platillo.foto}
                                    alt={platillo.nombre}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <h3 className="text-xl font-semibold">{platillo.nombre}</h3>
                                <p className="text-gray-700">{platillo.descripcion}</p>
                                <p className="text-lg font-bold text-green-600 mt-2">
                                    Precio: L. {parseFloat(platillo.precio).toFixed(2)}
                                </p>
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => {
                                            setPlatilloEditado(platillo);
                                            setNombre(platillo.nombre);
                                            setDescripcion(platillo.descripcion);
                                            setPrecio(platillo.precio);
                                            setFoto(platillo.foto);
                                            setModal('editar');
                                        }}
                                        className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCheckPlatillo(platillo.id);
                                            setModal('eliminar');
                                        }}
                                        className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition-colors flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modales */}
            {/* Modal de Agregar Platillo */}
            {modal === 'agregar' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-2xl font-semibold mb-4">Agregar Nuevo Platillo</h2>
                        <form onSubmit={handleAddPlatillo} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="nombre">Nombre del Platillo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="foto">URL de la Foto</label>
                                <input
                                    type="text"
                                    id="foto"
                                    value={foto}
                                    onChange={(e) => setFoto(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &#x2715;
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Editar Platillo */}
            {modal === 'editar' && platilloEditado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-2xl font-semibold mb-4">Editar Platillo</h2>
                        <form onSubmit={handleEditPlatillo} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="nombre">Nombre del Platillo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    id="precio"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2" htmlFor="foto">URL de la Foto</label>
                                <input
                                    type="text"
                                    id="foto"
                                    value={foto}
                                    onChange={(e) => setFoto(e.target.value)}
                                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Editar
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &#x2715;
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Eliminar Platillo */}
            {modal === 'eliminar' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-2xl font-semibold mb-4">Eliminar Platillos</h2>
                        <p className="mb-4">¿Estás seguro de que deseas eliminar los platillos seleccionados?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeletePlatillos}
                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &#x2715;
                        </button>
                    </div>
                </div>
            )}

{modal === 'ventas' && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold mb-4">Ventas Registradas</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Cliente</th>
                        <th className="py-2 px-4 border-b text-left">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td className="py-2 px-4 border-b">{venta.nombreCliente}</td>
                            <td className="py-2 px-4 border-b font-bold">{venta.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => setModal('')}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                &#x2715;
            </button>
        </div>
    </div>
)}


        </div>
    );
};

export default DashboardAdmin;



