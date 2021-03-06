
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
const auth = require('../middleware/auth')
require('dotenv').config()

const crudController = require('./crud')

const db = require('../db')

const UserSchema = require('../schemas/user.schema')
const user = require('../schemas/user.schema')
const User = db.model('User', UserSchema)

const addUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send()
    }

    try {
        await bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    console.error(err)
                } else {
                    req.body.password = hash
                    const newUser = new User(req.body)

                    const token = auth.genToken({ id: newUser._id })

                    newUser.save((err) => {
                        if (err) {
                            console.error(err)
                            return res.status(400).send()
                        }

                        const doc = newUser.toJSON()
                        delete doc.password

                        res.status(201).json({ data: doc, token: token })
                    })
                }
            })
        })
    } catch (err) {
        console.log('error', err)
        res.status(500).json({ error: 'There was a Server Side Error!' })
    }
}

const login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        console.log(req)
        return res.status(400).send()
    }

    await User.findOne({ "email": req.body.email }, (err, user) => {
        if (err) {
            console.error(err)
        } else if (!user) {
            res.status(404).end()
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.error(err)
                } else {
                    if (result) {
                        const doc = user.toJSON()
                        delete doc.password
                        const token = auth.genToken({ id: user._id })
                        res.status(202).json({ data: doc, token: token })
                    } else {
                        res.status(401).end()
                    }
                }
            })
        }
    }).clone()
}

exports.addUser = addUser
exports.login = login
exports.crudControllers = crudController.crudControllers(User)