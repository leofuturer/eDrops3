'use strict';

module.exports = {
  badRequest: (msg) => {
    const error = new Error(msg || 'Bad Request');
    error.status = 400;
    return error;
  },
  unauthorized: (msg) => {
    const error = new Error(msg || 'Unauthorized');
    error.status = 401;
    return error;
  },
  forbidden: (msg) => {
    const error = new Error(msg || 'Forbidden');
    error.status = 403;
    return error;
  },
  notFound: (msg) => {
    const error = new Error(msg || 'Not Found');
    error.status = 404;
    return error;
  },
  validationError: (msg) => {
    const error = new Error(msg || 'Validation Error');
    error.status = 422;
    return error;
  },
  internalServerError: (msg) => {
    const error = new Error(msg || 'Internal Server Error');
    error.status = 500;
    return error;
  },
};
