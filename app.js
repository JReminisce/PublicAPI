"use strict"
/**
 * Module dependencies.
 */
require('dotenv').config()

const express = require('express')
const http = require('http')
const config = require('./config/auth')	// get our config file
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended : true })
const morgan = require('morgan')

const app = express()

/**
 * Set view engine.
 */
app.set('view engine', 'ejs')

/**
 * Express configuration.
 */
app.use('/modules', express.static(__dirname + "/node_modules/"))
app.use('/jquery', express.static(__dirname + "/node_modules/jquery/dist/"))
app.use('/public', express.static(__dirname + "/public/"))
app.use('/lib', express.static(__dirname + "/public/lib/"))


app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

/*
 * Application Routes
 */
require('./config/routes.js')(app)

let httpServer = http.createServer(app).listen(3000)