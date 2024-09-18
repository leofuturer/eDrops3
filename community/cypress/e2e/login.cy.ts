describe('Login/Signup page tests', () => {
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
  
  
    it('Signup with valid credentials', () => {
      cy.get('a[href*="/signup"]').click();
      const username = crypto.randomUUID().substring(0, 8);
      cy.signup(username, username+"@gmail.com", "edropTest123");
      cy.get('button[type=submit]').click();
      cy.url().should('include', 'check-email');

    });

    it('Signup with invalid username', () => {
      cy.get('a[href*="/signup"]').click();
      const username = 'customerA';
      cy.signup(username, username+"@gmail.com", "edropTest123");
      cy.get('button[type=submit]').click();
      // check for error (for now just check no redirect)
      cy.url().should('include', '/signup');
    })

    it('Signup with invalid email', () => {
      cy.get('a[href*="/signup"]').click();
      const username = crypto.randomUUID().substring(0, 8);
      cy.signup(username, "cdevadhar@gmail.com", "edropTest123");
      cy.get('button[type=submit]').click();
      // check for error (for now just check no redirect)
      cy.url().should('include', '/signup');
    })
  });
  