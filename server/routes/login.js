const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

/* 
 * Permite crear un método de tipo POST para
 * autenticar a los usuarios dentro del sistema,
 * los datos del formulario de ingreso viajan
 * dentro del cuerpo de la petición (req.body).
 * 
 * A cada usuario autenticado se le asigna
 * un token de sesion, este será solicitado
 * cuando los usuarios realicen una acción privada
 * 
 * Autores: Rodrigo Maureira Contreras
 * 
 */ 

router.post('/login', async (req, res) => {

    /* Se solicitan los datos del body */
    const {email, password} = req.body

    /* Luego, se verifica que el usuario esté registrado dentro de MongoDB
     * Status Code 500 -> error durante la consulta
     * Status Code 409 -> error de autenticación
     */
    User.findOne({email: email}, async (error, user) => {

        if(error) return res.status(500).send({message: 'Server error'})
        if(!user) return res.status(409).send({message: 'Email or password wrong'})

        /* Procede a comparar las contraseñas
         * mediante el módulo bcryptjs
         * Status Code 409 -> error de autenticación
         */
        const check = await bcryptjs.compare(password, user.password)
        if(!check) return res.status(409).send({message: 'Email or password wrong'})

        /* Ya autenticados, se procede a generar
         * y enviar el token de acceso al cliente.
         * Cada token tiene un tiempo antes de expirar (15 días).
         */
        const info = {_id: user.id, email: user.email, created: user.created}
        const key=process.env.APIKEY || 'mysecretkey'
        const token = jwt.sign(info, key, {expiresIn: 1296000})
        return res.status(200).send({message: 'Logged in', token: token})

    })

})

module.exports = router