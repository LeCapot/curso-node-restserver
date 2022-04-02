require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // libreria para cargar archivos

const { dbConnection } = require ('../database/config');

class Server{
   
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
//        this.usuariosPath = '/api/usuarios'
//        this.authPath = '/api/auth'
        this.path = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'

        }

        // Conectar a base de datos
        this.conectarDB();
        // Middlewares
        this.middleware();
        

        // Rutas
        this.routes();
    }

    async conectarDB () {
        await dbConnection();
    }

    middleware(){
        // todo esto se ejecuta antes de llegar a las rutas

        // Cors
        this.app.use( cors() );
        
        //Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Publico
        this.app.use( express.static('public') );

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

       // this.app.use(this.usuariosPath, require ('../routes/usuarios'));
       // this.app.use(this.authPath, require ('../routes/auth'));
       this.app.use(this.path.auth,  require ('../routes/auth') );
       this.app.use(this.path.usuarios,  require ('../routes/usuarios') );
       this.app.use(this.path.categorias,  require ('../routes/categorias') );
       this.app.use(this.path.productos,  require ('../routes/productos') );
       this.app.use(this.path.buscar,  require ('../routes/buscar') );
       this.app.use(this.path.uploads,  require ('../routes/uploads') );
       
       
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server corriendo en el pueto:', this.port);
        });
    }
}


module.exports = Server;