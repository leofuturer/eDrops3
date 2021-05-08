/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */

const request = require('supertest');

const app = request('localhost:3000/api');

// taken from https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

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

describe('Create new customer', () => {
  it('Does not require authentication', async () => {
    const response = await app.post('/customers')
      .send({
        firstName: 'testFN',
        lastName: 'testLN',
        phoneNumber: '111-222-3333',
        userType: 'person',
        username: 'testUsername',
        password: 'aA12345678',
        email: 'test@example.com',
      });

    expect(response.status).toBe(OK_200);
  });
});

describe('Get all customers', () => {
  it('Requires authentication', async () => {
    const response = await app.get('/customers');
    expect(response.status).toBe(AUTH_REQ_401);
  });

  it('Requires admin token', async () => {
    // First log in admin to get admin token
    let response = await app.post('/admins/login')
      .send({
        username: 'adminA',
        password: 'edropTest123',
      });

    expect(response.status).toBe(OK_200);
    expect(response.body).toHaveProperty('id');

    const adminToken = response.body.id;

    response = await app.get('/customers')
      .set('Authorization', adminToken);

    expect(response.status).toBe(OK_200);
    // nonzero length because we created a customer earlier
    expect(response.body.length).not.toBe(0);
  });
});

describe('Get customer by id', () => {
  it('Requires authentication', async () => {
    const response = await app.get('/customers/1/');
    expect(response.status).toBe(AUTH_REQ_401);
  });
});

describe('Delete customer by id', () => {
  it('Requires authentication', async () => {
    const response = await app.delete('/customers/1/');
    expect(response.status).toBe(AUTH_REQ_401);
  });
});

describe('Patch customer by id', () => {
  it('Requires authentication', async () => {
    const response = await app.patch('/customers/1/');
    expect(response.status).toBe(AUTH_REQ_401);
  });
});

describe('Change customer password', () => {
  it('Requires authentication', async () => {
    const response = await app.post('/customers/change-password/');
    expect(response.status).toBe(AUTH_REQ_401);
  });
});

describe('Customer password reset', () => {
  // /reset takes in email and generates reset password token
  it('Use userBase /reset instead', async () => {
    const response = await app
      .post('/customers/reset/');
    expect(response.status).toBe(NOT_FOUND_404);
  });

  it('Use userBase /reset-password instead', async () => {
    const response = await app
      .post('/customers/reset-password/');
    expect(response.status).toBe(NOT_FOUND_404);
  });
});
