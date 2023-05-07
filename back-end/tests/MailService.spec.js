const MailService = require("../services/mail");
const nodemailer = require("nodemailer");


jest.mock("nodemailer", () => ({
  __esModule: true,
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => true)
  })),
}));

describe("Mail Service", () => {
  const mailService = new MailService(
    "testHost",
    "testUser",
    "testPass"
  );
  
  test("Creates transport", () => {
    expect(nodemailer.createTransport.mock.calls).toHaveLength(1);
    expect(nodemailer.createTransport.mock.calls[0][0]).toEqual({
      host: "testHost",
      port: 587,
      auth: {
        user: "testUser",
        pass: "testPass",
      },
    });
  });

  test("sendMail", async () => {
    const testReceiver = "testReceiver";
    const testSubject = "testSubject";
    const testText = "bla bla bla";

    await mailService.sendMail(testReceiver, testSubject, testText);

    expect(mailService.transporter.sendMail.mock.calls).toHaveLength(1);
    expect(mailService.transporter.sendMail.mock.calls[0][0]).toEqual({
      from: "testUser",
      to: testReceiver,
      subject: testSubject,
      text: testText,
    });
  });

  test("sendResetUrl", async () => {
    const testReceiver = "testReceiver";
    const testSubject = "Reset password";
    const testUrl = "testUrl";
    const testText = "Hello. Here is your link to reset password: testUrl . Its valid for 5 mins.";

    await mailService.sendResetUrl(testReceiver, testUrl);

    expect(mailService.transporter.sendMail.mock.calls).toHaveLength(2);
    expect(mailService.transporter.sendMail.mock.calls[1][0]).toEqual({
      from: "testUser",
      to: testReceiver,
      subject: testSubject,
      text: testText,
    });
  })
})
