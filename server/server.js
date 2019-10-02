const express = require('express')
const app = express()
const mongoose = require('mongoose')

/* 
 * Permite instanciar un servidor HTTP
 * de manera rápida y sencilla. Además
 * conecta con MongoDB.
 * 
 * Las rutas del servidor pueden ser
 * encontradas dentro de: /server/routes
 * y pueden ser incluidas en la
 * sección correspondiente
 * 
 * Autores: Rodrigo Maureira Contreras
 *          Felipe Céspedes Cordero
 * 
 */

/* Módulo a exportar */
var server = module.exports = {}

/* Permite agregar modulos adicionales */
server.use = (module) => {
    app.use(module)
}

/* Emplea JSON como notación de objetos */
server.use(express.json())

/* Se emplan las siguientes rutas
 * para el servidor. Para crear nuevas ir
 * a la carpeta /server/routes
 */
server.use(require('./routes/index'))
server.use(require('./routes/public'))
server.use(require('./routes/register'))
server.use(require('./routes/login'))
server.use(require('./routes/private'))

/* Método para iniciar el servidor */
server.start = async (port=3000, dbhost='localhost', dbusr='usr', dbpwd='pwd', db='mydb') => {

    /* Obtiene las credenciales de MongoDB y sus parámetros de configuración */
    const mongo = `mongodb://${dbusr}:${dbpwd}@${dbhost}/${db}`
    const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}

    /* Conecta con MongoDB e inicia el servicio HTTP */
    mongoose.connect(mongo, mongoOptions, () => {
        app.listen(port, () => {
            console.log('Server running on http://localhost:' + port)
            console.log('Mongoose connected with MongoDB')
        })
    })

}

/* Inicia el servidor */
server.start()
