'use strict';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../models/user.model');

chai.use(chaiHttp);

describe(('Auth Controllers'), () => {
    // clear existing data
    beforeEach((done) => {
        User.deleteOne({}, (err) => {
            done();
        });
    });

    // register new user
    describe('Register User => /POST /api/auth/register', () => {
        it('It should not register new user without password.', (done) => {
            let user = {
                name: 'John Connor',
                email: 'john123@gmail.com',
                phone: '9876543210'
            }
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.should.have.property('_message');
                    res.body._message.should.equal('User validation failed');
                    done();
                });
        });

        it('It should register new user.', (done) => {
            let user = {
                name: 'John Connor',
                email: 'john123@gmail.com',
                phone: '9876543210',
                password: 'User@1234'
            }
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.equal('success');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('phone');
                    done();
                });
        });
    });

    // login user
    describe('Login User => /POST /api/auth/login', () => {
        it('It should not login without email/password', (done) => {
            let user = new User({
                name: 'John Connor',
                email: 'john123@gmail.com',
                phone: '9876543210',
                password: 'User@1234',
                registerType: 'user'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ email: 'john@gmail.com', password: 'User@1234' })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(401);
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.data.should.have.property('message').eql('Inavlid email and password')
                        done();
                    });
            });
        });

        it('It should return success login user response', (done) => {
            let user = new User({
                name: 'Edwin Daniel',
                email: 'edwin.daniel@gmail.com',
                phone: '351-400-5704',
                password: 'User@1234',
                registerType: 'user'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ email: 'edwin.daniel@gmail.com', password: 'User@1234' })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.should.have.property('token');
                        res.body.status.should.equal('success');
                        res.body.data.should.have.property('email');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('phone');
                        res.body.data.should.have.property('registerType');
                        done();
                    });
            });
        });
    });
});