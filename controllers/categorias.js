const { response } = require ('express');
const { Categoria } = require ('../models'); // esto es asi por el index de modelos (no se por que los demas si andan) (node:9860) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'findOne' of undefined
const { options } = require('../routes/usuarios');



// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

     const query = { estado: true };

     
     const [total, categoriasDB] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find({ query })
            .populate('usuario', 'nombre')
     
     ]);

     if( !categoriasDB ) {
         return res.status(400).json({
             msg: 'No Hay Categorias disponibles'
         });
     };

     return res.json({total, categoriasDB});

};

    
   
// obtenerCategoria - populate
const obtenerCategoria = async (req, res = response) => {

    const id = req.params.id;
    
       
    const categoriaDB = await Categoria.findOne({ id, estado: true  } );
    console.log(categoriaDB);
    return res.json({categoriaDB});

};

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    };

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria( data );
    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

};


// actualizarCategoria 
const actualizarCategoria = async (req,res) =>{
    const id = req.params.id;
    const usuario = req.usuario._id;
    const nombre = req.body.nombre.toUpperCase();

    
    const categoriaDB = await Categoria.findByIdAndUpdate(id,{ nombre, usuario, estado: true},{new: true});
    

    return res.status(201).json({categoriaDB})

};

// borrarCategoria - estado:false
const borrarCategoria = async (req, res) =>{
    const id = req.params.id;

    const categoriaDB = await Categoria.findByIdAndUpdate(id,{estado: false}, {new: true});

    return res.status(201).json({categoriaDB});

};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}