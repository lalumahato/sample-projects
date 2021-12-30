'use strict';
require('dotenv').config();
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Article = require('../models').Article;
chai.use(chaiHttp);

describe('Article API\'s', () => {
    // delete all data before test
    before(async () => {
        await Article.destroy({
            where: {},
            truncate: { cascade: true }
        });
    });
    describe('Create Article', () => {
        it('It should failed bcz of adding article without title.', (done) => {
            let article = {
                user_id: "1",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            }
            chai.request(server)
                .post('/api/v1/article')
                .send(article)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(400);
                    res.body.should.have.property('error').equal('"title" is required');
                    done();
                });
        });

        it('It should return success response of adding article.', (done) => {
            let article = {
                title: 'Lorem Ipsum Dummy',
                user_id: "1",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            }
            chai.request(server)
                .post('/api/v1/article')
                .send(article)
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(201);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('title');
                    res.body.data.should.have.property('description');
                    done();
                });
        });
    });

    describe('List Article', () => {
        it('It should return success response of articles list.', (done) => {
            chai.request(server)
                .get('/api/v1/article')
                .end((err, res) => {
                    res.should.be.a.json;
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                    done();
                });
        });
    });
    describe('Find Article', () => {
        it('It should failed bcz invalid article id.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });

            let res = await chai
                .request(server)
                .get('/api/v1/article/' + (article.id + 1));

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('Article Not Found');
        });
        it('It should return success response of finding article.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });

            let res = await chai
                .request(server)
                .get('/api/v1/article/' + article.id);

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('description');
        });
    });

    describe('Update User', () => {
        it('It should return failed response of updating an article.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });
            let res = await chai
                .request(server)
                .put('/api/v1/article/' + (article.id + 1))
                .send({ title: 'Lorem Ipsum' });

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('Article Not Found');
        });
        it('It should return success response of updating an article.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });
            let res = await chai
                .request(server)
                .put('/api/v1/article/' + article.id)
                .send({ title: 'Lorem Ipsum' });

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('description');
        });
    });

    describe('Delete User', () => {
        it('It should return failed response of deleting an article.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });
            let res = await chai
                .request(server)
                .delete('/api/v1/article/' + (article.id + 1));

            res.should.be.a.json;
            res.should.have.status(404);
            res.body.should.have.property('message').equal('Article Not Found');
        });
        it('It should return success response of deleting an article.', async () => {
            let article = await Article.create({
                title: 'Lorem Ipsum Dummy',
                user_id: "2",
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            });
            let res = await chai
                .request(server)
                .delete('/api/v1/article/' + article.id);

            res.should.be.a.json;
            res.should.have.status(200);
            res.body.should.have.property('data');
        });
    });
});
