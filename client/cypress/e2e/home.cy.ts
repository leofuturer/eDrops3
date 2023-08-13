describe('Home page tests', () => {
  beforeEach(() => {
    cy.visit('localhost:8086/home');
  });


  it('Check if page cards exist', () => {
    cy.get('[data-cy="grid"]').within(() => {
      cy.get('[data-cy="page"]').should('have.length', 3);
    });
  });

  it('Check if product cards exist', () => {
    cy.get('[data-cy="products"]').within(() => {
      cy.get('[data-cy="product"]').should('have.length', 3);
    });
  });
});
