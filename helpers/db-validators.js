const Role = require ('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async (rol = '' ) => {
    
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`)
    }
};


const emailExiste = async ( correo = '' ) => {
    
    const existeEmail = await Usuario.findOne ({ correo });
    if ( existeEmail ){
        // return res.status(400).json({
        //     msg: 'El correo ya esta registrado'
        // });
        throw new Error(`El Correo ${ correo } ya esta registrado. Gato!!! `);
    };
  


};

const existeUsuarioPorId = async ( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }


}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}