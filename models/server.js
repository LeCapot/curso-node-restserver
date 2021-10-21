require('dotenv').config();
const express = require('express');
const cors = require('cors');


class Server{
   
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'
        
        // Middlewares
        this.middleware();
        

        // Rutas
        this.routes();
    }

    middleware(){

        // Cors
        this.app.use( cors() );
        
        //Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Publico
        this.app.use( express.static('public') );
    }

    routes() {

        this.app.use(this.usuariosPath, require ('../routes/usuarios'));
       
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en el pueto:', this.port);
        });
    }
}


module.exports = Server;