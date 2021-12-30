const { Schema } = require("mongoose")
const emailVal = require("email-validator")
const mongoose = require('mongoose')

const user = new Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: (e) => {
                return emailVal.validate(e)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = user