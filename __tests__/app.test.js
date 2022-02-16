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
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test('Status 200 - should respond with specified article object with comment_count property', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: '11',
            })
          );
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
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
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
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
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
  describe('GET - /api/articles', () => {
    test('Status: 200 - should respond with an array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: articles }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String), //Had to change to string given SQL formatting from number to string
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test('Status: 200 - should respond with an array of article objects in descending order of date ', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: articles }) => {
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    //404 (invalid path -  handled and previously tested); 500 (server error - handled)
  });
  describe('GET - /api/articles/:article_id/comments', () => {
    test('Status: 200 - responds with an array of comments for given article_id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: comments }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    test('Status: 200 - responds with an empty array if existing article has no associated comments', () => {
      return request(app)
        .get('/api/articles/4/comments')
        .expect(200)
        .then(({ body: comments }) => {
          expect(comments).toHaveLength(0);
        });
    });
    test('Status: 400 - responds with message "bad request" when passed invalid id', () => {
      return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('bad request');
        });
    });
    test('Status: 404 - responds with "article not found" for valid but non-existent article', () => {
      return request(app)
        .get('/api/articles/100000/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('article not found');
        });
    });
  });
});
