const registerRoute = "signup";
const loginRoute = "signin";
const forgotPasswordRoute = "forgot-password";
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

const defaultHandler = (req, data = successAuthResponse) => {
  return req.reply(data);
}

const messageHandlerBuilder = (message) => (req) => {
  return req.reply({ message });
}

const loginHandler = (req) => {
  const correctUsername = req.body.username === testUsername;
  const correctPassword = req.body.password === testPassword;

  if (correctUsername && correctPassword) {
    return req.reply(successAuthResponse);
  }

  req.reply(401, {
    message: "Invalid username/password, Try again!"
  });
}

const forgotPasswordHandler = (req) => {
  const correctEmail = req.body.email === testEmail;

  if (correctEmail) return req.reply({ message: "Success" });

  req.reply(404, {
    message: "No account with that email address exists."
  });
}

const initUserRoute = (authRoute, requestName, response = defaultHandler, method = "POST") => {
  cy.intercept(
    {
      method,
      url: `http://localhost:3001/user/${authRoute}`,
    },
    response
  ).as(requestName);
};

module.exports = {
  registerRoute,
  loginRoute,
  initUserRoute,
  loginHandler,
  forgotPasswordRoute,
  forgotPasswordHandler,
  defaultHandler,
  messageHandlerBuilder,
}
