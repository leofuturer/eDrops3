// cypress/support/index.ts
export {}

declare global {
    namespace Cypress {
      interface Chainable {
        login(username: string, password: string): Chainable<JQuery<HTMLElement>>
        signup(username: string, email: string, password: string): Chainable<JQuery<HTMLElement>>
      }
    }
  }