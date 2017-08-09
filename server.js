const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const porta = process.env.PORT || 5000

app.use(bodyParser.urlencoded())

const router = require('./app/routes')(app)

app.listen(porta, () => {
	console.log('Server on: ' + porta)
})
