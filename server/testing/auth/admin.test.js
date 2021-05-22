/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */

const request = require('supertest');

const app = request('localhost:3000/api');

const OK_200 = 200;
const AUTH_REQ_401 = 401;
const NOT_FOUND_404 = 404;

describe('Admin account exists', () => {
    it('Login to admin account', async () => {
      const response = await app.post('/admins/login')
        .send({
          username: 'adminA',
          password: 'edropTest123',
        });
  
      expect(response.status).toBe(OK_200);
      expect(response.body).toHaveProperty('id');
    });
  });