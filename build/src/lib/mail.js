"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const password = process.env.emailPass ? process.env.emailPass : "";
const email = process.env.email ? process.env.email : "";
const emailMask = process.env.emailMask ? process.env.emailMask : "";
const mailService = process.env.mailService ? process.env.mailService : "";
const mailSecure = process.env.mailSecure
    ? process.env.mailSecure === "true"
    : "true";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = !!mailSecure ? "1" : "0";
exports.default = {
    DoSendEmail(mails) {
        return __awaiter(this, void 0, void 0, function* () {
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
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }
        });
    },
};
