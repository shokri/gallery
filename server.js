const express = require('express')
const bodyParser = require('body-parser')
const routesConfig = require('./routes')


const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'))

routesConfig(app)

app.listen(port)