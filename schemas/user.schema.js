const { Schema } = require("mongoose")
const emailVal = require("email-validator")
const uniqueVal = require("mongoose-unique-validator")

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
    type: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
        default: "Male"
    }
}, { timestamps: true, autoIndex: false })

user.plugin(uniqueVal)

module.exports = user