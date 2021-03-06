const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end()); // Prevent Jest from hanging after testing

beforeEach(() => seed(data)); // Ensures re-seed before testing

describe("app", () => {
  describe("GET - /api/topics", () => {
    test("Status: 200 - responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
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
    test("Status: 404 - response with message: path not found", () => {
      return request(app)
        .get("/not/a/path")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
  describe("GET - /api/articles/:article_id", () => {
    test("Status: 200 - should respond with specified article in an object with both key (article) and value (object)", () => {
      return request(app)
        .get("/api/articles/1")
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
    test("Status 200 - should respond with specified article object with comment_count property", () => {
      return request(app)
        .get("/api/articles/1")
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
              comment_count: "11",
            })
          );
        });
    });
    test("Status: 400 - should respond with error message: bad request", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test("Status: 404 - should respond with error message for a valid but non-existent: article not found", () => {
      return request(app)
        .get("/api/articles/972390472")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
  });
  describe("PATCH -  /api/articles/:article_id", () => {
    //404 and 500 already covered
    test("Status: 200 - should respond with updated article", () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/1")
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
    test("Status: 200 - should respond with updated article if number passed is negative", () => {
      const voteUpdate = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/1")
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
      const invalidUpdate = { inc_votes: "not-a-number" };
      return request(app)
        .patch("/api/articles/1")
        .send(invalidUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test('Status: 400 - should respond with error message "bad request", when id is invalid', () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/not-an-id")
        .send(voteUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test("Status: 404 - should respond with error message for a valid but non-existent: article not found", () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/972390472")
        .send(voteUpdate)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
  });
  describe("GET - /api/users", () => {
    test("Status: 200 - should respond with an array of user objects", () => {
      return request(app)
        .get("/api/users")
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
  describe("GET - /api/users/:username", () => {
    test("Status: 200 - should respond with a single user object", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body: user }) => {
          expect(user).toHaveLength(1);
        });
    });
    test("Status: 404 - should response with error if user is valid but non-existant", () => {
      return request(app)
        .get("/api/users/not-a-user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("username not found");
        });
    });
  });
  describe("GET - /api/articles", () => {
    test("Status: 200 - should respond with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
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
    test("Status: 200 - should respond with an array of article objects in descending order of date ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: articles }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("Status: 200 - should respond with an array of article objects with comment count property ", () => {
      return request(app)
        .get("/api/articles")
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
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("Status: 200 - should respond with an array of article objects sorted by user's choice", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: articles }) => {
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    }); //default (date) is tested above
    test("Status: 200 - should respond with an array of article objects sorted by date asc by user's choice ", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: articles }) => {
          expect(articles).toBeSortedBy("created_at");
        });
    });
    test("Status: 200 - should respond with an array of article objects filtered by user's choice of topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: articles }) => {
          articles.forEach((article) => {
            expect(articles).toHaveLength(1);
            expect(article).toMatchObject({
              //Stricter matcher
              topic: "cats",
            });
          });
        });
    });
    test('Status: 400 - should respond with "invalid sort query" if given an invalid sort_by query', () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid sort query");
        });
    });
    test('Status: 400 - should respond with "invalid order query" if given an invalid order query', () => {
      return request(app)
        .get("/api/articles?order=invalid_query")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid order query");
        });
    });
    test('Status: 404 - should respond with "topic not found" if topic is valid and not found', () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("topic not found");
        });
    });
    test("Status: 200 - valid `topic` query, but has no articles responds with an empty array of articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: articles }) => {
          articles.forEach((article) => {
            expect(article).toHaveLength(0);
          });
        });
    });
  });
  describe("GET - /api/articles/:article_id/comments", () => {
    test("Status: 200 - responds with an array of comments for given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
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
    test("Status: 200 - responds with an empty array if existing article has no associated comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: comments }) => {
          expect(comments).toHaveLength(0);
        });
    });
    test('Status: 400 - responds with message "bad request" when passed invalid id', () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test('Status: 404 - responds with "article not found" for valid but non-existent article', () => {
      return request(app)
        .get("/api/articles/100000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found");
        });
    });
  });
  describe("POST - /api/articles/:article_id/comments", () => {
    test("Status: 201 - should return posted comment when given valid id and valid comment object", () => {
      const testComment = { username: "icellusedkars", body: "Some words." };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 4,
              comment_id: 19, //this is NOT counting comments by user but just total number of comments
              votes: 0,
              created_at: expect.any(String),
              author: "icellusedkars", //CAREFUL: this user MUST be registered and be within users table before commenting otherwise violates FK constraint
              body: "Some words.",
            })
          );
        });
    });
    test("Status: 201 - should return posted comment when given valid id and valid comment object even with redundant properties", () => {
      const testComment = {
        username: "icellusedkars",
        body: "Some words.",
        magic: false,
      };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 4,
              comment_id: 19,
              votes: 0,
              created_at: expect.any(String),
              author: "icellusedkars",
              body: "Some words.",
            })
          );
        });
    });
    test("Status: 404 - should respond with error message for a valid but unregistered user", () => {
      const testComment = { username: "not-registered", body: "Some words." };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (author)=(not-registered) is not present in table "users".'
          );
        });
    });
    test('Status: 404 - responds with "article not found" for valid but non-existent article', () => {
      const testComment = { username: "icellusedkars", body: "Some words." };
      return request(app)
        .post("/api/articles/4564574/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (article_id)=(4564574) is not present in table "articles".'
          );
        });
    });
    test('Status: 400 - responds with message "bad request" when passed invalid id', () => {
      const testComment = { username: "icellusedkars", body: "Some words." };
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test('Status: 400 - responds with message "missing fields in request" when passed object with fewer than one key', () => {
      const testComment = { username: "icellusedkars" };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("missing fields in request");
        });
    });
    test('Status: 400 - should return message "invalid key" when username key is not valid', () => {
      const testComment = { banana: "icellusedkars", body: "Some words." };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid key");
        });
    });
    test('Status: 400 - should return message "invalid key" when body key is not valid', () => {
      const testComment = {
        user: "not-registered",
        flyingbird: "Some words.",
      };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid key");
        });
    });
  });
  describe("PATCH - /api/comments/:comment_id/", () => {
    test("Status: 200 - should respond with updated comment and vote count", () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/1/")
        .send(voteUpdate)
        .expect(200)
        .then(({ body: comment }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 26,
              author: "butter_bridge",
              article_id: 9,
            })
          );
          expect(comment.votes).toBe(26);
        });
    });
    test("Status: 200 - should respond with updated comment and vote count when a negative vote", () => {
      const voteUpdate = { inc_votes: -10 };
      return request(app)
        .patch("/api/comments/1/")
        .send(voteUpdate)
        .expect(200)
        .then(({ body: comment }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 6,
              author: "butter_bridge",
              article_id: 9,
            })
          );
          expect(comment.votes).toBe(6);
        });
    });
    test('Status: 400 - responds with error message "bad request", when value is not a number', () => {
      const invalidUpdate = { inc_votes: "not-a-number" };
      return request(app)
        .patch("/api/comments/1")
        .send(invalidUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test('Status: 400 - should respond with error message "bad request", when id is invalid', () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/not-an-id")
        .send(voteUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test("Status: 404 - should respond with error message for a valid but non-existent: article not found", () => {
      const voteUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/972390472")
        .send(voteUpdate)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment does not exist");
        });
    });
  });
  describe("DELETE - /api/comments/:comment_id", () => {
    test("Status: 204 - should delete comment by given id and return no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("Status: 204 - comment table contains one fewer comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db.query("SELECT * FROM comments").then(({ rows }) => {
            expect(rows).toHaveLength(17);
          });
        });
    });
    test('Status: 400 - should return "bad request" when passed an invalid id ', () => {
      return request(app)
        .delete("/api/comments/not-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("bad request");
        });
    });
    test('Status: 404 - should return "comment does not exist" when passed a valid but non-existent comment id', () => {
      return request(app)
        .delete("/api/comments/2363457")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("comment does not exist");
        });
    });
  });
  describe("GET /api", () => {
    test("Status: 200 should responds with endpoint descriptions", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.descriptions["GET /api"]).toEqual({
            description:
              "serves up a json representation of all the available endpoints of the api",
          });
        });
    });
  });
});
