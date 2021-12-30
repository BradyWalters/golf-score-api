require('dotenv').config()
const mongoose = require('mongoose')

const userController = require('./controllers/user.controller')

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}${process.env.DB_URL}`)

module.exports = mongoose