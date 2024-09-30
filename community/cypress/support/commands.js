// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => {
    cy.visit('localhost:8087/login');
    cy.get('input[name=usernameOrEmail]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();
})

Cypress.Commands.add('signup', (username, email, password) => {
    cy.url().should('include', '/signup');
    cy.get('input[name=username]').should('be.visible');
    cy.get('input[name=email]').should('be.visible');
    cy.get('input[name=password]').should('be.visible');
    cy.get('input[name=confirmPassword]').should('be.visible');

    cy.get('input[name=username]').type(username);
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=confirmPassword]').type(password);

    cy.get('button[type=submit]').click();
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }