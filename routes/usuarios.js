
const { Router } = require('express');
// const usr = require('../controllers/usuarios'); *1
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');



const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios'); //*2

//middlewares personalizados
const{ validarCampos,validarJWT,tieneRole } = require('../middlewares' );

/*const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole,
        tieneRole   } = require('../middlewares/validar-roles');
*/


const router = Router();



// router.get('/', usr.usuariosGet);     //*1
// router.put('/', usr.usuariosPut);     //*1
// router.post('/',usr.usuariosPost);    //*1
// router.delete('/',usr.usuariosDelete);//*1
// router.patch('/', usr.usuariosPatch); //*1  

router.get('/', usuariosGet);      //*2

router.put('/:id',[
        check('id','No es un ID Valido').isMongoId(),
        check('id').custom( existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos
], usuariosPut);      //*2 

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser mas de 6 letras').isLength({ min: 6}),
        //check('correo', 'El correo no es valido').isEmail(),
        //check('rol', 'No es un rol valido').isIn('ADMIN_ROLE', 'USER_ROLE'), 
        /*check('rol').custom( async (rol = '' ) => {
                const existeRol = await Role.findOne({ rol });
                if ( !existeRol ) {
                        throw new Error(`El rol ${ rol } no está registrado en la BD`)
                }
        }),*/

        // check( 'rol' ).custom( (rol)  => esRoleValido(rol) ),  es lo mismo que la de abajoni
        check('rol').custom(esRoleValido),
        check('correo').custom(emailExiste),
        validarCampos

],usuariosPost);     //*2 

router.delete('/',[
        validarJWT,
        //esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id','No es un ID Valido').isMongoId(),
        check('id').custom( existeUsuarioPorId),
        validarCampos
],usuariosDelete); //*2

router.patch('/', usuariosPatch);  //*2




module.exports = router;
