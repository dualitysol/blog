/// <reference types="cypress" />
// eslint-disable-next-line no-unused-vars
const {
  Given,
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
const {
  registerRoute,
  initUserRoute,
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");
const registerRequest = "register-request";

before(function () {
  cy.visit("/");

  initUserRoute(registerRoute, registerRequest);
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "GET"
  }, { posts: [] })
});

Given("I navigate to the {string} page", (pageName) => {
  page.enterPage(pageName);
});

When("I fill in {string} with {string}", (fieldName, value) => {
  page.typeInputById(fieldName, value);
});

And("I click on the {string} button", (btn) => {
  page.clickButton(btn.toLowerCase().replace(" ", "-"));
  // cy.getStore().its("getters.authenticated").should("equal", true);
  // cy.window().then((window) => {
  //   cy.wrap(window.$store.getters.isAuthenticated).should("equal", true);
  // });
});

Then("I should be successfully registered", () => {
  cy.wait("@register-request");
});

And("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});

And("I should see {string} and {string} links", (link1, link2) => {
  page.checkBtnLinksExists(link1);
  page.checkBtnLinksExists(link2);
});

// Disabled Registration when one of the required fields is left blank

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
  page.checkBtnDisabled("register-now");
});
