const app = require('../app')
const supertest = require('supertest')
const db = require('../db')

let userId
let userToken
const fakeId = new db.Types.ObjectId()

beforeAll(() => {
    return db.connection.dropDatabase()
})

afterAll(() => {
    return db.connection.close()
})

test('POST new user', async () => {
    return await supertest(app).post('/signup')
        .send({
            "email": "brady.walters5@gmail.com",
            "password": "password",
            "name": "Brady"
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
            if (res.body.data.email !== "brady.walters5@gmail.com") throw new Error("Wrong Email")
            if (res.body.data.name !== "Brady") throw new Error("Wrong Name")

            userId = res.body.data._id
            userToken = res.body.token
        })
})

test('GET /:id correct ID', async () => {
    return await supertest(app).get(`/api/users/${userId}`)
        .auth(userToken, { type: 'bearer' })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if (res.body.data.email !== "brady.walters5@gmail.com") throw new Error("Wrong Email")
            if (res.body.data.name !== "Brady") throw new Error("Wrong Name")
        })
})

test('GET /:id wrong ID', async () => {
    return await supertest(app).get(`/api/users/${fakeId}`).auth(userToken, { type: 'bearer' }).expect(404)
})

test('PUT /:id change email', async () => {
    return await supertest(app).put(`/api/users/${userId}`)
        .auth(userToken, { type: 'bearer' })
        .send({
            "email": "example@gmail.com",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if (res.body.data.email !== "example@gmail.com") throw new Error("Wrong email")
        })
})

test('PUT /:id wrong id', async () => {
    return await supertest(app).put(`/api/users/${fakeId}`)
        .auth(userToken, { type: 'bearer' })
        .send({
            "email": "example@gmail.com",
        })
        .expect(400)
})

test('DEL /:id correct id', async () => {
    return await supertest(app).delete(`/api/users/${userId}`)
        .auth(userToken, { type: 'bearer' })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if (res.body.data.email !== "example@gmail.com") throw new Error('Wrong email')
        })
})

test('DEL /:id wrong id', async () => {
    return await supertest(app).delete(`/api/users/${userId}`)
        .auth(userToken, { type: 'bearer' })
        .expect(400)
})