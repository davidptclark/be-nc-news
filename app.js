const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getUsers } = require('./controllers/users.controller');
const {
  getArticleById,
  patchVotesByID,
  getArticles,
} = require('./controllers/articles.controller');
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require('./controllers/comments.controller');
const {
  handle404,
  handle500,
  handlePsqlErrors,
  handleCustomErrors,
} = require('./controllers/errors.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchVotesByID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

app.get('/api/users', getUsers);

app.all('/*', handle404); //Using app.all to apply this controller function to all bad paths
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500);

module.exports = app;
