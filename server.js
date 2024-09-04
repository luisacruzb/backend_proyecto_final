// 1. Importa el módulo express
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// 2. Crea una instancia de una aplicación express
const app = express()

// 3. Define el puerto en el que el servidor escuchará
const PORT = 3000

// 4. Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

// 5. Conexión a MongoDB
mongoose.connect('mongodb+srv://air_eagle9511:np2mgKOR5A7UuoIW@luisafernandacruz.foujb.mongodb.net/proyecto_final_talent_tech')
.then(()=>{
    console.log('Conexión a MongoDB exitosa')
}).catch((error)=>{
    console.error('Error al conectar a MongoDB:', error)
})

// 6. Define un esquema y un modelo para MongoDB
const Schema = mongoose.Schema
const FormularioSchema = new Schema({
    nombre:String,
    email:String,
    duda:String
}, {
    collection:'formularios_de_dudas'
})

const Formulario = mongoose.model('Formulario', FormularioSchema)


// 7. Define una ruta básica GET
app.get('/', (request, response) => {
    response.send('¡Hola, mundo!')
})

// 8. Define una ruta para manejar el POST del formulario
app.post('/submit_homework_form', async(request, response)=>{
    const {nombre, email, duda} = request.body

    try{
        const nuevoFormulario = new Formulario({nombre, email, duda})
        await nuevoFormulario.save()
        response.json({ message: 'Información recibida con éxito. Pronto recibirás un mensaje de uno de nuestros docentes especializados.' })
    }catch(error){
        console.error('Error al guardar el formulario:', error)
        response.status(500).json({ message: 'Error al guardar el formulario' })
    }    
})

// 7. Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})