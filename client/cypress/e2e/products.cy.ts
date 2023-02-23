describe('Products page tests', () => {
  beforeEach(() => {
    cy.visit('localhost:8086/allItems');
  });

  it('Check if item cards exist', () => {
    cy.get('div.grid').within(() => {
      cy.get('div').should('have.length', 3);
    });
  });
});
