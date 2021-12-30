const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/score.controller')

router.route('/')
    .get(scoreController.crudControllers.getAll)
    .post(scoreController.crudControllers.addOne)

router.route('/:id')
    .get(scoreController.crudControllers.getOne)
    .put(scoreController.crudControllers.updateOne)
    .delete(scoreController.crudControllers.removeOne)

module.exports = router
