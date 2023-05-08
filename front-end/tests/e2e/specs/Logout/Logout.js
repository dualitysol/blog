/// <reference types="cypress" />
const {
  Given,
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
const {
  loginRoute,
  initUserRoute,
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");
const loginRequest = "login-request";

Given("I am a logged in user", () => {
  initUserRoute(loginRoute, loginRequest);
  page.enterPage("login");
  page.typeInputById("username", "username");
  page.typeInputById("password", "password");
  page.clickButton("log-in");
  cy.wait(`@${loginRequest}`);
  cy.window().then(win => {
    expect(win.store.getters.isAuthenticated).to.eq(true);
  });
});

And("I navigate to the {string} page", (pageName) => {
  page.enterPage(pageName.replace("Page", ""));
});

When("I click on {string} link on the {string} page", (btnName, pageName) => {
  const linkBtn = btnName + "-link";

  page.checkPageUrl(pageName);
  page.clickButton(linkBtn);
});

Then("I should be successfully logged out", () => {
  cy.window().then(win => {
    expect(win.store.getters.isAuthenticated).to.eq(false);
  });
});

And("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

When("I navigate to the {string} page", (pageName) => {
  page.clickButton(pageName);
});

Then("I should be redirected on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});