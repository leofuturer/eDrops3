describe('Login page tests', () => {
    beforeEach(() => {
        cy.visit('localhost:8086/login');
    });

    it('Check if inputs exist', () => {
        cy.get('input[name=usernameOrEmail]').should('be.visible');
        cy.get('input[name=password]').should('be.visible');
    })

    it('Login with valid credentials', () => {
        cy.get('input[name=usernameOrEmail]').type('customerA');
        cy.get('input[name=password]').type('edropTest123');
        cy.get('.input-btn').click();

        cy.url().should('include', '/home');
    })

    it('Login with invalid credentials', () => {
        cy.get('input[name=usernameOrEmail]').type('abcdef');
        cy.get('input[name=password]').type('notPassword');
        cy.get('.input-btn').click();

        cy.get('.help-block.error').should('be.visible');
        cy.get('.help-block.error').should('contain', 'Login error. Please check login credentials and ensure email is verified.');

        cy.url().should('include', '/login');
    })

    it('Forgot password redirect', () => {
        cy.get('#forget-pass').click();

        cy.url().should('include', '/forgetPass');
    })

    it('Signup redirect', () => {
        cy.get('#sign-up').click();

        cy.url().should('include', '/register');
    })
})