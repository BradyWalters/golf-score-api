const app = require('../app')
const supertest = require('supertest')
const userController = require('../controllers/user.controller')
const db = require('../db')
const userSchema = require('../schemas/user.schema')
const User = db.model('User', userSchema)

const goodUser = { "email": "brady.walters5@gmail.com", "password": "password", "name": "Brady"}

afterEach(() => {
    return db.connection.dropDatabase(() => {
        db.disconnect()
    })
})

test('add user with name and proper email', async () => {
    return await supertest(app).post('/users')
        .send(goodUser)
        .expect(201)
})

test('get users when none exist', () => {
    return supertest(app).get('/users')
        .expect(200)
})