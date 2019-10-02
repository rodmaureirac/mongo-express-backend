const mongoose = require('mongoose')

/* 
 * Esquema base para almacenar
 * la información de los usuarios
 * dentro de MongoDB. Las contraseñas
 * se almacenen mediante el hash
 * correspondiente.
 * 
 * Más info en  /server/routes/register
 *              /server/routes/login
 * 
 * Autores: Felipe Céspedes Cordero
 * 
 */ 

const UserSchema = new mongoose.Schema({
    
    /* Correo electrónico */
    email: {
        type: String, 
        required: true, 
        trim: true, 
        unique: true, 
    },

    /* Contraseña */
    password: {
        type: String,
        required: true,
        trim: true,
    },

    /* Fecha de creación */
    created: {
        type: Date,
        required: true,
        default: Date.now()
    }
    
})

/* Módulo a exportar */
module.exports = mongoose.model('User', UserSchema)