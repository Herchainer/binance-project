const { Query } = require('pg');
const pool = require('../config/config');
const jwt = require('jsonwebtoken');


const consult_user = async (req, res) => {

    const {document} = req.body;

    try {
        const consult = await pool.query(`select * from users where document = $1`, [document])

        if (consult.rows.length == 0) {
            return res.json({
                data: 'Usuario no existe' 
              }); 
        }

        return res.json({
        data: consult.rows // Enviar los datos al cliente
      });   
    } catch (error) {

    return res.status(500).json({
      error: 'Error en la consulta a la base de datos'
    });
    }  
} 

const login = async (req, res) => {
    const { email } = req.body;

    try {
        // Paso 1: Verificar si el correo existe en la base de datos
        const consult = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (consult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = consult.rows[0];

        // Paso 2: Verificar la contraseña (si está almacenada como hash)
        // const passwordMatch = await bcrypt.compare(password, user.password);
        // if (!passwordMatch) {
        //     return res.status(401).json({ message: 'Contraseña incorrecta' });
        // }

        // Paso 3: Generar un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Reemplaza con una clave secreta segura
            { expiresIn: '1h' } // Expiración del token
        );

        // Paso 4: Enviar respuesta al cliente
        return res.json({
            message: 'Login exitoso',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



module.exports = {
    consult_user,
    login
}