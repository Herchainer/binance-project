const axios = require('axios');
const config = require('../config/config');


this.url = 'https://testnet.binance.vision';
class binanceApi {


    async connect() {

        const client = axios.create({
            baseURL: this.url,
            headers: {
                'X-MBX-APIKEY': apiKey
            }
        });


        console.log(client, 'me conecte')

    };


    async login(){


        

        console.log('estoy en la clase')
        return

    }









}

module.exports = binanceApi