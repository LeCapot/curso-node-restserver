const { response } = require ('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'producto',
    'roles'
 
];

const buscarUsuarios = async( termino = '', res = response) =>{
    const esMongoID = ObjectId.isValid( termino ); //TRUE si es valido

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] //si usuarios es null devuelve []
        });
    };

    const regex = new RegExp( termino, 'i');
    const usuarios = await Usuario.find({ 
        $or:[{ nombre: regex }, {correo: regex}],
        $and:[{estado: true}]
     });

    res.json({
        results: usuarios
    })
};

const buscarCategorias = async( termino = '', res = response) =>{
    const esMongoID = ObjectId.isValid( termino );
    
    // Valido si es un id de mongo para buscar
    if( esMongoID ){
        const categoria = await Categoria.find({
            $or:[{_id: termino}, {usuario: termino}]
        });
        return res.json({
            results: ( categoria ) ? [ categoria ] : [] //si usuarios es null devuelve []
        });
    
    };

    const regex = new RegExp( termino, 'i');
    const categorias = await Categoria.find({
        nombre:regex
    });

    return res.json({categorias});
};

const buscarProductos = async (termino = '', res) => {
    const esMongoID = ObjectId.isValid( termino );
    
    if( esMongoID ){
        const producto = await Producto.find({
            $or:[{_id: termino}, {usuario: termino}, {categoria: termino}]
        });
        return res.json({
            results: ( producto ) ? [ producto ] : [] //si usuarios es null devuelve []
        });
    
    };

    const regex = new RegExp( termino , 'i');
    const productos = await Producto.find({nombre: regex});

    return res.json({
        productos
    });
}

const buscar = (req,res = response) => {
    const { coleccion, termino } = req.params;
    
    if( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las colleciones permitidas son: ${ coleccionesPermitidas }`
        })
    };

    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;    
        case 'categoria':
            buscarCategorias(termino, res);
        break;
        case 'producto':
            buscarProductos (termino, res);
        break;    

        default:
            res.status(500).json({
                msg: 'Falta incluir validacion'
            })
    };

/*
    res.json ({ 
        coleccion, termino
    });*/
};

module.exports = {
    buscar
};