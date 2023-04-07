const nodemailer = require("nodemailer");
const password = process.env.emailPass ? process.env.emailPass : "";
const email = process.env.email ? process.env.email : "";
const emailMask = process.env.emailMask ? process.env.emailMask : "";
const mailService = process.env.mailService ? process.env.mailService : "";
const mailSecure = process.env.mailSecure
  ? process.env.mailSecure === "true"
  : "true";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = !!mailSecure ? "1" : "0";
export default {
  async DoSendEmail(mails: any) {
    const transporter = nodemailer.createTransport({
      service: mailService,
      secure: mailSecure,
      auth: {
        user: email,
        pass: password,
      },
    });
    if (!mailSecure) {
      transporter.tls = {
        rejectUnauthorized: false,
      };
    }
    for (let mail of mails) {
      let mailOptions = {
        from: emailMask,
        to: mail.to,
        subject: mail.title,
        text: mail.text,
        html: mail.html,
      };
      transporter.sendMail(mailOptions, (error: Error, info: any) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  },
};
