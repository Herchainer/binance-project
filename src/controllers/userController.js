const pool = require('../config/config');

const consult_user = async (req, res) => {

    const consult = await pool.query(`
        select * from users where status = 0`, 
        (err, res) => {
        if(!err){
            console.log(res.rows);
        } else {
            console.log(err.message)
        }
    })
} 



module.exports = {
    consult_user
}