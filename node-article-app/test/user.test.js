'use strict';
require('dotenv').config();
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../models').User;
chai.use(chaiHttp);

describe('User API\'s', () => {
    // delete all data before test
    before(async () => {
        await User.destroy({
            where: {},
            truncate: { cascade: true }
        });
    });

    describe('Create New User', () => {
        it('It should failed due to adding new user without phone number.', (done) => {
            let user = {
                name: 'Elsie Gibson',
                email: 'elsie.gibson@gmail.com'
            }
            chai.request(server)
                .post('/api/v1/user')
                .send(user)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(400);
                    res.body.should.have.property('error').equal('"phone" is required');
                    done();
                });
        });

        it('It should return success response of adding new user.', (done) => {
            let user = {
                name: 'Nicole Hart',
                email: 'nicole.hart@gmail.com',
                phone: '(317)-205-8718'
            }
            chai.request(server)
                .post('/api/v1/user')
                .send(user)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(201);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('email');
                    done();
                });
        });
    });

    describe('List Users', () => {
        it('It should return success response of users list.', (done) => {
            chai.request(server)
                .get('/api/v1/user')
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    done();
                });
        });
    });

    describe('Find User', () => {
        it('It should failed response due to invalid user id.', async () => {
            let user = await User.create({
                name: 'Sandra Mason',
                email: 'sandra.mason@gmail.com',
                phone: '(449)-124-2139'
            });

            let res = await chai
                .request(server)
                .get('/api/v1/user/' + (user.id + 1));

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('User Not Found');
        });
        it('It should return success response of find user by id.', async () => {
            let user = await User.create({
                name: 'Janet Ortiz',
                email: 'janet.ortiz@gmail.com',
                phone: '(938)-581-3211'
            });

            let res = await chai
                .request(server)
                .get('/api/v1/user/' + user.id);

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
        });
    });

    describe('Update User', () => {
        it('It should failed response of update a user.', async () => {
            let user = await User.create({
                name: 'Carla Reyes',
                email: 'carla.reyes@gmail.com',
                phone: '(115)-156-7804'
            });

            let res = await chai
                .request(server)
                .put('/api/v1/user/' + (user.id + 1))
                .send({ name: 'Carla Reyes', phone: '(115)-156-1122' });

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('User Not Found');
        });
        it('It should return success response of update user details.', async () => {
            let user = await User.create({
                name: 'Debra Reed',
                email: 'debra.reed@gmail.com',
                phone: '(820)-669-5799'
            });

            let res = await chai
                .request(server)
                .put('/api/v1/user/' + user.id)
                .send({ name: 'Debra Reeds', phone: '(820)-669-1242' });

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.have.property('email');
        });
    });

    describe('Delete User', () => {
        it('It should failed response of delete a user.', async () => {
            let user = await User.create({
                name: 'Florence Fowler',
                email: 'florence.fowler@gmail.com',
                phone: '(573)-774-1949'
            });

            let res = await chai
                .request(server)
                .delete('/api/v1/user/' + (user.id + 1));

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('User Not Found');
        });
        it('It should return success response of delete a user.', async () => {
            let user = await User.create({
                name: 'Vivan Henderson',
                email: 'vivan.henderson@gmail.com',
                phone: '(101)-468-8302'
            });

            let res = await chai
                .request(server)
                .delete('/api/v1/user/' + user.id);

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
        });
    });
});
