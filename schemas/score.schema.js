const { Schema } = require('mongoose')
const mongoose = require('mongoose')

const score = new Schema({
    date: {
        type: Date,
        required: true
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    course: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    strokes: {
        type: Number,
        required: true,
        min: 9,
        max: 150
    },
    fairwayPercentage: {
        type: Number,
        max: 1.0,
        min: 0.0
    },
    greenPercentage: {
        type: Number,
        max: 1.0,
        min: 0.0
    },
    putts: {
        type: Number,
        min: 18
    },
}, { timestamps: true, autoIndex: false })

module.exports = score