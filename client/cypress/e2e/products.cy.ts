describe('Products page tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('localhost:8086/products');
  });

  it('Check if item cards exist', () => {
    cy.get('[data-cy="grid"]').within(() => {
      cy.get('[data-cy="product"]').should('have.length', 3);
    });
  });

  it('Check if prices are listed and links work', () => {
    cy.get('[data-cy="product-price"]').should('contain', '$');
    cy.get('[data-cy="product-details"]').should('contain', 'Details');
    cy.get('[data-cy="product-link"]').should('have.attr', 'href').should('contain', '/product/');
  });

});
