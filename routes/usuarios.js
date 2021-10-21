
const { Router } = require('express');
// const usr = require('../controllers/usuarios'); *1

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios') //*2

const router = Router();



// router.get('/', usr.usuariosGet);     //*1
// router.put('/', usr.usuariosPut);     //*1
// router.post('/',usr.usuariosPost);    //*1
// router.delete('/',usr.usuariosDelete);//*1
// router.patch('/', usr.usuariosPatch); //*1  

router.get('/', usuariosGet);      //*2
router.put('/:id', usuariosPut);      //*2 
router.post('/',usuariosPost);     //*2 
router.delete('/',usuariosDelete); //*2
router.patch('/', usuariosPatch);  //*2




module.exports = router;
