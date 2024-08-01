// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add('login', (email, password) => {
  cy.get('input[name="email"]').should('be.visible').type(email);
  cy.get('input[name="password"]').should('be.visible').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('register', (name, surname, email, password) => {
  cy.get('input[name="name"]').should('be.visible').type(name);
  cy.get('input[name="surname"]').should('be.visible').type(surname);
  cy.get('input[name="email"]').should('be.visible').type(email);
  cy.get('input[name="password"]').should('be.visible').type(password);
  cy.get('input[name="confirmPassword"]').should('be.visible').type(password);
  // submit form
  // cy.get('button[type="submit"]').click();
  cy.go('back');
});

Cypress.Commands.add('verifyCardsById', (ids) => {
  ids.forEach((id) => {
    cy.contains(`ID: ${id}`).should('exist');
  });
});

Cypress.Commands.add('search', (id, searchTerm) => {
  cy.get(`#${id}`).should('be.visible').type(searchTerm);

  cy.get(`#${id}-search-button`).should('be.visible').click();
});

Cypress.Commands.add(
  'updateForm',
  ({
    name = '',
    stock_ticker = '',
    exchange = '',
    isin = '',
    website_url = '',
  }) => {
    // Update the form fields with the provided values
    cy.get('#name').should('be.visible').clear().type(name);
    cy.get('#stock_ticker').should('be.visible').clear().type(stock_ticker);
    cy.get('#exchange').should('be.visible').clear().type(exchange);
    cy.get('#isin').should('be.visible').clear().type(isin);
    cy.get('#website_url').should('be.visible').clear().type(website_url);

    // Submit the form
    cy.get('.btn-primary').then(($btn) => {
      if (!$btn.prop('disabled')) {
        cy.wrap($btn).click();
      }
    });
  }
);
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
