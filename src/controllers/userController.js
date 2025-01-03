const { Query } = require('pg');
const pool = require('../config/config');


const consult_user = async (req, res) => {

    const {document} = req.body;

    try {
        const consult = await pool.query(`select * from users where document = $1`, [document])

        return res.json({
        data: consult.rows // Enviar los datos al cliente
      });   
    } catch (error) {

        console.log(error)

    return res.status(500).json({
      error: 'Error en la consulta a la base de datos'
    });
    }
    
} 



module.exports = {
    consult_user
}