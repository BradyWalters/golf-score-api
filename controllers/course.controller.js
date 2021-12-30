const db = require('../db')
const courseSchema = require('../schemas/course.schema')
const crudController = require('../controllers/crud')
const Course = db.model('Course', courseSchema)

exports.crudControllers = crudController.crudControllers(Course)