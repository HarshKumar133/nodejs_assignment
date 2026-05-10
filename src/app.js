const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const AppError = require('./utils/appError');
const { sendError } = require('./utils/response');

const app = express();

app.use(express.json());
app.use('/', schoolRoutes);

app.use((req, res) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found.`);
});

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return sendError(res, error.statusCode, error.message, error.errors);
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', error);
  return sendError(res, 500, 'Internal server error.');
});

module.exports = app;
