const binanceApi = require('../services/binanceService');



const binanceLogin = async (req, res) => {

    try {

        let binance = new binanceApi()

        const response = await binance.login();

        //console.log(response, 'controler')
        //return;

        console.log('estoy en el controlador')


    } catch (error) {
        //res.status(500).json({error: error.message});    
    
        console.log(error,'err')
    }

};




    module.exports =  {
        binanceLogin
    } 

