/// <reference types="cypress" />
// eslint-disable-next-line no-unused-vars
const {
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");
const {
  initUserRoute,
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");

When("I navigate to the {string} page", (pageName) => {
  initUserRoute("reset-password", "reset",(req) => req.reply(401, {
    message: "Password reset token is invalid or has expired."
  }));

  const url = pageName.replace(" ", "-") + "?token=invalidToken";

  page.enterPage(url);
  page.typeInputById("password", "value");
  page.typeInputById("confirm-password", "value");
  page.clickButton("reset-password");
  // cy.wait("@reset");
});

Then("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});
