"use strict"
// CONFIG
const db_path = require('../config/database_collections')

// UTILITY
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema

// Schema
let user = new Schema({
  'name' : { type: String },
  'password' : { type: String },
  'admin' : { type: Boolean }
})

user.index({ 'name': 1 }, { unique: true })

let db = mongoose.createConnection(process.env.MONGODB_URI + db_path.user.db, { useMongoClient: true })
let User = db.model(db_path.user.collection.user_collection, user)
module.exports = User
