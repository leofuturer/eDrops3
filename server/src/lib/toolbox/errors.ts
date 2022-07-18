export interface ErrorWithStatus extends Error {
  status: number;
}
export const errors = {
  badRequest: (msg: string) => {
    const error = new Error(msg || 'Bad Request') as ErrorWithStatus;
    error.status = 400;
    return error;
  },
  unauthorized: (msg: string) => {
    const error = new Error(msg || 'Unauthorized') as ErrorWithStatus;
    error.status = 401;
    return error;
  },
  forbidden: (msg: string) => {
    const error = new Error(msg || 'Forbidden') as ErrorWithStatus;
    error.status = 403;
    return error;
  },
  notFound: (msg: string) => {
    const error = new Error(msg || 'Not Found') as ErrorWithStatus;
    error.status = 404;
    return error;
  },
  validationError: (msg: string) => {
    const error = new Error(msg || 'Validation Error') as ErrorWithStatus;
    error.status = 422;
    return error;
  },
  internalServerError: (msg: string) => {
    const error = new Error(msg || 'Internal Server Error') as ErrorWithStatus;
    error.status = 500;
    return error;
  },
};
