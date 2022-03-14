const { Router } = require ('express');
const { check } = require('express-validator');

//middlewares personalizados
const{ validarCampos,validarJWT,tieneRole } = require('../middlewares' );

const { existeProductoId, existeCategoriaId } = require('../helpers/db-validators');

const { crearProducto,obtenerProductos,obtenerProducto,actualizarProducto,borrarProducto } = require('../controllers/productos');

const router = Router();

// get 
router.get('/',obtenerProductos);

//get id 
router.get('/:id',[
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos 
],obtenerProducto);


//post 
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos   
],crearProducto);
//put
router.put('/:id',[
    validarJWT,
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoId),
    check('categoria', 'No es un id categoria valido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    check('nombre', 'El nombre es obiligatorio').not().isEmpty(),
    check('precio', 'El nombre es obiligatorio').not().isEmpty(),
    validarCampos
],actualizarProducto
);

//delete
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],borrarProducto
);

module.exports = router;