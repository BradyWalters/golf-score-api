const { Schema } = require('mongoose')

const tee = new Schema({
    par: {
        type: Number,
        required: true,
        min: 27,
        max: 90
    }, 
    yards: Number,
    color: {
        type: String,
        required: true
    },
    slope: {
        type: Number, 
        required: true,
    },
    rating: {
        type: Number,
        required: true
    }
}, { timestamps: true, autoIndex: false })

module.exports = tee