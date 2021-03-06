const app = require('../app')
const supertest = require('supertest')
const db = require('../db')

let courseId
let userToken
const fakeId = db.Types.ObjectId()

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

            userToken = res.body.token
        })
})

test('GET all courses with no courses', async () => {
    return await supertest(app).get('/api/courses')
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data[0]) throw new Error('Returned courses when none exist')
        })
})

test('POST new course', async () => {
    return await supertest(app).post('/api/courses')
        .auth(userToken, {type: 'bearer'})
        .send({
            "name": "Warm Springs Golf Course",
			"holes": 18,
			"address": "2495 Warm Springs Ave Boise, ID 83712",
			"tees": [
				{
					"par": 72,
					"yards": 6974,
					"color": "blue",
					"slope": 122,
					"rating": 72.2,
				}
			],
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
            if(res.body.data.holes !== 18) throw new Error("Wrong number of holes")
            if(res.body.data.name !== "Warm Springs Golf Course") throw new Error("Wrong Name")
            if(res.body.data.address !== "2495 Warm Springs Ave Boise, ID 83712") throw new Error("Wrong address")
            if(res.body.data.tees.length !== 1) throw new Error("Tees not added correctly")

            courseId = res.body.data._id
        })
})

test('GET all courses with one course', async () => {
    return await supertest(app).get('/api/courses')
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(!res.body.data[0]) throw new Error('Returned no users when one exists')
        })
})

test('GET /:id correct ID', async() => {
    return await supertest(app).get(`/api/courses/${courseId}`)
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.holes !== 18) throw new Error("Wrong number of holes")
            if(res.body.data.name !== "Warm Springs Golf Course") throw new Error("Wrong Name")
            if(res.body.data.address !== "2495 Warm Springs Ave Boise, ID 83712") throw new Error("Wrong address")
            if(res.body.data.tees.length !== 1) throw new Error("Tees not added correctly")
        })
})

test('GET /:id wrong ID', async() => {
    return await supertest(app).get(`/api/courses/${fakeId}`).auth(userToken, {type: 'bearer'}).expect(404)
})

test('PUT /:id add tee', async() => {
    return await supertest(app).put(`/api/courses/${courseId}`)
        .auth(userToken, {type: 'bearer'})
        .send({
            "tees": [
				{
					"par": 72,
					"yards": 6974,
					"color": "blue",
					"slope": 122,
					"rating": 72.2,
				},
                {
                    "par": 73,
                    "yards": 5236,
                    "color": "red",
                    "slope": 120,
                    "rating": 70.4
                },
			],
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.tees.length !== 2) throw new Error("Tees not properly updated")
        })
})

test('PUT /:id wrong id', async() => {
    return await supertest(app).put(`/api/courses/${fakeId}`)
        .auth(userToken, {type: 'bearer'})
        .send({
            "name": "Quail Hollow Golf Course",
        })
        .expect(400)
})

test('DEL /:id invalid token', async() => {
    return await supertest(app).delete(`/api/courses/${courseId}`)
        .auth('ajdfpasdojfkadspfjas/vnvas;asd3-48', {type: 'bearer'})
        .expect(403)
})

test('DEL /:id wrong id', async() => {
    return await supertest(app).delete(`/api/courses/${fakeId}`)
        .auth(userToken, {type: 'bearer'})
        .expect(400)
})

test('DEL /:id correct id', async() => {
    return await supertest(app).delete(`/api/courses/${courseId}`)
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.name !== "Warm Springs Golf Course") throw new Error('Wrong name')
        })
})