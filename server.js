require('dotenv').config()
const express= require('express');
const mysql=require('mysql')
const myconn = require('express-myconnection')
const routes = require('./routes')
const cors = require('cors')
const app = express()


app.use(cors())

app.set('port', process.env.PORT_SERVER || 9000)

const dbOptions={
    host:process.env.DB_HOST || 'localhost',
    port:process.env.DB_PORT || '3306',
    user:process.env.DB_USER || 'root',
    password:process.env.DB_PASSWORD || '12345678',
    database:process.env.DB_NAME || 'deportes'
}

// Middleware -----

app.use(myconn(mysql,dbOptions,'single'))
app.use(express.json())

app.use('/api', routes)

app.get('/', (req, res)=>{
    res.send("Bienvenido a la API de marcadores deportivos")
})

app.listen(app.get('port'),()=>{
    console.log(`Server running on port http://127.0.0.1:${app.get('port')}`)
})