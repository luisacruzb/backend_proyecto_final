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
const SchemaPregunta = mongoose.Schema
const FormularioSchema = new SchemaPregunta({
    nombre:{type:String, required:true},
    email:{type:String, required:true},
    duda:{type:String, required:true}
}, {
    collection:'formularios_de_dudas'
})

const FormularioPregunta = mongoose.model('FormularioPregunta', FormularioSchema)

// 6.1. Definir un esquema y un modelo para las respuestas del formulario alojado en MongoDB
const RespuestaSchema = mongoose.Schema
const RespuestaFormularioSchema = RespuestaSchema({
    id_respuesta: {type: String, required:true },
    teacher_name:{type: String, required:true},
    respuesta: {type: String, required:true}
}, {
    collection:'formulario_de_respuestas'
})

const FormularioRespuesta = mongoose.model('FormularioRespuesta', RespuestaFormularioSchema)

// 7. Define una ruta básica GET
app.get('/', (request, response) => {
    response.send('¡Hola, mundo!')
})

// 8. Ruta para obtener todas las preguntas guardadas
app.get('/get_homework_data', async (request, response) => {
    try {
        const preguntas = await FormularioPregunta.find()

        const preguntasConRespuestas = await Promise.all(preguntas.map(async pregunta =>{
            const respuestas = await FormularioRespuesta.find({id_respuesta:pregunta._id.toString()})
            return {...pregunta.toObject(), respuestas}
        }))

        response.json(preguntasConRespuestas)
    } catch (error) {
        console.error('Error al obtener las preguntas y respuestas', error)
        response.status(500).json({ message: 'Error al obtener las preguntas' })
    }
})

// 8.1. Ruta para obtener todas las respuestas guardadas
app.get('/get_answer_data', async (request, response) => {
    try {
        const data = await FormularioRespuesta.find()
        response.json(data)
    } catch (error) {
        console.error('Error al obtener las respuestas:', error)
        response.status(500).json({ message: 'Error al obtener las respuestas' })
    }
})

// 9. Define una ruta para manejar el POST del formulario de preguntas
app.post('/submit_homework_form', async(request, response)=>{
    const {nombre, email, duda} = request.body

    try{
        const nuevoFormulario = new FormularioPregunta({nombre, email, duda})
        await nuevoFormulario.save()
        response.json({ message: 'Información recibida con éxito. Pronto recibirás un mensaje de uno de nuestros docentes especializados.' })
    }catch(error){
        console.error('Error al guardar el formulario:', error)
        response.status(500).json({ message: 'Error al guardar el formulario' })
    }    
})

// 9.1 Define una ruta para manejar el POST del formulario de respuestas
app.post('/submit_answer_homework_form', async(request, response)=>{
    const {id_respuesta,teacher_name,respuesta} = request.body

    try{
        const nuevoFormulario = new FormularioRespuesta({id_respuesta,teacher_name,respuesta})
        await nuevoFormulario.save()
        response.json({ message: 'Respuesta explicada de forma satisfactoria.'})
    }catch(error){
        console.error('Error al guardar la respuesta:', error)
        response.status(500).json({ message: 'Error al guardar la respuesta' })
    }    
})
//  Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})