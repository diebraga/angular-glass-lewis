import { environment } from '../../src/environments/environment.dev';

const user_email_mock = 'johndoe@example.com';
const user_password_mock = 'password123';
const ids_mock = ['1', '2', '3', '4', '5', '6'];
const update_data_mock = {
  name: 'Updated Company Name',
  stock_ticker: 'UPDT',
  exchange: 'Updated Exchange',
  isin: 'US1234567890',
  website_url: 'www.updated.com',
};

describe('Application Test Happy Part', () => {
  it('should test application flow successfully', () => {
    cy.visit(`${environment.clientUrl}`);

    // assert login form
    cy.get('.login-form').should('be.visible');

    // assert the link is present and click it to go to register page
    cy.get('a').should('be.visible').click();

    // assert register form is present
    cy.get('.register-form').should('be.visible');

    // test the link I already have an account
    cy.get('a').should('be.visible').click();

    // go back to register
    cy.get('a').should('be.visible').click();

    // register user
    cy.register('John', 'Doe', user_email_mock, user_password_mock);

    // login and navigate to next page
    cy.login(user_email_mock, user_password_mock);

    // assert cards exist
    cy.verifyCardsById(ids_mock);

    // perform the search by id
    cy.search('searchId', '3');

    // assert id 3 is there
    cy.verifyCardsById(['3']);

    // perform the search by Isin
    cy.search('searchIsin', 'US030000032');

    // assert id 5 is there
    cy.verifyCardsById(['5']);

    // click show all button
    cy.get('#all-btn').click();

    // click company to update
    cy.get('[ng-reflect-router-link="/main,1"]').click();

    // assert form detail is there
    cy.get('#form-detail').should('be.visible');

    // update company
    cy.updateForm(update_data_mock);

    cy.get('.btn-danger').click();
  });
});
