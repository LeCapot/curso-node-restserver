const { response } = require("express");


const esAdminRole = (req, res = response, next ) => {

    if( !req.usuario ){
        return res.status(500).json ({
            msg: 'Se quiere verificar role sin validar token primero'
        });
    };

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esta peticion`
        });
    };

    next();

}
const tieneRole = ( ...roles )  => {

    return (req, res = response, next ) => {
        //valido el token
        if( !req.usuario ){
            return res.status(500).json ({
                msg: 'Se quiere verificar role sin validar token primero'
            });
        };

        if ( !roles.includes( req.usuario.rol )) {
            return res.status(401).json ({
                msg: `La peticion requiere rol: ${ roles } `
            });

        };

        next();
    }
};


module.exports = {
    esAdminRole,tieneRole
}