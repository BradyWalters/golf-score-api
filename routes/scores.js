const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

const getAllScores = (req, res) => {
    res.send(`hey here's all scores!`)
}

const addScore = (req, res) => {
    res.send(`hey, we're adding a score!`)
}

const getScore = (req, res) => {
    res.send(`hey, we're getting score ${req.params.id}`)
}

const changeUser = (req, res) => {
    res.send(`hey, we're changing score ${req.params.id}`)
}

const deleteUser = (req, res) => {
    res.send(`hey, we're deleting score ${req.params.id}`)
}

router.route('/')
    .get(getAllScores)
    .post(addScore)

router.route('/:id')
    .get(getScore)
    .put(changeUser)
    .delete(deleteUser)

module.exports = router
