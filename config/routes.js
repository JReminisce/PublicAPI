const express = require('express')
const mongoose = require('mongoose')
const jwt    = require('jsonwebtoken')    // used to create, sign, and verify tokens
const config = require('./auth')          // get our config file
const User   = require('../models/user')  // get our mongoose model

/**
 * Controllers (route handlers).
 */
const main_route = require('../controllers/main_controller')



module.exports = function(app) {
  app.get('/home', main_route.home_page)

  app.get('/', function(req, res) {
    res.send('Hello! The API is at /api')
  })

  // API ROUTES -------------------
  // get an instance of the router for api routes
  let apiRoutes = express.Router() 

  // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRoutes.post('/authenticate', function(req, res) {
    // find the user
    User.findOne(
    {
      name : req.body.name
    }, 

    function(err, user) {
      if (err) {
        res.json({
          success : false,
          message : 'Authentication failed.'
        })
      }

      if (!user) {
        res.json({ 
          success: false, 
          message: 'Authentication failed. User not found.' 
        })
      } else if (user) {
        // check if password matches
        if (user.password != req.body.password) {
          res.json({ 
            success: false, 
            message: 'Authentication failed. Wrong password.' 
          })
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          
          const payload = {
            admin : user.admin 
          }

          let token = jwt.sign(payload, config.jwtSecret, {
            expiresIn : '24h' // expires in 24 hours
          })

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Have fun with your token!',
            token: token
          })
        }   
      }
    })
  })

  // route to show a random message (GET http://localhost:3000/api/)
  apiRoutes.get('/', isApiAuthenticated, function(req, res) {
    console.log(req.decoded)

    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  // route to return all users (GET http://localhost:3000/api/users)
  apiRoutes.get('/users', isApiAuthenticated, isApiAdminAuthenticated, function(req, res) {
    User.find({}, function(err, users) {
      res.json(users)
    })  
  })

  // apply the routes to our application with the prefix /api
  app.use('/api', apiRoutes)

  // app.get('/setup', function(req, res) {
  //   // create a sample user
  //   var admin = new User({ 
  //     name: 'Jeremy', 
  //     password: 'password',
  //     admin: true 
  //   })

  //   // save the sample user
  //   admin.save(function(err) {
  //     if (err) throw err;

  //     console.log('Admin user saved successfully')
  //     res.json({ success: true })
  //   })
  // })
}

// TODO: route middleware to verify a token
let isApiAuthenticated = (req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token']

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.jwtSecret, function(err, decoded) {      
      if (err) {
        return res.json({ 
          success: false, 
          message: 'Invalid token found.' 
        })    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded    
        return next()
      }
    })
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
      success: false, 
      message: 'No token found.' 
    })
  }
}

let isApiAdminAuthenticated = (req, res, next) => {
  if (req.decoded && req.decoded.admin) {
    return next()  
  } else {
    res.json({
      'success' : false,
      'message' : 'Token does not have admin privileges.'
    })
  }
}