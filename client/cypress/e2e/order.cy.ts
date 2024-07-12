
describe("Placing order tests", () => {
    it('Place an order', () => {
        cy.login("customerA", "edropTest123");
        cy.url().should('include', '/home');
        cy.get('a[href*="/upload"]').filter(':visible').first().click();
        cy.url().should('include', '/upload');

        cy.get('input[type=file]').selectFile('./cypress/test.dxf', {force: true});
        cy.get('button[id="uploadFile"]').click();
        const confirmation = cy.get('button[id="affirmative"]');
        if (confirmation) confirmation.click();
        cy.get('button[id="affirmative"]').click();

        cy.wait(2000);
        cy.url().should('include', '/chip-fab');
        cy.get('button[id="addToCart"]').click();
        cy.url().should('include', 'manage/cart');
        cy.get('button[id="checkout"]').click();
        cy.get('button[id="payment"]').click();

    })
})