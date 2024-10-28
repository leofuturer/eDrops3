
describe("Placing order tests", () => {
    beforeEach(() => {
        cy.login("customerA", "edropTest123");
        cy.url().should('include', '/home');
    })
    it('Place an order', () => {
       
        cy.get('a[href*="/fab"]').filter(':visible').first().click();
        cy.url().should('include', '/fab');

        cy.get('input[type=file]').selectFile('./cypress/test.dxf', {force: true});
        cy.get('button[id="uploadFile"]').click();
        cy.wait(2000);
        const confirmation = cy.get('button[id="affirmative"]');
        if (confirmation) confirmation.click();
        cy.wait(3000);
        cy.get('button[id="affirmative"]').click();

        cy.wait(2000);
        cy.url().should('include', '/chip-fab');
        cy.get('button[id="addToCart"]').click();
        cy.url().should('include', 'manage/cart');
        cy.get('button[id="checkout"]').click();
        // cy.get('button[id="payment"]').click();

    })

    it('Delete from cart', () => {
        cy.intercept('PATCH', '/api/orders/*/order-chips/*').as("response");
        cy.visit('localhost:8086/manage/profile');
        cy.get('a[href*="/cart"').filter(':visible').click();
        const order = cy.get('button[data-cy=deleteButton]')
        if (order) {
            order.click();
            cy.wait(2000);
            cy.get('p[data-cy=emptyMessage]').should('exist');
        }
    })
})