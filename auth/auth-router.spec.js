const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');



describe('Sprint DB features', () => {    
    describe('Post /register', () => {
        it("should not register user without password", async () => {
            const res = await request(server)
              .post("/api/auth/register")
              .send({ username: "no password"});
            expect(res.status).toBe(500);
            expect(res.type).toBe("text/html");
          });
        it('Should return json', () => {
            request(server)
            .post('/api/auth/register')
            .send({username: 'pass', password: 'pass'})
            .expect('Content-Type', /json/)
        })
    });


    describe('Post /login', () => {
        it('Should not return 200 without a registered user', async (done) => {
            request(server)
                .post('/api/auth/login')
                .send({username: 'lambda', password: 'lambda'})
                .expect(500, done)
        })
        it('Should return json', () => {
            request(server)
                .post('/api/auth/login')
                .send({username: 'Aaron', password: 'pass'})
                .expect('Content-Type', /json/)                
        })
    })

    let token;

    beforeAll((done) => {
        request(server)
            .post('/api/auth/login')
            .send({username: 'Unregistered', password: 'pass'})
            .end((err, res) => {
                token = res.body.token;
                done();
            })
    })

    describe('Get /', () => {
        it('Should return 401 with no auth', (done) => {
            request(server)
                .get('/api/auth')
                .expect(401, done)
                .expect('Content-Type', /json/)
        })
        it('Should return json', (done) => {
            request(server)
                .get('/api/auth')
                .expect('Content-Type', /json/)
                done()
        })
        // it('Should return 200 with auth', (done) => {
        //     console.log(token)
        //     request(server)
        //         .get('/api/auth')
        //         .set('authorization', token)
        //         .expect(200, done)
        // })
    })

})