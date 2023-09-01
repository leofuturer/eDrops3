describe('Products page tests', () => {
  Cypress.Commands.add("login", (username, password) => {
    cy.visit('localhost:8086/login');
    cy.get('[data-cy="usernameOrEmail"]').type(username);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="submit"]').click();
  })

  beforeEach(() => {
    cy.login('customerA', 'edropTest123')
    cy.url().should('include', '/home');
  });


  it('Check profile information', () => {
    cy.visit('localhost:8086/manage/profile');
    cy.get('[data-cy="form-input"]').should('have.length', 11);
    cy.get('[data-cy="form-input"]').first().should('have.value', 'customerA');
    cy.get('[data-cy="form-input"]').last().should('have.value', 'United States');
  });

  it('Edit profile information', () => {
    cy.visit('localhost:8086/manage/profile');
    cy.get('[data-cy="form-input"]').last().clear().should('have.value', '').type("Canada");
    cy.get('[data-cy="profile-save"]').click();

    cy.visit('localhost:8086/home');
    cy.url().should('include', '/home');
    cy.visit('localhost:8086/manage/profile');
    cy.get('[data-cy="form-input"]').last().should('have.value', 'Canada');
    cy.get('[data-cy="form-input"]').last().clear().should('have.value', '').type("United States");
    cy.get('[data-cy="profile-save"]').click();
  });


  it('Check address information', () => {
    cy.visit('localhost:8086/manage/address');
    cy.get('[data-cy="address"]').should('have.length', 2);
    cy.get('[data-cy="address"]').first().within(() => {
      cy.get('[data-cy="default-address"]').should('have.length', 2);
    });

    cy.get('[data-cy="address-update"]').first().click();
    cy.get('[data-cy="form-input"]').first().should('have.value', '10988 Ashton Ave');
  });


  it('Add address information', () => {
    cy.visit('localhost:8086/manage/address');
    cy.get('[data-cy="address-add"]').click().then(() => {
      const addressInfo = ["608 LAX Way", "Apartment 6", "Los Angeles", "CA", "90000", "United States"]
      for (let i = 0; i < addressInfo.length; i++)
        cy.get('[data-cy="form-input"]').eq(i).clear().should('have.value', '').type(addressInfo[i]);
      cy.get('[data-cy="address-add-save"]').click()
    });
    cy.get('[data-cy="address"]').should('have.length', 3);
  });

  it('Edit address information', () => {
    cy.visit('localhost:8086/manage/address');
    cy.get('[data-cy="address-update"]').last().click().then(() => {
      const addressInfo = ["608 LAX Way", "Apartment 7", "Los Andres", "CA", "90001", "United States"]
      for (let i = 0; i < addressInfo.length; i++)
        cy.get('[data-cy="form-input"]').eq(i).clear().should('have.value', '').type(addressInfo[i]);
      cy.get('[data-cy="address-update-save"]').click()
    });

    cy.get('[data-cy="address-update"]').last().click().then(() => {
      const addressInfo = ["608 LAX Way", "Apartment 7", "Los Andres", "CA", "90001", "United States"]
      for (let i = 0; i < addressInfo.length; i++)
        cy.get('[data-cy="form-input"]').eq(i).should('have.value', addressInfo[i]);
    });
  });

  it('Delete address information', () => {
    cy.visit('localhost:8086/manage/address');
    cy.get('[data-cy="address"]').should('have.length', 3);
    cy.get('[data-cy="address-delete"]').last().click();
    cy.get('[data-cy="delete-modal-confirm"]').last().click();
    cy.get('[data-cy="address"]').should('have.length', 2);
  });




  it('Passwords', () => {
  });


  it('Can upload dxf files', () => {
    cy.visit('localhost:8086/upload');
    cy.get('[data-cy="file-select"]').selectFile("cypress/testfiles/dummy.dxf", { force: true });
    cy.get('[data-cy="file-upload"]').click();
    cy.wait(1000);
    cy.get('[data-cy="two-choice-modal-content"]').should("contain", "The file has been uploaded to your library successfully!");

  });

  it('Cant upload non-dxf files', () => {
    cy.visit('localhost:8086/upload');
    cy.get('[data-cy="file-select"]').selectFile("cypress/testfiles/test.txt", { force: true });
    cy.get('[data-cy="file-upload"]').click();
    cy.wait(1000);
    cy.get('[data-cy="two-choice-modal-content"]').should("contain", "The file has been uploaded to your library successfully!");

  });

  it('Check files', () => {
  });

  it('Add to cart', () => {
  });

  it('Checkout', () => {
  });

  it('Check orders', () => {
  });

});
