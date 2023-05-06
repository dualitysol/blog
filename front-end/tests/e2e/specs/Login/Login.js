/// <reference types="cypress" />
const {
  Given,
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
const {
  loginRoute,
  initAuthRoute,
  loginHandler,
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");
const loginRequest = "login-request";

//A Registered User navigates to Login page

Given("I am a registered user", () => {
  initAuthRoute(loginRoute, loginRequest, loginHandler);
});

And("I navigate to the {string} page", (pageName) => {
  page.enterPage(pageName);
});

// Successful login using valid credentials

When("I fill in {string} with {string}", (fieldName, value) => {
  page.typeInputById(fieldName, value);
});

And("I click on the {string} button", (btn) => {
  page.clickButton(btn.toLowerCase().replace(" ", "-"));
});

Then("I should be successfully logged in", () => {
  cy.wait("@" + loginRequest);
  cy.window().then(win => {
    expect(win.store.getters.isAuthenticated).to.eq(true);
  });
});

And("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} and {string} links", (link1, link2) => {
  page.checkBtnLinksExists(link1);
  page.checkBtnLinksExists(link2);
});

// Failed login using wrong credentials

Then("I should be redirected on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});

// Disabled Login when one of the required fields is left blank

Then(
  "I should see {string} message for {string} field on {string} page",
  (formError, inputField, pageName) => {
    page.checkPageUrl(pageName);
    page.checkErrorForInput(inputField, formError);
  }
);

And("I should see {string} buttton disbaled", (buttonName) => {
  page.checkBtnDisabled(buttonName);
});

And("I should not be able to submit the {string} form", () => {
  page.checkBtnDisabled("log-in");
});
