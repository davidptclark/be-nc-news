const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const {
  getArticleById,
  patchVotesByID,
} = require('./controllers/articles.controller');
const {
  handle404,
  handle500,
  handlePsqlErrors,
  handleCustomErrors,
} = require('./controllers/errors.controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchVotesByID);

app.all('/*', handle404); //Using app.all to apply this controller function to all bad paths
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500);

module.exports = app;