import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import LaParrilla from './LaParrilla.png';
import { FaEye, FaSave, FaTimes, FaPlus, FaUtensils, FaDollarSign, FaUser, FaAddressCard, FaPhoneAlt } from 'react-icons/fa';

const DashboardEmpleado = () => {
    const [ventas, setVentas] = useState([]);
    const [horaActual, setHoraActual] = useState(new Date().toLocaleTimeString());
    const [platillos, setPlatillos] = useState([]);
    const [modal, setModal] = useState(false);
    const [platilloSeleccionado, setPlatilloSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [isv, setIsv] = useState(0);
    const [total, setTotal] = useState(0);
    const [tipoPedido, setTipoPedido] = useState('Llevar');
    const [nombreCliente, setNombreCliente] = useState('');
    const [rtn, setRtn] = useState('');
    const [direccion, setDireccion] = useState('');
    //const [showVentas, setShowVentas] = useState(false); // Estado para mostrar/ocultar las ventas
    const [modalVentas, setModalVentas] = useState(false); // Estado para controlar el modal de ventas
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    

    

    const isvRate = 0.15; // Tasa de ISV (15%)

    // Obtener platillos al cargar el componente
    const fetchPlatillos = async () => {
        try {
            const response = await axios.get('http://sql5.freesqldatabase.com:3306/platillos');
            setPlatillos(response.data);
        } catch (error) {
            console.error('Error al obtener los platillos:', error);
        }
    };

    // Obtener ventas al cargar el componente
    const fetchVentas = async () => {
        try {
            const response = await axios.get('http://sql5.freesqldatabase.com:3306/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    useEffect(() => {
        fetchPlatillos();
        fetchVentas();

        const interval = setInterval(() => {
            setHoraActual(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Actualizar subtotal, ISV y total cada vez que cambien el platillo o cantidad
    useEffect(() => {
        const selectedPlatillo = platillos.find((p) => p.nombre === platilloSeleccionado);
        if (selectedPlatillo) {
            const precio = selectedPlatillo.precio;
            setPrecioUnitario(precio);
            const newSubtotal = precio * cantidad;
            setSubtotal(newSubtotal);
            const newIsv = newSubtotal * isvRate;
            setIsv(newIsv);
            setTotal(newSubtotal + newIsv);
        }
    }, [platilloSeleccionado, cantidad, platillos]);

    // Manejar el envío del formulario de venta
    const handleAgregarVenta = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Iniciar la carga
        try {
            await axios.post('http://sql5.freesqldatabase.com:3306/agregar-venta', {
                platillo: platilloSeleccionado,
                cantidad,
                precioUnitario,
                subtotal,
                isv,
                total,
                tipoPedido,
                nombreCliente,
                rtn,
                direccion
            });
            setModal(false);
            fetchVentas();
            toastr.success('Venta registrada con éxito', 'Éxito', { positionClass: 'toast-top-right' });
        } catch (error) {
            console.error('Error al agregar la venta:', error);
            toastr.error('Error al registrar la venta', 'Error', { positionClass: 'toast-top-right' });
        }
        finally {
            setIsLoading(false); // Finaliza la carga
          }
    };

    const closeModal = () => {
        setModal(false);
        setPlatilloSeleccionado('');
        setCantidad(1);
        setPrecioUnitario(0);
        setSubtotal(0);
        setIsv(0);
        setTotal(0);
        setTipoPedido('Llevar');
        setNombreCliente('');
        setRtn('');
        setDireccion('');
    };

    return (
        <div className=" mx-auto px-4 bg-white rounded-3xl">
            <h1 className="text-3xl font-bold mb-6 text-center"></h1>

            <h2 className="text-xl mb-4 text-white text-right">
               {horaActual}</h2>
            <header className="bg-orange-500 p-4 flex justify-between items-center rounded-3xl">
                <h1 className="text-2xl font-bold text-white">LA PARRILLA</h1>
                <img src={LaParrilla} alt="Logo" className="w-20" />
            </header>
            <br />
            
            <button
        className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center 
          ${isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"}`}
        disabled={isLoading} // Deshabilitar el botón mientras está cargando
        onClick={() => setModal(true)}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          </svg>
        ) : (
          <>
            <FaPlus className="mr-2" /> Agregar Venta
          </>
        )}
      </button>
      <br></br>

            <button
    onClick={() => setModalVentas(true)} // Cambia el estado para abrir el modal
    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mb-4 flex items-center"
>
    <FaEye className="mr-2" /> Ver Ventas
</button>


           {/* Modal para agregar venta */}
{modal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-2xl font-semibold mb-4">Registrar Venta</h2>
            <form onSubmit={handleAgregarVenta} className="space-y-4">
                <div className="flex flex-wrap gap-4"> {/* Agrupar en filas */}
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2" htmlFor="platillo">
                            <FaUtensils className="inline mr-2" /> Platillo
                        </label>
                        <select
                            id="platillo"
                            value={platilloSeleccionado}
                            onChange={(e) => setPlatilloSeleccionado(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar platillo</option>
                            {platillos.map((platillo) => (
                                <option key={platillo.id} value={platillo.nombre}>
                                    {platillo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2" htmlFor="cantidad">
                            <FaDollarSign className="inline mr-2" /> Cantidad
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(Number(e.target.value))}
                            min="1"
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4"> {/* Agrupar en filas */}
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2">
                            <FaDollarSign className="inline mr-2" /> Precio Unitario
                        </label>
                        <input
                            type="number"
                            value={precioUnitario}
                            disabled
                            className="p-2 border rounded-md bg-gray-200"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2">
                            <FaDollarSign className="inline mr-2" /> Subtotal
                        </label>
                        <input
                            type="number"
                            value={subtotal}
                            disabled
                            className="p-2 border rounded-md bg-gray-200"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-4"> {/* Agrupar en filas */}
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2">
                            <FaDollarSign className="inline mr-2" /> ISV (15%)
                        </label>
                        <input
                            type="number"
                            value={isv}
                            disabled
                            className="p-2 border rounded-md bg-gray-200"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2">
                            <FaDollarSign className="inline mr-2" /> Total
                        </label>
                        <input
                            type="number"
                            value={total}
                            disabled
                            className="p-2 border rounded-md bg-gray-200"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="tipoPedido">
                        <FaUtensils className="inline mr-2" /> Tipo de Pedido
                    </label>
                    <select
                        id="tipoPedido"
                        value={tipoPedido}
                        onChange={(e) => setTipoPedido(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Llevar">Llevar</option>
                        <option value="Comer en el local">Comer en Local</option>
                    </select>
                </div>
                <div className="flex flex-wrap gap-4"> {/* Agrupar en filas */}
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2" htmlFor="nombreCliente">
                            <FaUser className="inline mr-2" /> Nombre del Cliente
                        </label>
                        <input
                            type="text"
                            id="nombreCliente"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transform focus:scale-105 transition-transform duration-300"
                            required
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="font-semibold mb-2" htmlFor="rtn">
                            <FaPhoneAlt className="inline mr-2" /> RTN
                        </label>
                        <input
                            type="text"
                            id="rtn"
                            value={rtn}
                            onChange={(e) => setRtn(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="direccion">
                        <FaAddressCard className="inline mr-2" /> Dirección
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    >
                        <FaSave className="mr-2" /> Guardar Venta
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center"
                    >
                        <FaTimes className="mr-2" /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
)}


   {/* Mostrar platillos disponibles */}
<h2 className="text-2xl font-semibold mb-4">Platillos Disponibles</h2>
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
    Precio con ISV: L. {(parseFloat(platillo.precio) * 1.15).toFixed(2)}
</p>

        </div>
    ))}
</div>
{modalVentas && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Ventas Realizadas</h2>
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-yellow-500 text-white">
                        <th className="border border-gray-300 p-2">Platillo</th>
                        <th className="border border-gray-300 p-2">Cantidad</th>
                        <th className="border border-gray-300 p-2">Subtotal</th>
                        <th className="border border-gray-300 p-2">ISV</th>
                        <th className="border border-gray-300 p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{venta.platillo}</td>
                            <td className="border border-gray-300 p-2">{venta.cantidad}</td>
                            <td className="border border-gray-300 p-2">{venta.subtotal}</td>
                            <td className="border border-gray-300 p-2">{venta.isv}</td>
                            <td className="border border-gray-300 p-2">{venta.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={() => setModalVentas(false)} // Cerrar el modal
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
                &#x2715;
            </button>
        </div>
    </div>
)}


        </div>
    );
};

export default DashboardEmpleado;
