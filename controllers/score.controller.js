const db = require('../db')
const scoreSchema = require('../schemas/score.schema')
const crudController = require('../controllers/crud')
const Score = db.model('Score', scoreSchema)

exports.crudControllers = crudController.crudControllers(Score)