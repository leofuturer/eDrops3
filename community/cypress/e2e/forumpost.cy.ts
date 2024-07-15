
describe('Forum post tests', () => {
    beforeEach(() => {
        cy.login('customerA', 'edropTest123');
        cy.wait(1000);
        cy.get('a[href*="/forum"]').first().click();
    })

    it('Creating a new post', () => {
        cy.get('a[href*="/forum/new"').click();
        cy.get('input[id=postTitle]').type("Cypress Test Post");
        cy.get('textarea[id=postContent]').type("Test Content");
        cy.get('button[id=submitPost]').click();

        cy.url().should('match', /.*\/forum\/.+/);
        cy.get('[id=postTitle]').should('contain', 'Cypress Test Post');
        cy.get('[id=postAuthor]').should('contain', 'customerA');
        cy.get('[id=postContent]').should('contain', 'Test Content');

    })
    
    it('Editing a post', () => {
        cy.get('[id=openMenu]').first().click();
        cy.get('[id=editButton]').first().click();
        cy.url().should('match', /.*\/forum\/new/);
        cy.wait(1000);
        cy.get('input[id=postTitle]').type(" (editing cypress test)");
        cy.get('textarea[id=postContent]').type(" (edited)");
        cy.get('button[id=submitPost]').click();

        cy.url().should('match', /.*\/forum\/.+/);
        cy.get('[id=postTitle]').should('contain', 'Cypress Test Post (editing cypress test)');
        cy.get('[id=postAuthor]').should('contain', 'customerA');
        cy.get('[id=postContent]').should('contain', 'Test Content (edited)');
    })

    // it('Editing a post from user profile', () => {

    // })

    it('Deleting a post', () => {
        cy.intercept('DELETE', '/api/users/*/posts/*').as('response');
        cy.get('[id=openMenu]').first().click();
        cy.get('[id=deleteButton]').first().click();
        cy.get('button[id=deletePost]').click();

        cy.wait('@response').then(intercepted => {
            assert.isTrue(intercepted.response?.statusCode==200);
           
        })
    })
})