const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

const getAllCourses = (req, res) => {
    res.send(`hey here's all your courses!`)
}

const addCourse = (req, res) => {
    res.send(`hey, we're adding a course!`)
}

const getCourse = (req, res) => {
    res.send(`hey, we're getting course ${req.params.id}`)
}

const changeCourse = (req, res) => {
    res.send(`hey, we're changing course ${req.params.id}`)
}

const deleteCourse = (req, res) => {
    res.send(`hey, we're deleting course ${req.params.id}`)
}

router.route('/')
    .get(getAllCourses)
    .post(addCourse)

router.route('/:id')
    .get(getCourse)
    .put(changeCourse)
    .delete(deleteCourse)

module.exports = router
