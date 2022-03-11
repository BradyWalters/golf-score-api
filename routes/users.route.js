const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.route('/:id')
    .get(userController.crudControllers.getOne)
    .put(userController.crudControllers.updateOne)
    .delete(userController.crudControllers.removeOne)

module.exports = router
