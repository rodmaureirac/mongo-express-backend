const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User')

/* 
 * Permite crear un método de tipo POST para
 * registrar a usuarios dentro de MongoDB,
 * los datos del formulario de registro viajan
 * dentro del cuerpo de la petición (req.body)
 * 
 * Autores: Rodrigo Maureira Contreras
 *          Felipe Céspedes Cordero
 * 
 */ 

router.post('/register', async (req, res) => {

    /* Se solicitan los datos del body */
    const {email, password} = req.body

    /* Luego, se verifica que el usuario no esté registrado dentro de MongoDB
     * Status Code 500 -> error durante la consulta
     * Status Code 400 -> el usuario ya existe
     */
    User.findOne({email: email}, async (error, user) => {

        if(error) return res.status(500).send({message: 'Server error'})
        if(user) return res.status(400).send({message: 'This user is already registered'})

        /* Se procede a asegurar la contraseña mediante el
         * módulo bcryptjs. La estrategia consiste en crear
         * un hash en base a un salt y la contraseña original
         */
        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)

        /* Finalmente, se crea el usuario dentro de MongoDB
         * Status Code 500 -> error durante la escritura
         * Status Code 201 -> el usuario fue agregado existosamente
         */
        const newUser = new User({email: email, password: hash})
        newUser.save((error) => {
            if(error) return res.status(500).send({message: 'Server error'})
            return res.status(201).send({message: 'User has been registered'})
        })

    })

})

module.exports = router