const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.DB_USER, // Usuario de la base de datos
  host: process.env.DB_HOST, // Host de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  port: Number(process.env.DB_PORT), // Puerto de conexión (por defecto es 5432)
});

// Verificar la conexión
pool.connect((err) => {
  if (err) {
    console.error('Error al conectar con PostgreSQL:', err);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
  }
});


module.exports = pool;