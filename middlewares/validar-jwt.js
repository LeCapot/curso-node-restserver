const { response } = require('express');
const jwt = require('jsonwebtoken');
//const { usuariosGet } = require('../controllers/usuarios');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {

    const token = req.header('x-api-key');
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    } 
    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETKEY );
        /* Leer el usuario que le corresponde el uid */

        
        //console.log(usuarios);
        const usuario = await Usuario.findById(uid);
        req.usuario = usuario;
        if ( !usuario ){
            return res.status(401).json ({
                msg:'Token no valido - usuario inexistente'
            })
        }
        //verificar si el uid esta habilitado
        if ( !usuario.estado ) {
            return res.status(401).json ({
                msg:'Token no valido - estado del usuario dado de baja'
            })
        }
        /* Esto crea una propiedad nueva en la peticion del usuario  */
        req.uid = uid;
        
        next()
    } catch (error) {
       
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido',
            error: error
        })
    }


}

module.exports = {
    validarJWT
}