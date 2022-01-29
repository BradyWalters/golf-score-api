const jwt = require('jsonwebtoken')
require('dotenv').config()

const genToken = async (userId) =>  {
    return await jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: '1 day' })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.error(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

exports.genToken = genToken
exports.authenticateToken = authenticateToken
