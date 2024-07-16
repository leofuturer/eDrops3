describe('Projects page tests', () => {
    beforeEach(() => {
        cy.login('customerA', 'edropTest123');
        cy.wait(1000);
        cy.get('a[href*="/projects"]').first().click();
    })
    it("Create a project", () => {

    })
})