
const bcrypt = require('bcrypt')
const saltRounds = parseInt(process.env.SALT_ROUNDS)
require('dotenv').config()

const db = require('../db')

const UserSchema = require('../schemas/user')
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
                        console.error(err)
                    } else {
                        console.log(`success!`)
                        res.status(200).send()
                    }
                })
            }
        })
    })
}

const login = (email, password) => {
    User.findOne({ "email": email }, (err, user) => {
        if(err) {
            console.error(err)
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) {
                    console.error(err)
                } else {
                    if(result) {
                        console.log(`user ${user.email} successful login!`)
                    } else {
                        console.log(`wrong password!`)
                    }
                }
            })
        }
    })
}

exports.addUser = addUser
exports.login = login