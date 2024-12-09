const axios = require('axios');
const config = require('../config/config');



class binanceApi {

    constructor(){

        this.url = 'https://testnet.binance.vision/api/v3/';

    }


    async connect() {

        const client = axios.create({
            baseURL: this.url,
            headers: {
              'Content-Type': 'aplication/json'
            }
        });

        try {

            const response = await client.get('ping');

            if (response.status === 200) {
                console.log('Conexion exitosa a binance Testnet')
                return true;
            }else {
                console.log('no se pudo conectar a binance')
                return false;
            }
            
        } catch (error) {
            
            console.log(error.message, 'error  sss')

            return false
        }
    };


    async login(){


        this.connect().then(isConnected => { 
            console.log('Estado de la conexion', isConnected ? 'conectado' : 'Desconectado')
        })


        console.log('estoy en la clase')
        return

    }









}

module.exports = binanceApi