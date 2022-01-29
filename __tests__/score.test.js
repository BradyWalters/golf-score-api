const app = require('../app')
const supertest = require('supertest')
const db = require('../db')

let scoreId
const fakeId = db.Types.ObjectId()

beforeAll(() => {
    return db.connection.dropDatabase()
})

afterAll(() => {
    return db.connection.close()
})

test('GET all scores with no scores', async () => {
    return await supertest(app).get('/api/scores')
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data[0]) throw new Error('Returned scores when none exist')
        })
})

test('POST new score', async () => {
    return await supertest(app).post('/api/scores')
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
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(!res.body.data[0]) throw new Error('Returned no scores when one exists')
        })
})

test('GET /:id correct ID', async() => {
    return await supertest(app).get(`/api/scores/${scoreId}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.strokes !== 75) throw new Error("Wrong number of strokes")
        })
})

test('GET /:id wrong ID', async() => {
    return await supertest(app).get(`/api/scores/${fakeId}`).expect(404)
})

test('PUT /:id update strokes', async() => {
    return await supertest(app).put(`/api/scores/${scoreId}`)
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
        .send({
            "duh": "idk",
        })
        .expect(400)
})

test('PUT /:id wrong type', async() => {
    return await supertest(app).put(`/api/scores/${fakeId}`)
        .send({
            "strokes": "77"
        })
        .expect(400)
})

test('DEL /:id correct id', async() => {
    return await supertest(app).delete(`/api/scores/${scoreId}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data.strokes !== 76) throw new Error('Wrong number of strokes')
        })
})

test('DEL /:id wrong id', async() => {
    return await supertest(app).delete(`/api/scores/${scoreId}`)
        .expect(400)
})