
describe("Placing order tests", () => {
    it('Place an order', () => {
        cy.login("customerA", "edropTest123");
        cy.url().should('include', '/home');
        cy.get('a[href*="/upload"]').filter(':visible').first().click();
        cy.url().should('include', '/upload');
        cy.get('input[type=file]').selectFile('./cypress/test.dxf', {force: true});
        cy.get('button').contains('Upload File').click();
        cy.get('button').contains('Upload this file').click();
        cy.get('button').contains('Proceed to fabrication').click();

        cy.url().should('include', '/chip-fab');
        cy.get('button').contains('Add to Cart').click();
        cy.url().should('include', 'manage/cart');
        cy.get('button').contains('Checkout').click();
    })
})