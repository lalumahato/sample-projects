'use strict';
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const User = require('../models/user.model');
const should = chai.should();
const token = process.env.JWT_TOKEN;

chai.use(chaiHttp);

describe('User Controllers', () => {
    // clear existing data
    beforeEach((done) => {
        User.deleteOne({}, (err) => {
            done();
        });
    });

    // list all users list
    describe('Users List => /GET /api/user/list-users', () => {
        it('It should return all users list.', (done) => {
            chai.request(server)
                .get('/api/user/list-users')
                .set({ 'Authorization': `Bearer ${token}` })
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('status');
                    res.body.status.should.equal('success');
                    done();
                });
        });
    });

    // Get user by UserId
    describe('Find List => /GET /api/user/find-user/:userId', () => {
        it('It should return user details by userId.', (done) => {
            let user = new User({
                name: 'Peter Parker',
                email: 'Peter.parker@gmail.com',
                phone: '9837263910',
                password: 'User@1234'
            });
            user.save((err, user) => {
                chai.request(server)
                    .get('/api/user/find-user/' + user.id)
                    .set({ 'Authorization': `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('success');
                        res.body.data.should.have.property('_id').eql(user.id);
                        done();
                    });
            });
        });
    });

    // update user by userId
    describe('Update User => /PUT /api/user/update-user/:userId', () => {
        it('It should not update user with invalid userId', (done) => {
            let user = new User({
                name: 'Meagan Nima',
                email: 'Meagan83@yahoo.com',
                phone: '945-653-2605',
                password: 'User@1234'
            });
            let temp = new User();
            user.save((err, user) => {
                chai.request(server)
                    .put('/api/user/update-user/' + temp._id)
                    .set({ 'Authorization': `Bearer ${token}` })
                    .send({ name: 'Smith Parker', phone: '945-653-2605' })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.data.should.have.property('message').eql('User not found with userId: ' + temp._id)
                        done();
                    });
            });
        });

        it('It should update user detail of a given id', (done) => {
            let user = new User({
                name: 'Peter Parker',
                email: 'Peter.parker@gmail.com',
                phone: '9837263910',
                password: 'User@1234'
            });
            user.save((err, user) => {
                chai.request(server)
                    .put('/api/user/update-user/' + user.id)
                    .set({ 'Authorization': `Bearer ${token}` })
                    .send({ name: 'Dave parker', 'phone': '9836273928' })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('success');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('phone');
                        res.body.data.should.have.property('_id').eql(user.id);
                        res.body.data.should.have.property('email').eql(user.email);
                        done();
                    });
            });
        });
    });

    // Delete user by UserId
    describe('Delete User => /DELETE /api/user/delete-user/:userId', () => {
        it('It should not delete user with invalid userId', (done) => {
            let user = new User({
                name: 'Meagan Nima',
                email: 'Meagan83@yahoo.com',
                phone: '945-653-2605',
                password: 'User@1234'
            });
            let temp = new User();
            user.save((err, user) => {
                chai.request(server)
                    .delete('/api/user/delete-user/' + temp._id)
                    .set({ 'Authorization': `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(400);
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('failed');
                        res.body.data.should.have.property('message').eql('User not found with userId: ' + temp._id)
                        done();
                    });
            });
        });
        it('It should delete a user by userId.', (done) => {
            let user = new User({
                name: 'Peter Parker',
                email: 'Peter.parker@gmail.com',
                phone: '9837263910',
                password: 'User@1234'
            });
            user.save((err, user) => {
                chai.request(server)
                    .delete('/api/user/delete-user/' + user.id)
                    .set({ 'Authorization': `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.be.a.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.should.have.property('status');
                        res.body.status.should.equal('success');
                        res.body.data.should.have.property('message').eql('User deleted successfully.');
                        done();
                    });
            });
        });
    });
});
