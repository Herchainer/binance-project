const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Acceder a la variable DB_HOST
console.log(process.env.DB_HOST); 
console.log(process.env.PORT);
