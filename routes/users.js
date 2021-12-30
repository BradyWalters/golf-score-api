const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

const userController = require('../controllers/user.controller')

const getAllUsers = (req, res) => {
    res.send(`hey here's all your users!`)
}

const getUser = (req, res) => {
    res.send(`hey, we're getting user ${req.params.id}`)
}

const changeUser = (req, res) => {
    res.send(`hey, we're changing user ${req.params.id}`)
}

const deleteUser = (req, res) => {
    res.send(`hey, we're deleting user ${req.params.id}`)
}

router.route('/')
    .get(userController.crudControllers.getAll)
    .post(userController.addUser)

router.route('/:id')
    .get(userController.crudControllers.getOne)
    .put(userController.crudControllers.updateOne)
    .delete(userController.crudControllers.removeOne)

module.exports = router
