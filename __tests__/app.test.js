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
    test('Status: 200 - should respond with specified article in an object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
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
});
