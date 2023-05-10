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
  defaultHandler,
  messageHandlerBuilder
} = require("../mocks");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");

Given("I am a logged in user", () => {
  cy.clearLocalStorage();
  const messageHandler = messageHandlerBuilder("Profile updated successfully!");
  const userData = {
    id: 1,
    username: "username",
    email: "user@email.com",
  };
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "GET"
  }, { posts: [] })
  initUserRoute(loginRoute, "login");
  initUserRoute("1", "get-user", (req) => defaultHandler(req, userData), "GET");
  initUserRoute("1", "update-user", messageHandler, "PATCH");
  page.enterPage("login");
  page.typeInputById("username", "username");
  page.typeInputById("password", "password");
  page.clickButton("log-in");
  cy.wait("@login");
  cy.window().then(win => {
    expect(win.store.getters.isAuthenticated).to.eq(true);
    expect(win.store.getters.userData.id).to.eq(1);
  });
});

And("I navigate to the {string} page", (pageName) => {
  page.enterPage(pageName.replace("page", " "));
});

// Successful View Profile

When("I click on {string} link on the {string} page", (btnName, pageName) => {
  const linkBtn = btnName + "-link";

  page.checkPageUrl(pageName.replace("Page", " "));
  page.clickButton(linkBtn);
});

Then("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} heading on the Profile page", (heading) => {
  cy.wait("@get-user");
  page.shouldSeeHeading(heading);
});

And("{string} link should be active on the Profile page", (btnName) => {
  const linkBtn = btnName.toLowerCase().replace(" ", "-") + "-link";

  page.getButton(linkBtn).should("be.visible");
});

And("{string} field should be prepopulated and set as {string} on the Profile page", (fieldName, property) => {
  const field = page.getInputByName(fieldName);

  field.should("be.visible");
  field.should('have.attr', 'readonly', 'readonly');
  field.invoke("val").should((text) => {
    expect(text).to.eq("username");
  });
});

And("{string} field should be prepopulated on the Profile page", (fieldName) => {
  const field = page.getInputByName(fieldName);

  field.should("be.visible");
  field.invoke("val").should((text) => {
    expect(text).to.eq("user@email.com");
  });
});

// Successful Edit Profile

And("I fill in First Name as {string}", (value) => {
  const fieldName = "FirstName"
  page.typeInputById(fieldName, value);
});

And("I fill in Last Name as {string}", (value) => {
  const fieldName = "LastName"
  page.typeInputById(fieldName, value);
});

And("I fill in Age as {string}", (value) => {
  const fieldName = "Age"
  page.typeInputById(fieldName, value);
});

And("I fill in Gender as {string}", (value) => {
  const fieldName = "Gender"
  page.typeInputById(fieldName, value);
});

And("I fill in Address as {string}", (value) => {
  const fieldName = "Address"
  page.typeInputById(fieldName, value);
});

And("I fill in Website as {string}", (value) => {
  const fieldName = "Website"
  page.typeInputById(fieldName, value);
});

And("I click on the {string} button", (btn) => {
  page.clickButton(btn);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});
