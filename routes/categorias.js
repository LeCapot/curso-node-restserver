const { Router } = require ('express');
const { check } = require('express-validator');

//middlewares personalizados
const{ validarCampos,validarJWT,tieneRole } = require('../middlewares' );

//const { validarCampos } = require('../middlewares/validar-campos');
const { existeCategoriaId } = require('../helpers/db-validators');
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener todas las categorias por id - publico

router.get('/:id',[
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaId), //validacion personalizada
    validarCampos
],obtenerCategoria);

// Cear categoria - privado - cualquier persona con token valido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos    //es para poder hacer todas las validaciones si no solo hace la primera ?? 
] , crearCategoria );

// Actualizar - privado - cualquier persona con token valido
router.put('/:id', [
    validarJWT,
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
], borrarCategoria);


module.exports = router;