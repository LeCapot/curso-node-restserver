const { response } = require ('express');
const { Producto } = require ('../models'); 
const { findById, findByIdAndUpdate } = require('../models/usuario');


const obtenerProductos = async (req,res= response) =>{
    const query = { estado : true};

    const [total,productoDB] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find({ query })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    if( !productoDB ){
        return res.status(400).json({
            msg: 'No Hay Productos disponibles'
        });
    };

    return res.json({total,productoDB});
};


const obtenerProducto = async (req,res = response) =>{
    const _id = req.params.id;

    const productoDB = await Producto.findById({ _id, estado: true}).populate('categoria','nombre');

    return res.json({productoDB});

};


const crearProducto = async (req,res = response) =>{
    
    const nombre = req.body.nombre.toUpperCase();
    const { precio,
            categoria,
            descripcion,
            disponible} = req.body;
    
    const usuario = req.usuario._id;    
    const productoDB = await Producto.findOne({
        nombre,
        estado:true, //Depende de si me importa o no que este habilitado
        categoria
    });
    console.log(productoDB);
    if ( productoDB ){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre} , ya existe`
        });
    };
    const data = {
        nombre,
        usuario,
        precio,
        categoria,
        descripcion,
        disponible
    }
    
    const nuevoProducto = await new Producto( data );
    await nuevoProducto.save();
    res.json({nuevoProducto});
    
    
    
};


const actualizarProducto = async (req,res = response) => {
    const id = req.params.id;
    const usuario = req.usuario._id;
    const nombre = req.body.nombre.toUpperCase();
    
    const { precio,categoria,descripcion,disponible } = req.body;

    const data ={
        nombre,
        estado: true,
        usuario,
        precio,
        categoria,
        descripcion,
        disponible

    };

    const productoDB = await Producto.findByIdAndUpdate(id,data,{new:true})

    res.json(productoDB);

};


const borrarProducto = async (req,res=response) => {
    const id = req.params.id;

    const productoDB = await Producto.findByIdAndUpdate(id,{estado: false},{new:true});

    return res.status(201).json({productoDB});
};

module.exports = { 
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
 };