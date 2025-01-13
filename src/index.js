const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const binanceRouters = require('./routes/binanceRoutes');
const { binanceLogin } = require('./controllers/binanceControllers');
//const {consult_user} = require('./controllers/userController')
const userRoutes = require('./routes/userRoutes')

app.use(express.json());
// Usar las rutas definidas en userRoutes
app.use('/api/users', userRoutes);


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);

});


