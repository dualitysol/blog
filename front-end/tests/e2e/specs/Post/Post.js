/// <reference types="cypress" />
const {
  Given,
  When,
  And,
  Then,
} = require("cypress-cucumber-preprocessor/steps");

const Page = require("../base-spec-class.js");

const page = new Page("http://localhost:8080");

Given("I am a logged in user", () => {
  cy.clearLocalStorage();
  const userData = {
    id: 1,
    username: "username",
    email: "user@email.com",
  };
  const posts = [];
  cy.intercept({
    method: "POST",
    url: "http://localhost:3001/user/signin"
  }, { userData, token: "testToken" }).as("login")
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "GET"
  }, { posts })
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "POST"
  }, {
    message: "Blog Post posted successfully!",
  });
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

When("I click on {string} link on the {string} page", (btnName, pageName) => {
  const linkBtn = btnName + "-link";

  page.checkPageUrl(pageName.replace("Page", " "));
  page.clickButton(linkBtn);
});

And("I fill in {string} with {string}", (fieldName, value) => {
  page.getElementByIdName("", fieldName).type(value);
});

And("I click on the {string} button", (btn) => {
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "GET"
  }, { posts: [{
    id: 1,
    title: "Title",
    description: "Description",
    content: "content",
  }] })
  page.clickButton(btn);
});

Then("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});

And("I should see the new blog listing on the Homepage", () => {
  cy.get("div#blog-listing").should("be.visible");
})