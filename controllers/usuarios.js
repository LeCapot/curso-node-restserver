const { response } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req, res = response) => {

    //const { q, nombre = "no name", apikey, page = 1, limit} = req.query;
    const { limite = 5 ,desde = 0} = req.query;
    
    const query = {estado: true,
                    }
/*
    const usuarios = await Usuario.find({ query })
        .skip(Number(desde))
        .limit(Number(limite) );
    
    const total = await Usuario.countDocuments(query);
    */

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find({ query })
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);

    res.json({
    /*    msg: 'get API - controlador',
        q, 
        nombre, 
        apikey,
        page,
        limit*/
        total,
        usuarios
    

    });
}





const usuariosPut =  async (req,res = response) => {
    
    const { id } = req.params;
    const {_id, password , google, correo, ...resto } = req.body;

    if ( password ) {

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate ( id , resto );

    res.json({
        
        msg: "put API - controlador ",
        usuario
    });
};

const usuariosPost =  async (req,res = response) => {
    


    const { nombre, correo, password,rol } = req.body;
    let usuario = new Usuario(  { nombre, correo, password, rol }  );

    // // Verificar sie el correo existe
    // const existeEmail = await Usuario.findOne ({ correo });
    // if ( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'El correo ya esta registrado'
    //     });
    // };
    
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );



    // Guardar en DB
   await usuario.save();

    res.json({
        
        msg: "post API - controlador",
        usuario
    });

};

const usuariosDelete = async (req,res) => {
    
    const{ id } = req.body;

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );
    
    // baja logica
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json({
        
        id,
        usuario


    });
};
const usuariosPatch = (req,res) => {
    res.json({
        
        msg: "patch API - controlador"
    });
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch

}