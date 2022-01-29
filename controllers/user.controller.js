
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const auth = require('../middleware/auth')
require('dotenv').config()

const crudController = require('./crud')

const db = require('../db')

const UserSchema = require('../schemas/user.schema')
const User = db.model('User', UserSchema)

const addUser = async (req, res) => {
    await bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.error(err)
            } else {
                req.body.password = hash
                const newUser = new User(req.body)

                const token = auth.genToken(newUser._id)

                newUser.save((err) => {
                    delete newUser.password
                    res.status(201).json({ data: newUser, token: token })
                })
            }
        })
    })
}

const login = async (req, res) => {
    await User.findOne({ "email": req.body.email }, (err, user) => {
        if (err) {
            console.error(err)
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.error(err)
                } else {
                    if (result) {
                        delete user.password
                        const token = auth.genToken(user._id)
                        res.status(202).json({ data: user, token: token })
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