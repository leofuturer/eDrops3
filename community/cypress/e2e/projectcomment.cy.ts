describe('Forum comment tests', () => {
    beforeEach(() => {
        cy.login("customerA", "edropTest123");
        cy.wait(1000);
        cy.get('a[href*="/projects"]').first().click();
        cy.wait(1000);
        cy.get('a[href*="/project/"]').then(links => {
            for (const link of links) {
                console.log(typeof link);
                if (!link.href.includes("new")) {
                    link.click();
                    break;
                }
            }
        })
    })

    it("Post a comment", () => {
        cy.intercept('POST', '/api/comments/project/*').as('response');
        cy.wait(1000);
        cy.get('*[data-cy=writeComment]').click();
        cy.get('textarea[data-cy=commentArea]').type("Test Cypress Comment");
        cy.get('button[data-cy=submitComment]').click();

        cy.wait("@response").then(intercepted => {
            assert.isTrue(intercepted.response?.statusCode==200);
        })
        cy.get('*[data-cy=commentAuthor]').first().should('contain', 'customerA')
        cy.get('*[data-cy=commentContent]').first().should('contain', 'Test Cypress Comment');

    })

    it("Like a comment", () => {
        cy.intercept('POST', '/api/users/*/liked-comments/*').as("response");
        cy.get('*[data-cy=likeComment]').first().click();
        cy.wait("@response").then(intercepted => {
            // 204 is no content, I'll change this in the api later
            assert.isTrue(intercepted.response?.statusCode==204);
        });
        cy.get('p[data-cy=commentLikes]').first().should('contain', 1);
    })

    it("Edit a comment", () => {
        cy.intercept('PATCH', '/api/comments/*').as("response");
        cy.get('button[data-cy=editButton]').first().click();
        cy.get('*[data-cy=commentEditor]').first().type(" (edited)");
        cy.get('button[data-cy=editButton]').first().click();
        cy.wait("@response").then(intercepted => {
            // 204 is no content, I'll change this in the api later
            assert.isTrue(intercepted.response?.statusCode==204);
        })
        cy.get('*[data-cy=commentContent]').first().should('contain', 'Test Cypress Comment (edited)');
    })

    it("Delete a comment", () => {
        cy.intercept('DELETE', '/api/comments/*').as("response");
        cy.get('button[data-cy=deleteButton]').first().click();
        cy.wait("@response").then(intercepted => {
            // 204 is no content, I'll change this in the api later
            assert.isTrue(intercepted.response?.statusCode==204);
        })
        cy.get('*[data-cy=commentAuthor]').first().should('contain', 'DELETED')
        cy.get('*[data-cy=commentContent]').first().should('contain', 'DELETED');
    })

})