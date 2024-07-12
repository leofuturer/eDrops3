describe('Login page tests', () => {
    beforeEach(() => {
      cy.visit('localhost:8087/login');
    });
  
    it('Check if inputs exist', () => {
      cy.get('input[name=usernameOrEmail]').should('be.visible');
      cy.get('input[name=password]').should('be.visible');
    });
  
    it('Login with valid credentials', () => {
      cy.get('input[name=usernameOrEmail]').type('customerA');
      cy.get('input[name=password]').type('edropTest123');
      cy.get('button[type=submit]').click();
  
      cy.url().should('include', '/home');
    });
  
    it('Login with invalid credentials', () => {
      cy.get('input[name=usernameOrEmail]').type('abcdef');
      cy.get('input[name=password]').type('notPassword');
      cy.get('button[type=submit]').click();
  
      cy.url().should('include', '/login');
    });
  
    // it('Forgot password redirect', () => {
    //   cy.get('a[href*="/forgetPass"]').click();
  
    //   cy.url().should('include', '/forgetPass');
    // });
  
    // it('Signup redirect', () => {
    //   cy.get('a[href*="/register"]').click();
  
    //   cy.url().should('include', '/register');
    // });
  });
  