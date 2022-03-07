const express = require('express');
const {
  handle404,
  handle500,
  handlePsqlErrors,
  handleCustomErrors,
} = require('./controllers/errors.controller');
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', handle404); //Using app.all to apply this controller function to all bad paths
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500);

module.exports = app;
