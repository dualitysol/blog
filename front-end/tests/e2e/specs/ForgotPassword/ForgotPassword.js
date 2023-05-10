/// <reference types="cypress" />
const {
  Given,
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
const {
  forgotPasswordRoute,
  forgotPasswordHandler,
  initUserRoute,
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");

// before(() => {
// })

Given("I am a registered user", () => {
  initUserRoute(forgotPasswordRoute, "forgot-password", forgotPasswordHandler);
  page.enterPage("/registration");
});

And("I navigate to the {string} page", (pageName) => {
  page.clickButton(pageName + "-link");
});

// SuccessfulForgotPassword

When("I fill in {string} with {string}", (fieldName, value) => {
  page.typeInputById(fieldName, value);
});

And("I click on the {string} button", (btnName) => {
  page.clickButton(btnName);
});

Then("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

// failedForgotPassword

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});
