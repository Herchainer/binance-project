const pool = require('../config/config');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');

const consult_user = async (req, res) => {

    const {document} = req.body;

    try {
        const consult = await pool.query(`
            select * from users where document = :document`, 
            { replacements:
                {document},
                type: QueryTypes.SELECT,
                plain: true})

        // Verificar si el usuario existe
        if (!consult) {
            return res.json({
                status: 13,
                data: 'Usuario no existe',
            });
        };

        return res.json({
            status: 10,
            data: consult, // El resultado ya es un arreglo
          }); 
    } catch (error) {

    return res.status(500).json({
        status: 500,
        error: 'Error en la consulta a la base de datos'
    });
    }  
} 

const login = async (req, res) => {
    const { email } = req.body;

    try {
        // Paso 1: Verificar si el correo existe en la base de datos
        const consult = await pool.query(`SELECT * FROM users WHERE email = :email`, {replacements: { email}, type: QueryTypes.SELECT, plain: true });

        if (consult.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = consult;

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

const register_user = async (req, res) => {

    const { document, name, email, phone  } = req.body;

    if( !document ||  !name || !email ||  !phone) {
        return res.json({
            status: 12,
            data: 'Faltan parametros' 
          }); 
    }

    console.log(document, name, email, phone)
    return;

    try {
        const register = await pool.query(`select * from register_user(
            :document,
            :name,
            :email,
            :phone
            )`, {
                replacements: { 
                    document,
                    name,
                    email,
                    phone
                },
                type: QueryTypes.SELECT,
                plain: true
            })

        if (register.code == 13) {
            return res.json({
                status: 13,
                data: 'Usuario no existe' 
              }); 
        }

        return res.json({
            status: 10,
            data: consult.rows // Enviar los datos al cliente
      });   
    } catch (error) {

    return res.status(500).json({
        status: 500,
        error: 'Error en la consulta a la base de datos'
    });
    }  




}



module.exports = {
    consult_user,
    login,
    register_user
}