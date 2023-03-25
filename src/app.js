import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io"

const PORT = 8080

const app = express()
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)

let messages = []
io.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })

    socket.on('newUser', newUser => {
        socket.broadcast.emit('newUser', newUser)
    })
})