
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API del Sistema de Facturación!');
});

app.post('/login', (req, res) => {
  const { nombre, password } = req.body;

  // Busca al usuario en la base de datos
  db.query('SELECT * FROM usuarios WHERE nombre = ?', [nombre], (error, results) => {
    if (error) return res.status(500).send('Error en la base de datos');
    if (results.length === 0) return res.status(400).send('Usuario no encontrado');

    const usuario = results[0];

    // Compara la contraseña directamente (sin encriptación)
    if (password !== usuario.password) return res.status(400).send('Contraseña incorrecta');

    // Devuelve el usuario y su rol en la respuesta
    res.json({
      message: 'Inicio de sesión exitoso',
      token: 'dummy-token', // Aquí deberías generar un token real si lo necesitas
      rol: usuario.rol // Enviar el rol del usuario
    });
  });
});
// Función para agregar un nuevo usuario (sin encriptar la contraseña)
const addUser = (nombre, password, rol) => {
  db.query(
    'INSERT INTO usuarios (nombre, password, rol) VALUES (?, ?, ?)',
    [nombre, password, rol],
    (error, result) => {
      if (error) return console.error('Error al agregar usuario:', error.message);
      console.log('Usuario agregado con ID:', result.insertId);
    }
  );
};

// Llama a esta función para agregar el usuario
// addUser('empleado', 'laparrilla', 'empleado');

// Obtener todos los platillos
app.get('/platillos', (req, res) => {
  db.query('SELECT * FROM platillos', (err, results) => {
      if (err) {
          return res.status(500).send('Error al obtener platillos');
      }
      res.json(results);
  });
});

// Agregar un nuevo platillo
app.post('/agregar-platillo', (req, res) => {
  const { nombre, descripcion, precio, foto } = req.body;
  const query = 'INSERT INTO platillos (nombre, descripcion, precio, foto) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, foto], (err, results) => {
      if (err) {
          return res.status(500).send('Error al agregar el platillo');
      }
      res.status(201).send('Platillo agregado con éxito');
  });
});

// Editar un platillo existente
app.put('/editar-platillo/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, foto } = req.body;
  const query = 'UPDATE platillos SET nombre = ?, descripcion = ?, precio = ?, foto = ? WHERE id = ?';
  db.query(query, [nombre, descripcion, precio, foto, id], (err, results) => {
      if (err) {
          return res.status(500).send('Error al editar el platillo');
      }
      res.send('Platillo editado con éxito');
  });
});

// Eliminar un platillo
app.delete('/eliminar-platillo/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM platillos WHERE id = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).send('Error al eliminar el platillo');
      }
      res.send('Platillo eliminado con éxito');
  });
});

// Obtener todas las ventas
app.get('/ventas', (req, res) => {
  db.query('SELECT * FROM ventas', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener ventas');
    }
    res.json(results);
  });
});

app.post('/agregar-venta', (req, res) => {
  const { platillo, tipoPedido, nombreCliente, rtn, direccion, cantidad, precioUnitario } = req.body;

  // Calcular subtotal, ISV (15%) y total
  const subtotal = cantidad * precioUnitario;
  const isv = subtotal * 0.15;
  const total = subtotal + isv;

  // Consulta SQL para insertar la venta, incluyendo subtotal, isv y total
  const query = `INSERT INTO ventas (platillo, tipoPedido, nombreCliente, rtn, direccion, cantidad, precioUnitario, subtotal, isv, total, fecha) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  db.query(query, [platillo, tipoPedido, nombreCliente, rtn, direccion, cantidad, precioUnitario, subtotal, isv, total], (error, results) => {
      if (error) {
          console.error('Error al agregar la venta:', error); // Loguear el error
          return res.status(500).send('Error al agregar la venta');
      }
      res.status(200).send('Venta agregada correctamente');
  });
});


// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
