const app = require('../app')
const supertest = require('supertest')
const db = require('../db')

let scoreId
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

test('GET all scores with no scores', async () => {
    return await supertest(app).get('/api/scores')
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data[0]) throw new Error('Returned scores when none exist')
        })
})

test('POST new score', async () => {
    return await supertest(app).post('/api/scores')
        .auth(userToken, {type: 'bearer'})
        .send({
            "user": "61ce13f7bae8a1b1654b20c5",
            "course": "61ce28feea913be25b0fb1a4",
            "date": "1640900980786",
            "strokes": 75,
            "fairwayPercentage": 0.5,
            "greenPercentage": 0.75346,
            "putts": 28
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
            if(res.body.data.strokes !== 75) throw new Error("Wrong strokes")

            scoreId = res.body.data._id
        })
})

test('GET all courses with one score', async () => {
    return await supertest(app).get('/api/scores')
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(!res.body.data[0]) throw new Error('Returned no scores when one exists')
        })
})

test('GET /:id correct ID', async() => {
    return await supertest(app).get(`/api/scores/${scoreId}`)
        .auth(userToken, {type: 'bearer'})
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.strokes !== 75) throw new Error("Wrong number of strokes")
        })
})

test('GET /:id wrong ID', async() => {
    return await supertest(app).get(`/api/scores/${fakeId}`).auth(userToken, {type: 'bearer'}).expect(404)
})

test('PUT /:id update strokes', async() => {
    return await supertest(app).put(`/api/scores/${scoreId}`)
        .auth(userToken, {type: 'bearer'})
        .send({
            "strokes": 76,
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.strokes !== 76) throw new Error("Strokes not updated correctly")
        })
})

test('PUT /:id wrong id', async() => {
    return await supertest(app).put(`/api/scores/${fakeId}`)
        .auth(userToken, {type: 'bearer'})
        .send({
            "duh": "idk",
        })
        .expect(400)
})

test('PUT /:id wrong type', async() => {
    return await supertest(app).put(`/api/scores/${fakeId}`)
        .auth(userToken, {type: 'bearer'})
        .send({
            "strokes": "77"
        })
        .expect(400)
})

test('DEL /:id invalid token', async() => {
    return await supertest(app).delete(`/api/scores/${scoreId}`)
        .auth('al;djkfa;lsdhga bwrpq09pasdfs', {type: 'bearer'})
        .expect(403)
})

test('DEL /:id correct id', async() => {
    return await supertest(app).delete(`/api/scores/${scoreId}`)
        .auth(userToken, {type: 'bearer'})
        .expect(200)
        .then((res) => {
            if(res.body.data.strokes !== 76) throw new Error('Wrong number of strokes')
        })
})

test('DEL /:id wrong id', async() => {
    return await supertest(app).delete(`/api/scores/${scoreId}`)
        .auth(userToken, {type: 'bearer'})
        .expect(400)
})