
describe('Forum post tests', () => {
    beforeEach(() => {
        cy.login('customerA', 'edropTest123');
        cy.wait(1000);
        cy.get('a[href*="/forum"]').first().click();
    })

    it('Creating a new post', () => {
        cy.get('a[href*="/forum/new"').click();
        cy.get('input[data-cy=postTitle]').type("Cypress Test Post");
        cy.get('textarea[data-cy=postContent]').type("Test Content");
        cy.get('button[data-cy=submitPost]').click();

        cy.url().should('match', /.*\/forum\/.+/);
        cy.get('[data-cy=postTitle]').should('contain', 'Cypress Test Post');
        cy.get('[data-cy=postAuthor]').should('contain', 'customerA');
        cy.get('[data-cy=postContent]').should('contain', 'Test Content');

    })
    
    it('Editing a post', () => {
        cy.get('[data-cy=openMenu]').first().click();
        cy.get('[data-cy=editButton]').first().click();
        cy.url().should('match', /.*\/forum\/new/);
        cy.wait(1000);
        cy.get('input[data-cy=postTitle]').type(" (editing cypress test)");
        cy.get('textarea[data-cy=postContent]').type(" (edited)");
        cy.get('button[data-cy=submitPost]').click();

        cy.url().should('match', /.*\/forum\/.+/);
        cy.get('[data-cy=postTitle]').should('contain', 'Cypress Test Post (editing cypress test)');
        cy.get('[data-cy=postAuthor]').should('contain', 'customerA');
        cy.get('[data-cy=postContent]').should('contain', 'Test Content (edited)');
    })


    it('Deleting a post', () => {
        cy.intercept('DELETE', '/api/users/*/posts/*').as('response');
        cy.get('[data-cy=openMenu]').first().click();
        cy.get('[data-cy=deleteButton]').first().click();
        cy.get('button[data-cy=deletePost]').click();

        cy.wait('@response').then(intercepted => {
            assert.isTrue(intercepted.response?.statusCode==200);
           
        })
    })

    it('Saving and liking a post', () => {
        
    })
})