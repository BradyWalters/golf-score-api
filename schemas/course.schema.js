const { Schema } = require('mongoose')
const teeSchema = require('./tee.schema')
const db = require('../db')
const TeeModel = db.model('Tee', teeSchema)
const uniqueVal = require('mongoose-unique-validator')

const makeTee = (rawTees) => {
    const teeArray = []

    rawTees.forEach(tee => {
        teeArray.push(new TeeModel(tee))
    })

    return teeArray
}

const course = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    holes: {
        type: Number,
        required: true,
        default: 18
    },
    address: {
        type: String,
        unique: true
    },
    tees: {
        type: [teeSchema],
        required: true,
        set: makeTee,
    },
    },
    { timestamps: true, autoIndex: false }
)

course.plugin(uniqueVal)

module.exports = course