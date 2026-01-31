const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
});

async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        from: `"UPTOR" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    });
}

module.exports = sendEmail