const express = require('express')
const router = express.Router()
const courseController = require('../controllers/course.controller')

router.route('/')
    .get(courseController.crudControllers.getAll)
    .post(courseController.crudControllers.addOne)

router.route('/:id')
    .get(courseController.crudControllers.getOne)
    .put(courseController.crudControllers.updateOne)
    .delete(courseController.crudControllers.removeOne)

module.exports = router
