const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

afterAll(() => db.end()); // Prevent Jest from hanging after testing

beforeEach(() => seed(data)); // Ensures re-seed before testing

describe('app', () => {
  describe('GET - /api/topics', () => {
    test('Status: 200 - responds with an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(topics).toEqual(
            expect.objectContaining([
              {
                description: expect.any(String),
                slug: expect.any(String),
              },
            ])
          );
        });
    });
    test('Status: 404 - response with message: path not found', () => {
      return request(app)
        .get('/not/a/path')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path not found');
        });
    });
  });
  describe('GET - /api/articles/:article_id', () => {
    test('Status: 200 - should respond with specified article in an object with both key (article) and value (object)', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: article }) => {
          expect.objectContaining({
            article: {
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
            },
          });
        });
    });
    test('Status: 400 - should respond with error message: bad request', () => {
      return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('bad request');
        });
    });
    test('Status: 404 - should respond with error message for a valid but non-existent: article not found', () => {
      return request(app)
        .get('/api/articles/972390472')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('article not found');
        });
    });
  });
  describe('PATCH -  /api/articles/:article_id', () => {
    //404 and 500 already covered
    test('Status: 200 - should respond with updated article', () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch('/api/articles/1')
        .send(voteUpdate)
        .expect(200)
        .then(({ body: { article } }) => {
          expect.objectContaining({
            article: {
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
            },
          });
          expect(article.votes).toBe(110);
        });
    });
    test('Status: 200 - should respond with updated article if number passed is negative', () => {
      const voteUpdate = { inc_votes: -10 };
      return request(app)
        .patch('/api/articles/1')
        .send(voteUpdate)
        .expect(200)
        .then(({ body: { article } }) => {
          expect.objectContaining({
            article: {
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
            },
          });
          expect(article.votes).toBe(90);
        });
    });
    test('Status: 400 - responds with error message "bad request", when value is not a number', () => {
      const invalidUpdate = { inc_votes: 'not-a-number' };
      return request(app)
        .patch('/api/articles/1')
        .send(invalidUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('bad request');
        });
    });
    test('Status: 400 - should respond with error message "bad request", when id is invalid', () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch('/api/articles/not-an-id')
        .send(voteUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('bad request');
        });
    });
    test('Status: 404 - should respond with error message for a valid but non-existent: article not found', () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch('/api/articles/972390472')
        .send(voteUpdate)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('article not found');
        });
    });
  });
  describe('GET - /api/users', () => {
    test('Status: 200 - should respond with an array of user objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: users }) => {
          expect(users).toHaveLength(4);
          expect(users).toEqual(
            expect.objectContaining([
              {
                username: expect.any(String), //Other properties exist in this object but ticket explicitly asks for just this single property
              },
            ])
          );
        });
    }); //404 (invalid path -  handled and previously tested); 500 (server error - handled)
  });
});
