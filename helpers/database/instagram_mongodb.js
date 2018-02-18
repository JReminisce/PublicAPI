"use strict"
const user = require('../../models/user')

/**
 *  User  
 */

// Retrieve all Instagram User profile
exports.get_all_user = async() => {
  return new Promise(function(resolve, reject) {
    user
    .find({})
    .catch(error => {
      reject('error connecting to database')
    })
    .then(result => {
      resolve(result)
    })
  })
}