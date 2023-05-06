const registerRoute = "signup";
const loginRoute = "signin";
const testUsername = "asdf.asdf";
const testEmail = "asdf.asdf@example.com";
const testPassword = "Asdf@1234";
const successAuthResponse = {
  userData: {
    id: 1,
    username: testUsername,
    email: testEmail,
  },
  token: "testToken",
};

const defaultHandler = (req) => {
  return req.reply(successAuthResponse);
}

const loginHandler = (req) => {
  const correctUsername = req.body.username === testUsername;
  const correctPassword = req.body.password === testPassword;

  if (correctUsername && correctPassword) {
    return req.reply(successAuthResponse);
  }

  req.reply((res) => res.send({
    status: 401,
    message: "Invalid username/password, Try again!"
  }));
}

const initAuthRoute = (authRoute, requestName, response = defaultHandler) => {
  cy.server();
  cy.intercept(
    {
      method: "POST",
      url: `/user/${authRoute}`,
    },
    response
  ).as(requestName);
};

module.exports = {
  registerRoute,
  loginRoute,
  initAuthRoute,
  loginHandler,
}
