const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { handle404, handle500 } = require('./controllers/errors.controller');

const app = express();

app.get('/api/topics', getTopics);

app.all('/*', handle404); //Using app.all to apply this controller function to all bad paths

app.use(handle500);

module.exports = app;
