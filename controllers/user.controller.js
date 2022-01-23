
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
require('dotenv').config()

const crudController = require('./crud')

const db = require('../db')

const UserSchema = require('../schemas/user.schema')
const User = db.model('User', UserSchema)

const addUser = (req, res) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.error(err)
            } else {
                req.body.password = hash
                const newUser = new User(req.body)

                newUser.save((err) => {
                    if (err) {
                        res.status(404).end()
                    } else {
                        res.status(201).json({ data: newUser})
                    }
                })
            }
        })
    })
}

const login = (req, res) => {
    User.findOne({ "email": req.body.email }, (err, user) => {
        if(err) {
            console.error(err)
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    console.error(err)
                } else {
                    if(result) {
                        res.status(202).json({ data: user })
                    } else {
                        res.status(401).end()
                    }
                }
            })
        }
    })
}

exports.addUser = addUser
exports.login = login
exports.crudControllers = crudController.crudControllers(User)