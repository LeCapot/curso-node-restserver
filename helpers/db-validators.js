/*const Role = require ('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/Producto');*/

const { Role, Usuario, Categoria, Producto } = require('../models');


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

const existeCategoriaId = async ( id ) => {

    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error(`El id no existe ${ id }`);
    }

}

const existeProductoId = async ( id ) => {

    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error(`El id no existe ${ id }`);
    }

}


/**
 *  Validar colecciones permitidas
 */

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) =>{
    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error (`La coleccion ${ coleccion } no es permitida, ${ colecciones }`);
    }

    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas
}