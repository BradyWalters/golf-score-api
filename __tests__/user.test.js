const app = require('../app')
const supertest = require('supertest')
const userController = require('../controllers/user.controller')
const mongoose = require('mongoose')
const userSchema = require('../schemas/user.schema')
const User = mongoose.model('User', userSchema)

const goodUser = { "email": "brady.walters5@gmail.com", "password": "password", "name": "Brady"}

app.listen(3000, () => {
    console.log(`user test server started`)
})

beforeAll(() => {
    return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}${process.env.DB_URL}`)
})

afterEach(() => {
    return mongoose.connection.dropDatabase()
})

afterAll(() => {
    return mongoose.connection.close()
})

test('add user with name and proper email', () => {
    return supertest(app).post('/users')
        .send(goodUser)
        .expect(201)
})