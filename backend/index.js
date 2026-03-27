
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()')
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => {
    console.error('Error de conexión', err);
    process.exit(1);
  });
  
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API del Sistema de Facturación!');
});

app.post('/login', async (req, res) => {
  const { nombre, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE nombre = $1',
      [nombre]
    );

    if (result.rows.length === 0)
      return res.status(400).send('Usuario no encontrado');

    const usuario = result.rows[0];

    if (password !== usuario.password)
      return res.status(400).send('Contraseña incorrecta');

    res.json({
      message: 'Inicio de sesión exitoso',
      token: 'dummy-token',
      rol: usuario.rol
    });

  } catch (error) {
    res.status(500).send('Error en la base de datos');
  }
});
// Función para agregar un nuevo usuario (sin encriptar la contraseña)
const addUser = async (nombre, password, rol) => {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, password, rol) VALUES ($1, $2, $3) RETURNING id',
      [nombre, password, rol]
    );

    console.log('Usuario agregado con ID:', result.rows[0].id);
  } catch (error) {
    console.error('Error al agregar usuario:', error.message);
  }
};

// Llama a esta función para agregar el usuario
// addUser('empleado', 'laparrilla', 'empleado');

app.get('/platillos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM platillos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener platillos');
  }
});

app.post('/agregar-platillo', async (req, res) => {
  const { nombre, descripcion, precio, foto } = req.body;

  try {
    await pool.query(
      'INSERT INTO platillos (nombre, descripcion, precio, foto) VALUES ($1, $2, $3, $4)',
      [nombre, descripcion, precio, foto]
    );

    res.status(201).send('Platillo agregado con éxito');
  } catch (err) {
    res.status(500).send('Error al agregar el platillo');
  }
});
// Editar un platillo existente
app.put('/editar-platillo/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, foto } = req.body;

  try {
    await pool.query(
      'UPDATE platillos SET nombre=$1, descripcion=$2, precio=$3, foto=$4 WHERE id=$5',
      [nombre, descripcion, precio, foto, id]
    );

    res.send('Platillo editado con éxito');
  } catch (err) {
    res.status(500).send('Error al editar el platillo');
  }
});

// Eliminar un platillo
app.delete('/eliminar-platillo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM platillos WHERE id=$1', [id]);
    res.send('Platillo eliminado con éxito');
  } catch (err) {
    res.status(500).send('Error al eliminar el platillo');
  }
});

// Obtener todas las ventas
app.get('/ventas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ventas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener ventas');
  }
});
app.post('/agregar-venta', async (req, res) => {
  const { platillo, tipoPedido, nombreCliente, rtn, direccion, cantidad, precioUnitario } = req.body;

  const subtotal = cantidad * precioUnitario;
  const isv = subtotal * 0.15;
  const total = subtotal + isv;

  try {
    await pool.query(
      `INSERT INTO ventas 
       (platillo, tipopedido, nombrecliente, rtn, direccion, cantidad, preciounitario, subtotal, isv, total, fecha)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())`,
      [platillo, tipoPedido, nombreCliente, rtn, direccion, cantidad, precioUnitario, subtotal, isv, total]
    );

    res.status(200).send('Venta agregada correctamente');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la venta');
  }
});
// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
