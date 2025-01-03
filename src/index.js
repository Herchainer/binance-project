const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const binanceRouters = require('./routes/binanceRoutes');
const { binanceLogin } = require('./controllers/binanceControllers');
const {consult_user} = require('./controllers/userController')



app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);

});

consult_user()

//binanceLogin()


// Acceder a la variable DB_HOST
//console.log(process.env.DB_HOST); 
//console.log(process.env.PORT);
