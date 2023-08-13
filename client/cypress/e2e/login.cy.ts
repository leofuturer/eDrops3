describe('Login page tests', () => {
  beforeEach(() => {
    cy.visit('localhost:8086/login');
  });

  it('Check if inputs exist', () => {
    cy.get('[data-cy="usernameOrEmail"]').should('be.visible');
    cy.get('[data-cy="password"]').should('be.visible');
  });

  it('Login with valid credentials', () => {
    cy.get('[data-cy="usernameOrEmail"]').type('customerA');
    cy.get('[data-cy="password"]').type('edropTest123');
    cy.get('[data-cy="submit"]').click();

    cy.url().should('include', '/home');
  });

  it('Login with invalid credentials', () => {
    cy.get('[data-cy="usernameOrEmail"]').type('abcdef');
    cy.get('[data-cy="password"]').type('notPassword');
    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="invalidCreds"]').should('be.visible');
    cy.get('[data-cy="invalidCreds"]').should('contain', 'Login error. Please check login credentials and ensure email is verified.');

    cy.url().should('include', '/login');
  });

  it('Forgot password redirect', () => {
    cy.get('[data-cy="forgotPass"]').click();

    cy.url().should('include', '/forgot-password');
  });

  it('Signup redirect', () => {
    cy.get('[data-cy="register"]').click();

    cy.url().should('include', '/signup');
  });
});
