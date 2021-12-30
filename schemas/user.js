const { Schema } = require("mongoose")
const emailVal = require("email-validator")

const user = new Schema({
    name: String,
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
    }
})

module.exports = user