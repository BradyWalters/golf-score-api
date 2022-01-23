const app = require('../app')
const supertest = require('supertest')
const userController = require('../controllers/user.controller')
const db = require('../db')
const userSchema = require('../schemas/user.schema')
const { isAssertClause } = require('typescript')
const User = db.model('User', userSchema)

afterEach(() => {
    return db.connection.dropDatabase()
})

afterAll(() => {
    return db.connection.close()
})

test('add user with name and proper email', async () => {
    return await supertest(app).post('/users')
        .send({
            "email": "brady.walters5@gmail.com",
            "password": "password",
            "name": "Brady"
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
            if(res.body.data.email !== "brady.walters5@gmail.com") throw new Error("Wrong Email")
            if(res.body.data.name !== "Brady") throw new Error("Wrong Name")
        })
})

test('get users when none exist', async () => {
    return await supertest(app).get('/users')
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            if(res.body.data[0]) throw new Error("Returned something when nothing exists")
        })
})

// test('get all users when one exists', async () => {
//     const oneUser = new User({
//         "email": "brady.walters5@gmail.com",
//         "password": "password",
//         "name": "Brady"
//     })

//     oneUser.save((err) => {
//         throw err
//     })

//     return await supertest(app).get('/users')
//         .expect("Content-Type", /json/)
//         .expect(200)
//         .then((res) => {
//             console.log(res.body)
//             if(res.body.data.email !== "brady.walters5@gmail.com") throw new Error("Wrong Email")
//             if(res.body.data.name !== "Brady") throw new Error("Wrong Name")
//         })
// })