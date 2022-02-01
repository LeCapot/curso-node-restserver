const jwt = require ('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise ( (resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '4h' //vive por cuatro horas -- 365d vive por 365 dias
        },( err, token ) => {
            if ( err )  {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
};


module.exports = {
     generarJWT
}