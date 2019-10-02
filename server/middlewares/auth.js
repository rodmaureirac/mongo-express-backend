const jwt = require('jsonwebtoken')
const User = require('../models/User')

/* 
 * Permite decodificar un token a fin
 * de validar la sesión del usuario,
 * permitiendo acceder alas rutas privadas 
 * del servidor de la sigueinte manera:
 * 
 * Autores: Rodrigo Maureira Contreras
 * 
 */ 

module.exports = (req, res, next) => {

    /* Solicitamos el token enviado
     * por el cliente del servidor
     * Status Code 401 -> el token no fue enviado
     */
    const token = req.header('token')
    if(!token) return res.status(401).send('Access denied')
    try {

        /* Ahora se procede a decodificar el token
         * en cuestion y se extrae la información
         * de la cuenta del usuario (query)
         */
        const key=process.env.APIKEY || 'mysecretkey'
        const decoded = jwt.verify(token, key)
        const info = {_id: decoded._id, email: decoded.email, created: decoded.created}

        /* Luego, procedemos a verificar que la
         * información decodificada sea válida
         * Status Code 500 -> Error durante la consulta
         * Status Code 401 -> La información es incorrecta
         */
        User.findOne(info, async (error, user) => {
            if(error) return res.status(401).send('Access denied')
            if(!user) return res.status(401).send('Access denied')
            next()
        })

    } catch(err) {

        /* En caso de cualquier error desconocido,
         * se notifica al usuario
         * Status Code 500 -> Error durante la consulta
         */
        return res.status(401).send('Access denied')

    }

}