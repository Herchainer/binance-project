const pool = require('../config/config');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
    const { email, password  } = req.body;

    if( !email || !password) {
        return res.json({
            status: 12,
            data: 'Faltan parametros' 
          }); 
    }

    try {
        //Verificar si el correo existe en la base de datos
        const consult = await pool.query(`
            SELECT 
                id,
                email, 
                password 
            FROM users
            WHERE email = :email `, {replacements: { email}, type: QueryTypes.SELECT, plain: true });

        if (!consult) {
            return res.json({
                status: 13,
                message: 'Usuario no encontrado'
                });
        }

        const user = consult;

        //Verificar la contraseña (si está almacenada como hash)
         const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
             return res.json({
                status: 14,
                message: 'Contraseña incorrecta' 
                });
        }

        //Verificar si ya existe un token válido
        const existingToken = await pool.query(`
            SELECT 
                token, 
                expires_at
            FROM users_tokens
            WHERE user_id = :user_id
            --AND expires_at > NOW()
            ORDER BY id desc
            LIMIT 1`,
            { replacements: { user_id: user.id }, type: QueryTypes.SELECT, plain: true }
        );

        if(!existingToken){
            const token = jwt.sign(
                { id: user.id, email: user.email }, // Payload
                process.env.JWT_SECRET, // Reemplaza con una clave secreta segura
                { expiresIn: '1h' } // Expiración del token
            );

            //Guardar el token en la base de datos
            const expiresAt = new Date(Date.now() + 3600000); // 1 hora en milisegundos
            await pool.query(`
                INSERT INTO users_tokens (user_id, token, expires_at)
                VALUES (:user_id, :token, :expires_at)`,
                {
                    replacements: {
                        user_id: user.id,
                        token,
                        expires_at: expiresAt,
                    },
                    type: QueryTypes.INSERT,
                }
            );

            //Enviar respuesta al cliente
            return res.json({
                status: 10,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            });

        } else {
            const currentDate = new Date().toISOString();
            // Convertir a objetos Date para comparar
            const tokenDate = new Date(existingToken.expires_at);
            const now = new Date(currentDate);

                // Comparar fechas
            if (tokenDate > now) {
                console.log("El token sigue siendo válido.");

                return res.json({
                    status: 10,
                    message: 'Login exitoso',
                    token: existingToken.token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                });

            } else {
                console.log("El token ha expirado.");
                //Generar un token JWT
                const token = jwt.sign(
                    { id: user.id, email: user.email }, // Payload
                    process.env.JWT_SECRET, // Reemplaza con una clave secreta segura
                    { expiresIn: '1h' } // Expiración del token
                );

                //Guardar el token en la base de datos
                const expiresAt = new Date(Date.now() + 3600000); // 1 hora en milisegundos
                await pool.query(`
                    INSERT INTO users_tokens (user_id, token, expires_at)
                    VALUES (:user_id, :token, :expires_at)`,
                    {
                        replacements: {
                            user_id: user.id,
                            token,
                            expires_at: expiresAt,
                        },
                        type: QueryTypes.INSERT,
                    }
                );
            }
            //Enviar respuesta al cliente
            return res.json({
                status: 10,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error interno del servidor' });
    }
};

const register_user = async (req, res) => {

    const { document, name, email, phone, password } = req.body;

    if( !document ||  !name || !email ||  !phone || !password) {
        return res.json({
            status: 12,
            data: 'Faltan parametros' 
          }); 
    }
    
    const saltRounds = 10; // Number of hashing rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {

        const register = await pool.query(`select * from create_user(
            :document,
            :name,
            :email,
            :phone,
            :hashedPassword
            )`, {
                replacements: { 
                    document,
                    name,
                    email,
                    phone,
                    hashedPassword
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
            status: register.code,
            data: register.resp // Enviar los datos al cliente
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