const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { json } = require('express/lib/response');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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
// res = response es para que vsc corrija la sintaxis ? 
const googleSingIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        //con el id_token de google obtengo los datos de usuario
        const { correo, nombre, img } = await googleVerify( id_token );
        
        //verifico si ya existe el usuario en la base
        let usuario = await Usuario.findOne({ correo });

        if( !usuario ) {
            // si no existe, Creo el usuario
            const data = {
                nombre,
                correo,
                password: '1234567879caca', //no guarda informacion
                img,
                google: true,
                rol: 'USER_ROLE'
            
            };

            usuario = new Usuario( data );
            await usuario.save();

        };
        
        // verifique que el usuario no este bloqueado
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Habla con el admin, usuario bloqueado'
            });
        };
        
        // generar el JWT
        const token = await generarJWT ( usuario.id );        

        return res.json({ 
            usuario,
            token 
        });

    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El token no se puedo verificar'
        })
    }


};


module.exports = { login , googleSingIn}