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

Given("I am a logged in user", () => {
  cy.clearLocalStorage();
  const userData = {
    id: 1,
    username: "username",
    email: "user@email.com",
  };
  const posts = [{
    title: "Post title",
    content: "Post content",
    description: "Post desc",
    id: 1,
    authorId: 1
  }];
  cy.intercept({
    method: "POST",
    url: "http://localhost:3001/user/signin"
  }, { userData, token: "testToken" }).as("login")
  cy.intercept({
    url: "http://localhost:3001/post",
    method: "GET"
  }, { posts })
  cy.intercept({
    url: "http://localhost:3001/comment/1",
    method: "GET"
  }, { comments: [] })
  cy.intercept({
    url: "http://localhost:3001/post/1",
    method: "GET"
  }, { ...posts[0], author: userData });

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

And("I see a blog listing on the Homepae", () => {
  cy.get("div#blog-listing").should("be.visible");
});

// Successful Add Comment to a Blog/Post

When("I click on {string} link on the {string} page", (btnName, pageName) => {
  const linkBtn = btnName + "-link";

  page.checkPageUrl(pageName);
  page.clickButton(linkBtn);
});

Then(`I should land on the "Blog Details" page`, () => {
  page.checkPageUrl("blog-details/1");
});

When("I fill in {string} with {string}", (fieldName, value) => {
  page.getElementByIdName("", fieldName).type(value);
});

And("I click on the {string} button", (btn) => {
  cy.intercept({
    url: "http://localhost:3001/comment/1",
    method: "POST"
  }, { message: "Comment added to the Post successfully!" })

  page.clickButton(btn);
});

Then("I should land on the {string} page", (pageName) => {
  page.checkPageUrl(pageName);
});

And("I should see {string} message as {string}", (alertType, alertContent) => {
  page.checkAlertType(alertType);
  page.checkAlertContent(alertContent);
});


And("I should see the comment added to the blog", () => {
  cy.intercept({
    url: "http://localhost:3001/comment/1",
    method: "GET"
  }, { comments: [{
    id: 1,
    name: "testindus",
    message: "thetaskdescriptionisincorrect",
    postId: 1,
  }] })

  page.enterPage("/blog-details/1");

  cy.contains("testindus");
  cy.contains("thetaskdescriptionisincorrect");
})