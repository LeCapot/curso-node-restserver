const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const  Usuario = require ('../models/usuario');


const login = async ( req, res = response ) => {
    
    const {correo, password} = req.body;

    try{
        // Verificar si el email existe

        const usuario = await  Usuario.findOne({ correo });
        
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Estado: false'
            });
        }

        // verificar la contraseña
        const validPasword = bcryptjs.compareSync( password, usuario.password);

        
        if ( !validPasword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            });
        }


        // generar el JWT
        const token = await generarJWT ( usuario.id );
        
        res.json({
           usuario,
           token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Habla con el administrador pajin'
        });


    }

    
};


module.exports = { login }