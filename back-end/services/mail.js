const nodemailer = require("nodemailer");

module.exports = class MailService {
  /**
   * @param { String } host - smtp host
   * @param { String } user - smtp user
   * @param { String } pass - smtp user pass
   */
  constructor(host, user, pass) {
    this.user = user;
    this.transporter = nodemailer.createTransport({
      host,
      port: 587,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(receiver, subject, text) {
    return this.transporter.sendMail({
      from: this.user,
      to: receiver,
      subject,
      text,
    });
  }

  /**
   * @param { String } email - user email to receive
   * @param { String } url - generated url to reset password
   */
  sendResetUrl(email, url) {
    const subject = "Reset password";
    const text = `Hello. Here is your link to reset password: ${url} . Its valid for 5 mins.`;

    return this.sendMail(email, subject, text);
  }
};
