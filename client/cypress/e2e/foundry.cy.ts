describe('Products page tests', () => {
  before(() => {
    cy.visit('localhost:8086/login');
    cy.get('[data-cy="usernameOrEmail"]').type('glassfab');
    cy.get('[data-cy="password"]').type('edropTest123');
    cy.get('[data-cy="submit"]').click();
  });

  it('List orders', () => {
  });

  it('Edit orders', () => {
  });

});
