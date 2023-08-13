describe('Products page tests', () => {
  beforeEach(() => {
    cy.visit('localhost:8086/products');
  });

  it('Check if item cards exist', () => {
    cy.get('[data-cy="grid"]').within(() => {
      cy.get('[data-cy="product"]').should('have.length', 3);
    });
  });
});
