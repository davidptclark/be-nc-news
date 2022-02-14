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
});
