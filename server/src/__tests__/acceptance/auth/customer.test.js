/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */

const request = require('supertest');

const app = request('localhost:3000/api');

// taken from https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/

const OK_200 = 200;
const OK_EMPTY_204 = 204;
const AUTH_REQ_401 = 401;
const NOT_FOUND_404 = 404;

let adminToken;
let customerToken;
let newCustomerId;
let oldCustomerId;

describe('Customer tests', () => {
  // We have to surround everything in a top level `describe` block 
  // so htat beforeAll() and afterAll() will correctly run before 
  // and after all tests
  
  async function testSetUp(){
    console.log('Logging in to admin account');
    let response = await app.post('/admins/login')
      .send({
        username: 'adminA',
        password: 'edropTest123',
      });
    
    expect(response.status).toBe(OK_200);
  
    adminToken = response.body.id;
  
    console.log('Logging in to customer account');
    response = await app.post('/customers/login')
    .send({
      username: 'customerA',
      password: 'edropTest123',
    });
  
    expect(response.status).toBe(OK_200);
  
    customerToken = response.body.id;
    oldCustomerId = response.body.userId;
  }
  
  async function testTearDown(){
    console.log(`Deleting the new customer: id=${newCustomerId}`);
    const response = await app.delete(`/customers/${newCustomerId}`)
      .set('Authorization', adminToken);
    
    expect(response.status).toBe(OK_200);
    expect(response.body.count).toBe(1); // 1 account deleted
  }
  
  beforeAll(() => {
    // Obtain admin and customer tokens
    return testSetUp();
  });
  
  afterAll(() => {
    return testTearDown();
  })
  
  describe('Create new customer', () => {
    it('Does not require authentication', async () => {
      const response = await app.post('/customers')
        .send({
          firstName: 'testFN',
          lastName: 'testLN',
          phoneNumber: '111-222-3333',
          userType: 'person',
          username: 'testUsername2',
          password: '2aA12345678',
          email: 'test3@example.com',
        });
  
      expect(response.status).toBe(OK_200);
      expect(response.body).toHaveProperty('message');
      newCustomerId = response.body.id;
    });
  });
  
  describe('Get all customers', () => {
    it('Requires authentication', async () => {
      const response = await app.get('/customers');
      expect(response.status).toBe(AUTH_REQ_401);
    });
  
    it('Requires admin token', async () => {
      const response = await app.get('/customers')
        .set('Authorization', adminToken);
  
      expect(response.status).toBe(OK_200);
      // nonzero length because we created a customer earlier
      expect(response.body.length).not.toBe(0);
    });
  
    it('Does not work with customer token', async () => {
      response = await app.get('/customers')
        .set('Authorization', customerToken);
      
      expect(response.status).toBe(AUTH_REQ_401);
    });
  });
  
  describe('Get customer by id', () => {
    it('Requires authentication', async () => {
      const response = await app.get(`/customers/${oldCustomerId}/`);
      expect(response.status).toBe(AUTH_REQ_401);
    });
  
    it('Does not work with admin token', async () => {
      const response = await app.get(`/customers/${oldCustomerId}/`)
        .set('Authorization', adminToken);
      
      expect(response.status).toBe(AUTH_REQ_401);
    });
  
    it('Requires customer token', async () => {
      const response = await app.get(`/customers/${oldCustomerId}/`)
        .set('Authorization', customerToken);
      
      expect(response.status).toBe(OK_200);
    });
  });
  
  describe('Delete customer by id', () => {
    it('Requires authentication', async () => {
      const response = await app.delete(`/customers/${oldCustomerId}/`);
      expect(response.status).toBe(AUTH_REQ_401);
    });
  });
  
  describe('Patch customer by id', () => {
    it('Requires authentication', async () => {
      const response = await app.patch(`/customers/${oldCustomerId}/`);
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
});
