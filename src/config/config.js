require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Opcional: evita mostrar las consultas en la consola
});

// Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL con Sequelize');
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
  }
})();

module.exports = sequelize;